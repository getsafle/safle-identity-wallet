const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const { mainContractABI } = require('./constants/ABI/main-contract');
const { storageContractABI } = require('./constants/ABI/storage-contract');
const { MAIN_CONTRACT_ADDRESS, STORAGE_CONTRACT_ADDRESS } = require('./constants/config');
const {
  INVALID_HANDLENAME, INVALID_ADDRESS, HN_MAX_COUNT, INVALID_INPUT, HANDLENAME_REG_ON_HOLD, HANDLENAME_ALREADY_TAKEN,
} = require('./constants/errors');

let web3;

// POST method reusable code
async function sendTransaction(payload) {
  try {
    const {
      encodedABI, gas, from, to, privateKey, value,
    } = payload;

    const gasPrice = await web3.eth.getGasPrice();
    const count = await web3.eth.getTransactionCount(from);
    const nonce = await web3.utils.toHex(count);

    const rawTx = {
      from,
      value: web3.utils.numberToHex(value),
      nonce: web3.utils.numberToHex(nonce),
      to,
      gas: web3.utils.numberToHex(gas),
      gasPrice: web3.utils.numberToHex(gasPrice),
      data: encodedABI,
      chainId: 3,
    };
    const pkey = Buffer.from(privateKey, 'hex');
    const tx = new Tx(rawTx, { chain: 'ropsten', hardfork: 'petersburg' });

    tx.sign(pkey);
    const stringTx = `0x${tx.serialize().toString('hex')}`;

    const response = await web3.eth.sendSignedTransaction(stringTx);

    return response;
  } catch (error) {
    return { error: [ { name: 'address & handlename', message: error.message } ] };
  }
}

//  Function to check handlename validity
async function isHandlenameValid(handlename) {
  const handlenameLength = handlename.length;

  if (handlenameLength >= 4 && handlenameLength <= 16 && handlename.match(/^[0-9a-z]+$/i) !== null) {
    return true;
  }

  return false;
}

class InbloxHandlename {
  constructor({ infuraKey, rpcUrl }) {
    if (!rpcUrl) {
      web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${infuraKey}`));
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    }
    this.MainContractAddress = MAIN_CONTRACT_ADDRESS;
    this.MainContractABI = mainContractABI;
    this.StorageContractAddress = STORAGE_CONTRACT_ADDRESS;
    this.StorageContractABI = storageContractABI;
    this.MainContract = new web3.eth.Contract(this.MainContractABI, this.MainContractAddress);
    this.StorageContract = new web3.eth.Contract(this.StorageContractABI, this.StorageContractAddress);
  }

  //  Get the status of handlename registration
  async isHandlenameRegistrationPaused() {
    const isHandlenameRegistrationPaused = await this.MainContract.methods.isHandlenameRegistrationPaused().call();

    return isHandlenameRegistrationPaused;
  }

  //  Get the number of times the user updated their handlename
  async handlenameUpdateCount(address) {
    try {
      const updateCount = await this.StorageContract.methods.updateCount(address).call();

      return updateCount;
    } catch (error) {
      return INVALID_ADDRESS;
    }
  }

  //  Get the handlename from address
  async resolveHandleNameFromAddress(userAddress) {
    try {
      const userHandlename = await this.StorageContract.methods.resolveHandleName(userAddress).call();

      return userHandlename;
    } catch (error) {
      return INVALID_ADDRESS;
    }
  }

  //  Resolve the user's address from their handlename
  async resolveAddressFromHandleName(handleName) {
    const userAddress = await this.StorageContract.methods.resolveHandleNameString(handleName).call();

    return userAddress;
  }

  //  Get the handlename registration fees
  async handlenameFees() {
    const handlenameFees = await this.MainContract.methods.userHandleNameRegFees().call();

    return handlenameFees;
  }

  //  Register a new user with handlename
  async setHandlename(payload) {
    const {
      userAddress, handleName, from, privateKey,
    } = payload;

    const fees = await this.handlenameFees();
    const isHNValid = await isHandlenameValid(handleName);

    if (isHNValid === false) {
      return INVALID_HANDLENAME;
    }

    try {
      const encodedABI = await this.MainContract.methods.addHandleName(userAddress, handleName).encodeABI();
      const gas = 4000000;

      const response = await sendTransaction({
        encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees,
      });

      return response;
    } catch (error) {
      return error;
    }
  }

  //  Update handlename of the user
  async updateHandlename(payload) {
    const {
      userAddress, newHandleName, from, privateKey,
    } = payload;

    const isHandlenameRegOnHold = await this.isHandlenameRegistrationPaused();

    if (isHandlenameRegOnHold) {
      return HANDLENAME_REG_ON_HOLD;
    }

    const addressOfHandlename = await this.resolveAddressFromHandleName(newHandleName);

    if (addressOfHandlename !== '0x0000000000000000000000000000000000000000') {
      return HANDLENAME_ALREADY_TAKEN;
    }

    const updateCount = await this.handlenameUpdateCount(userAddress);
    const fees = await this.handlenameFees();
    const isHNValid = await isHandlenameValid(newHandleName);

    if (updateCount >= 2) {
      return HN_MAX_COUNT;
    } if (isHNValid === false) {
      return INVALID_HANDLENAME;
    }

    try {
      const encodedABI = await this.MainContract.methods.updateHandleNameOfUser(userAddress, newHandleName).encodeABI();
      const gas = 4000000;

      const response = await sendTransaction({
        encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees,
      });

      return response;
    } catch (error) {
      return INVALID_INPUT;
    }
  }
}

module.exports = { InbloxHandlename };
