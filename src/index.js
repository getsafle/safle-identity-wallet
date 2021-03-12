const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const { mainContractABI } = require('./constants/ABI/main-contract');
const { storageContractABI } = require('./constants/ABI/storage-contract');
const {
  MAIN_CONTRACT_MATIC_TESTNET,
  STORAGE_CONTRACT_MATIC_TESTNET,
  CHAIN_ID_MATIC_TESTNET,
  MATIC_TESTNET_RPC_URL,
} = require('./config');
const {
  INVALID_SAFLEID, INVALID_ADDRESS, SAFLEID_MAX_COUNT, INVALID_INPUT, SAFLEID_REG_ON_HOLD, ADDRESS_ALREADY_TAKEN, SAFLEID_ALREADY_TAKEN, SAFLE_ID_NOT_REGISTERED,
} = require('./constants/errors');

let web3;

//  Get the contract addresses for the current Ethereum network
async function getContractAddress() {
  return { main: MAIN_CONTRACT_MATIC_TESTNET, storage: STORAGE_CONTRACT_MATIC_TESTNET };
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
      chainId: CHAIN_ID_MATIC_TESTNET,
    };

    const pkey = Buffer.from(privateKey, 'hex');
    const tx = new Tx(rawTx);

    tx.sign(pkey);
    const stringTx = `0x${tx.serialize().toString('hex')}`;

    const response = await web3.eth.sendSignedTransaction(stringTx);

    return response;
  } catch (error) {
    return { error: [ { name: 'address & safle id', message: error.message } ] };
  }
}

//  Function to check Safle ID validity
async function isSafleIdValid(safleId) {
  const safleIdLength = safleId.length;

  if (safleIdLength >= 4 && safleIdLength <= 16 && safleIdLength.match(/^[0-9a-z]+$/i) !== null) {
    return true;
  }

  return false;
}

class SafleID {
  constructor() {
    web3 = new Web3(new Web3.providers.HttpProvider(MATIC_TESTNET_RPC_URL));
    this.MainContractABI = mainContractABI;
    this.StorageContractABI = storageContractABI;
  }

  //  Get the status of Safle ID registration
  async isRegistrationPaused() {
    const { main: MAIN_CONTRACT_ADDRESS } = await getContractAddress();

    const MainContract = new web3.eth.Contract(this.MainContractABI, MAIN_CONTRACT_ADDRESS);

    const isRegistrationPaused = await MainContract.methods.safleIdRegStatus().call();

    return isRegistrationPaused;
  }

  //  Get the number of times the user updated their Safle ID
  async getUpdateCount(address) {
    try {
      const { storage: STORAGE_CONTRACT_ADDRESS } = await getContractAddress();

      const StorageContract = new web3.eth.Contract(this.StorageContractABI, STORAGE_CONTRACT_ADDRESS);

      const updateCount = await StorageContract.methods.totalSafleIDCount(address).call();

      return updateCount;
    } catch (error) {
      return INVALID_ADDRESS;
    }
  }

  //  Get the Safle ID from address
  async getSafleId(userAddress) {
    try {
      const { storage: STORAGE_CONTRACT_ADDRESS } = await getContractAddress();

      const StorageContract = new web3.eth.Contract(this.StorageContractABI, STORAGE_CONTRACT_ADDRESS);

      const userSafleID = await StorageContract.methods.resolveUserAddress(userAddress).call();

      return userSafleID;
    } catch (error) {
      return INVALID_ADDRESS;
    }
  }

  //  Resolve the user's address from their Safle ID
  async getAddress(safleID) {
    try {
      const { storage: STORAGE_CONTRACT_ADDRESS } = await getContractAddress();

      const StorageContract = new web3.eth.Contract(this.StorageContractABI, STORAGE_CONTRACT_ADDRESS);

      const userAddress = await StorageContract.methods.resolveSafleId(safleID).call();

      return userAddress;
    } catch (error) {
      return SAFLE_ID_NOT_REGISTERED;
    }
  }

  //  Get the Safle ID registration fees
  async safleIdFees() {
    const { main: MAIN_CONTRACT_ADDRESS } = await getContractAddress();

    const MainContract = new web3.eth.Contract(this.MainContractABI, MAIN_CONTRACT_ADDRESS);

    const safleIdFees = await MainContract.methods.safleIdFees().call();

    return safleIdFees;
  }

  //  Register a new user with Safle ID
  async setSafleId(payload) {
    const {
      userAddress, safleId, from, privateKey,
    } = payload;

    const isSafleIDRegOnHold = await this.isRegistrationPaused();

    if (isSafleIDRegOnHold) {
      return SAFLEID_REG_ON_HOLD;
    }

    const isAddressTaken = await this.getSafleId(userAddress);

    if (isAddressTaken !== 'Invalid address.') {
      return ADDRESS_ALREADY_TAKEN;
    }

    const addressOfSafleId = await this.getAddress(safleId);

    if (addressOfSafleId !== '0x0000000000000000000000000000000000000000') {
      return SAFLEID_ALREADY_TAKEN;
    }

    const fees = await this.safleIdFees();
    const isSafleIDValid = await isSafleIdValid(safleId);

    if (isSafleIDValid === false) {
      return INVALID_SAFLEID;
    }

    try {
      const { main: MAIN_CONTRACT_ADDRESS } = await getContractAddress();

      const MainContract = new web3.eth.Contract(this.MainContractABI, MAIN_CONTRACT_ADDRESS);

      const encodedABI = await MainContract.methods.registerSafleId(userAddress, safleId).encodeABI();
      const gas = 4000000;

      const response = await sendTransaction({
        encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees,
      });

      return response;
    } catch (error) {
      return error;
    }
  }

  //  Update Safle ID of the user
  async updateSafleId(payload) {
    const {
      userAddress, newSafleId, from, privateKey,
    } = payload;

    const isSafleIdRegOnHold = await this.isRegistrationPaused();

    if (isSafleIdRegOnHold) {
      return SAFLEID_REG_ON_HOLD;
    }

    const addressOfSafleId = await this.getAddress(newSafleId);

    if (addressOfSafleId !== '0x0000000000000000000000000000000000000000') {
      return SAFLEID_ALREADY_TAKEN;
    }

    const updateCount = await this.getUpdateCount(userAddress);
    const fees = await this.safleIdFees();
    const isSafleIDValid = await isSafleIdValid(newSafleId);

    if (updateCount >= 2) {
      return SAFLEID_MAX_COUNT;
    } if (isSafleIDValid === false) {
      return INVALID_SAFLEID;
    }

    try {
      const { main: MAIN_CONTRACT_ADDRESS } = await getContractAddress();

      const MainContract = new web3.eth.Contract(this.MainContractABI, MAIN_CONTRACT_ADDRESS);

      const encodedABI = await MainContract.methods.updateSafleId(userAddress, newSafleId).encodeABI();
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

module.exports = { SafleID };
