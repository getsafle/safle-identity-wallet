const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const { mainContractABI } = require('./constants/ABI/main-contract');
const { storageContractABI } = require('./constants/ABI/storage-contract');
const { mainContractAddress, storageContractAddress } = require('./constants/config');
const {
  INVALID_HANDLENAME, INVALID_REGISTRAR, HN_REGISTRATION_PAUSED, REGISTERED_HANDLENAME, INVALID_ADDRESS, REGISTERED_ADDRESS, HN_MAX_COUNT, INVALID_INPUT,
} = require('./constants/errors');

class InbloxHandlename {
  constructor({ infuraKey, rpcUrl }) {
    if (!rpcUrl) {
      this.web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${infuraKey}`));
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    }
    this.MainContractAddress = mainContractAddress;

    this.MainContractABI = mainContractABI;
    this.StorageContractAddress = storageContractAddress;
    this.StorageContractABI = storageContractABI;
    this.MainContract = new this.web3.eth.Contract(this.MainContractABI, this.MainContractAddress);
    this.StorageContract = new this.web3.eth.Contract(this.StorageContractABI, this.StorageContractAddress);
  }

  // POST method reusable code
  async sendTransaction(payload) {
    try {
      const {
        encodedABI, gas, from, to, privateKey, value,
      } = payload;

      const gasPrice = await this.web3.eth.getGasPrice();
      const count = await this.web3.eth.getTransactionCount(from);
      const nonce = await this.web3.utils.toHex(count);

      const rawTx = {
        from,
        value: this.web3.utils.numberToHex(value),
        nonce: this.web3.utils.numberToHex(nonce),
        to,
        gas: this.web3.utils.numberToHex(gas),
        gasPrice: this.web3.utils.numberToHex(gasPrice),
        data: encodedABI,
        chainId: 3,
      };
      const pkey = Buffer.from(privateKey, 'hex');
      const tx = new Tx(rawTx, { chain: 'ropsten', hardfork: 'petersburg' });

      tx.sign(pkey);
      const stringTx = `0x${tx.serialize().toString('hex')}`;

      const response = await this.web3.eth.sendSignedTransaction(stringTx);

      return response;
    } catch (error) {
      return { error: [ { name: 'address & handlename', message: error.message } ] };
    }
  }

  //  Function to check for all the common conditions for set and update handlename
  async handlenameConditions({ handleName, from }) {
    const registrar = await this.registrarDetails({ address: from });
    const handlenameValid = await this.isHandlenameValid({ handlename: handleName });
    const address = await this.resolveAddressFromHandleName(handleName);
    const isRegistrationPaused = await this.isHandlenameRegistrationPaused();

    if (handlenameValid === false) {
      return INVALID_HANDLENAME;
    } if (registrar === INVALID_REGISTRAR) {
      return registrar;
    } if (address !== '0x0000000000000000000000000000000000000000') {
      return REGISTERED_HANDLENAME;
    } if (isRegistrationPaused === true) {
      return HN_REGISTRATION_PAUSED;
    }

    return true;
  }

  //  Get the registrar details using the registrar address
  async registrarDetails({ address }) {
    try {
      const registrarDetails = await this.StorageContract.methods.Registrars(address).call();

      if (registrarDetails.isRegisteredRegistrar === false) {
        return INVALID_REGISTRAR;
      }

      return registrarDetails;
    } catch (error) {
      return INVALID_INPUT;
    }
  }

  //  Function to check handlename validity
  // eslint-disable-next-line class-methods-use-this
  async isHandlenameValid({ handlename }) {
    const handlenameLength = handlename.length;

    if (handlenameLength >= 4 && handlenameLength <= 16 && handlename.match(/^[0-9a-z]+$/i) !== null) {
      return true;
    }

    return false;
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

    const handlename = await this.resolveHandleNameFromAddress(userAddress);
    const fees = await this.handlenameFees();
    const check = await this.handlenameConditions({ handleName, from });

    if (handlename !== INVALID_ADDRESS) {
      return REGISTERED_ADDRESS;
    } if (check !== true) {
      return check;
    }

    try {
      const encodedABI = await this.MainContract.methods.addHandleName(userAddress, handleName).encodeABI();
      let gas = await this.MainContract.methods.addHandleName(userAddress, handleName).estimateGas({ from, value: fees });

      gas = Math.round(parseFloat(gas) * 1.5);

      const response = await this.sendTransaction({
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

    const updateCount = await this.handlenameUpdateCount({ address: userAddress });
    const fees = await this.handlenameFees();
    const check = await this.handlenameConditions({ handleName: newHandleName, from });

    if (updateCount >= 2) {
      return HN_MAX_COUNT;
    } if (check !== true) {
      return check;
    }

    try {
      const encodedABI = await this.MainContract.methods.updateHandleNameOfUser(userAddress, newHandleName).encodeABI();
      let gas = await this.MainContract.methods
        .updateHandleNameOfUser(userAddress, newHandleName)
        .estimateGas({ from, value: fees });

      gas = Math.round(parseFloat(gas) * 1.5);

      const response = await this.sendTransaction({
        encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees,
      });

      return response;
    } catch (error) {
      return INVALID_INPUT;
    }
  }
}

module.exports = { InbloxHandlename };
