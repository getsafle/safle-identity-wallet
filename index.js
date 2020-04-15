const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const { mainContractABI } = require('./ABI/main-contract');
const { storageContractABI } = require('./ABI/storage-contract');
const { mainContractAddress, storageContractAddress } = require('./config');
const utils = require('./utils/index')

class InbloxHandlename {
    constructor({ infuraKey, rpcUrl }) {

        return (async () => {
            this.web3 = await this.connectNode({ infuraKey, rpcUrl });           
            this.MainContractAddress = mainContractAddress;
            this.MainContractABI = mainContractABI;
            this.StorageContractAddress = storageContractAddress;
            this.StorageContractABI = storageContractABI;
            this.MainContract = new this.web3.eth.Contract(this.MainContractABI, this.MainContractAddress);
            this.StorageContract = new this.web3.eth.Contract(this.StorageContractABI, this.StorageContractAddress);

            return this;
        })();
    }

    async connectNode({ infuraKey, rpcUrl }) {
        let web3;
        let isConnected=false;
        if (infuraKey) {
            web3 = await new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${infuraKey}`));
            web3.eth.net.isListening()
                .then(() => console.log('connected to ',infuraKey))
                .catch((e) =>  {  console.log("Invalid or Infura API key ", infuraKey," Please provide correct details"); process.exit(1) });
        }
        else {
            web3 = await new Web3(new Web3.providers.HttpProvider(rpcUrl));
            web3.eth.net.isListening()
                .then(() => console.log('connected to ',rpcUrl))
                .catch((e) =>  {  console.log("Invalid RPC URL ",rpcUrl," Please provide correct details"); process.exit(1) });
        }   
        return web3;
    }
    
    //  Get the status of handlename registration
    async isHandlenameRegistrationPaused() {
        const isHandlenameRegistrationPaused = await this.MainContract.methods.isHandlenameRegistrationPaused().call();

        if (isHandlenameRegistrationPaused === true) {
            return "Handlename registration is paused.";
        }
        return "Handlename registration is not paused.";
    }

    //  Get the number of times the user updated their handlename
    async handlenameUpdateCount(address) {
        try {
            const updateCount = await this.StorageContract.methods.updateCount(address).call();
            return updateCount;
        } catch (error) {
            return "Invalid address."
        }
    }

    //  Get the handlename from address
    async resolveHandleNameFromAddress(userAddress) {

        try {
            const userHandlename = await this.StorageContract.methods.resolveHandleName(userAddress).call();
            return userHandlename;
        } catch (error) {
            return "Invalid address.";
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
        const { userAddress, handleName, from, privateKey } = payload;

        const handlename = await this.resolveHandleNameFromAddress(userAddress);
        const fees = await this.handlenameFees();
        const check = await utils.handlenameConditions({ handleName, from });

        if (handlename !== "Invalid address.") {
            return "This address is already registered to another handlename."
        } else if (check !== true) {
            return check;
        }

        try {
            const encodedABI = await this.MainContract.methods.addHandleName(userAddress, handleName).encodeABI();
            let gas = await this.MainContract.methods.addHandleName(userAddress, handleName).estimateGas({ from, value: fees });
            gas = Math.round(parseFloat(gas) * 1.5);

            const response = await utils.sendTransaction({ encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees })

            return response;
        } catch (error) {
            return error;
        }
    }

    //  Update handlename of the user
    async updateHandlename(payload) {
        const { userAddress, newHandleName, from, privateKey } = payload;

        const updateCount = await this.handlenameUpdateCount({ address: userAddress });
        const fees = await this.handlenameFees();
        const check = await utils.handlenameConditions({ handleName: newHandleName, from });

        if (updateCount >= 2) {
            return "Handlenames cannot be updated more than twice.";
        } else if (check !== true) {
            return check;
        }

        try {
            const encodedABI = await this.MainContract.methods.updateHandleNameOfUser(userAddress, newHandleName).encodeABI();
            let gas = await this.MainContract.methods
                .updateHandleNameOfUser(userAddress, newHandleName)
                .estimateGas({ from, value: fees });
            gas = Math.round(parseFloat(gas) * 1.5);

            const response = await utils.sendTransaction({ encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees })

            return response;
        } catch (error) {
            return "Please check all the inputs.";
        }
    }
}

module.exports = { InbloxHandlename };