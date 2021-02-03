const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const { mainContractABI } = require('./constants/ABI/main-contract');
const { storageContractABI } = require('./constants/ABI/storage-contract');
const {
  MAIN_CONTRACT_MAINNET,
  MAIN_CONTRACT_ROPSTEN,
  MAIN_CONTRACT_RINKEBY,
  MAIN_CONTRACT_KOVAN,
  MAIN_CONTRACT_GOERLI,
  STORAGE_CONTRACT_MAINNET,
  STORAGE_CONTRACT_ROPSTEN,
  STORAGE_CONTRACT_RINKEBY,
  STORAGE_CONTRACT_KOVAN,
  STORAGE_CONTRACT_GOERLI
} = require('./config');
const {
  INVALID_INBLOXID, INVALID_ADDRESS, INBLOXID_MAX_COUNT, INVALID_INPUT, INBLOXID_REG_ON_HOLD, ADDRESS_ALREADY_TAKEN, INBLOXID_ALREADY_TAKEN,
} = require('./constants/errors');

let web3;

//  Get the contract addresses for the current Ethereum network
async function getContractAddress() {
  let network;

  await this.web3.eth.net.getNetworkType().then((e) => network = e);

  if(network === 'main') {
    return { main: MAIN_CONTRACT_MAINNET, storage: STORAGE_CONTRACT_MAINNET }
  } else if(network === 'ropsten') {
    return { main: MAIN_CONTRACT_ROPSTEN, storage: STORAGE_CONTRACT_ROPSTEN }
  } else if(network === 'rinkeby') {
    return { main: MAIN_CONTRACT_RINKEBY, storage: STORAGE_CONTRACT_RINKEBY }
  } else if(network === 'kovan') {
    return { main: MAIN_CONTRACT_KOVAN, storage: STORAGE_CONTRACT_KOVAN }
  } else if(network === 'goerli') {
    return { main: MAIN_CONTRACT_GOERLI, storage: STORAGE_CONTRACT_GOERLI }
  }

}

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
    return { error: [ { name: 'address & inblox id', message: error.message } ] };
  }
}

//  Function to check Inblox ID validity
async function isInbloxIdValid(inbloxId) {
  const inbloxIdLength = inbloxId.length;

  if (inbloxIdLength >= 4 && inbloxIdLength <= 16 && inbloxIdLength.match(/^[0-9a-z]+$/i) !== null) {
    return true;
  }

  return false;
}

class InbloxID {
  constructor({ rpcUrl }) {
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    this.MainContractABI = mainContractABI;
    this.StorageContractABI = storageContractABI;
  }

  //  Get the status of Inblox ID registration
  async isRegistrationPaused() {
    const { main: MAIN_CONTRACT_ADDRESS } = await getContractAddress();

    const MainContract = new web3.eth.Contract(this.MainContractABI, MAIN_CONTRACT_ADDRESS);

    const isRegistrationPaused = await MainContract.methods.inbloxIdRegStatus().call();

    return isRegistrationPaused;
  }

  //  Get the number of times the user updated their Inblox ID
  async getUpdateCount(address) {
    try {
      const { storage: STORAGE_CONTRACT_ADDRESS } = await getContractAddress();

      const StorageContract = new web3.eth.Contract(this.StorageContractABI, STORAGE_CONTRACT_ADDRESS);

      const updateCount = await StorageContract.methods.totalInbloxIDCount(address).call();

      return updateCount;
    } catch (error) {
      return INVALID_ADDRESS;
    }
  }

  //  Get the Inblox ID from address
  async getInbloxId(userAddress) {
    try {
      const { storage: STORAGE_CONTRACT_ADDRESS } = await getContractAddress();

      const StorageContract = new web3.eth.Contract(this.StorageContractABI, STORAGE_CONTRACT_ADDRESS);

      const userInbloxID = await StorageContract.methods.resolveUserAddress(userAddress).call();

      return userInbloxID;
    } catch (error) {
      return INVALID_ADDRESS;
    }
  }

  //  Resolve the user's address from their Inblox ID
  async getAddress(inbloxID) {
    const { storage: STORAGE_CONTRACT_ADDRESS } = await getContractAddress();

    const StorageContract = new web3.eth.Contract(this.StorageContractABI, STORAGE_CONTRACT_ADDRESS);

    const userAddress = await StorageContract.methods.resolveInbloxId(inbloxID).call();

    return userAddress;
  }

  //  Get the Inblox ID registration fees
  async inbloxIdFees() {
    const { main: MAIN_CONTRACT_ADDRESS } = await getContractAddress();

    const MainContract = new web3.eth.Contract(this.MainContractABI, MAIN_CONTRACT_ADDRESS);

    const inbloxIdFees = await MainContract.methods.inbloxIdFees().call();

    return inbloxIdFees;
  }

  //  Register a new user with Inblox ID
  async setInbloxId(payload) {
    const {
      userAddress, inbloxId, from, privateKey,
    } = payload;

    const isInbloxIDRegOnHold = await this.isRegistrationPaused();

    if (isInbloxIDRegOnHold) {
      return INBLOXID_REG_ON_HOLD;
    }

    const isAddressTaken = await this.getInbloxId(userAddress);

    if (isAddressTaken !== 'Invalid address.') {
      return ADDRESS_ALREADY_TAKEN;
    }

    const addressOfInbloxId = await this.getAddress(inbloxId);

    if (addressOfInbloxId !== '0x0000000000000000000000000000000000000000') {
      return INBLOXID_ALREADY_TAKEN;
    }

    const fees = await this.inbloxIdFees();
    const isInbloxIDValid = await isInbloxIdValid(inbloxId);

    if (isInbloxIDValid === false) {
      return INVALID_INBLOXID;
    }

    try {
      const { main: MAIN_CONTRACT_ADDRESS } = await getContractAddress();

      const MainContract = new web3.eth.Contract(this.MainContractABI, MAIN_CONTRACT_ADDRESS);

      const encodedABI = await MainContract.methods.registerInbloxId(userAddress, inbloxId).encodeABI();
      const gas = 4000000;

      const response = await sendTransaction({
        encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees,
      });

      return response;
    } catch (error) {
      return error;
    }
  }

  //  Update Inblox ID of the user
  async updateInbloxId(payload) {
    const {
      userAddress, newInbloxId, from, privateKey,
    } = payload;

    const isInbloxIdRegOnHold = await this.isRegistrationPaused();

    if (isInbloxIdRegOnHold) {
      return INBLOXID_REG_ON_HOLD;
    }

    const addressOfInbloxId = await this.getAddress(newInbloxId);

    if (addressOfInbloxId !== '0x0000000000000000000000000000000000000000') {
      return INBLOXID_ALREADY_TAKEN;
    }

    const updateCount = await this.getUpdateCount(userAddress);
    const fees = await this.inbloxIdFees();
    const isInbloxIDValid = await isInbloxIdValid(newInbloxId);

    if (updateCount >= 2) {
      return INBLOXID_MAX_COUNT;
    } if (isInbloxIDValid === false) {
      return INVALID_INBLOXID;
    }

    try {
      const { main: MAIN_CONTRACT_ADDRESS } = await getContractAddress();

      const MainContract = new web3.eth.Contract(this.MainContractABI, MAIN_CONTRACT_ADDRESS);

      const encodedABI = await MainContract.methods.updateInbloxId(userAddress, newInbloxId).encodeABI();
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

module.exports = { InbloxID };
