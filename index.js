const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const { mainContractABI } = require('./ABI/main-contract');
const { storageContractABI } = require('./ABI/storage-contract');
const { mainContractAddress, storageContractAddress } = require('./config');

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
            const { encodedABI, gas, from, to, privateKey, value } = payload;

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
            return { error: [{ name: 'address & handlename', message: error.message }] };
        }
    }

    //  Function to check for all the common conditions for set and update handlename
    async handlenameConditions({handleName, from}) {
        const registrar = await this.registrarDetails({ address: from });
        const handlenameValid = await this.isHandlenameValid({ handlename: handleName });
        const address = await this.resolveAddressFromHandleName(handleName);
        const isRegistrationPaused = await this.isHandlenameRegistrationPaused();

        if (handlenameValid === false) {
            return "The handlename have to be alphanumeric and length should be between 4-16."
        } else if (registrar === "This address is not a valid registrar.") {
            return registrar;
        } else if (address !== '0x0000000000000000000000000000000000000000') {
            return "This handlename is already taken."
        } else if (isRegistrationPaused === "Handlename registration is paused.") {
            return isRegistrationPaused;
        }
        return true;
    }

    //  Get the registrar details using the registrar address
    async registrarDetails({address}) {

        try {
            const registrarDetails = await this.StorageContract.methods.Registrars(address).call();
            return registrarDetails;
        } catch (error) {
            return "This address is not a valid registrar."
        }
    }

    //  Function to check handlename validity
    async isHandlenameValid({handlename}) {
        const handlenameLength = handlename.length;

        if (4 <= handlenameLength && handlenameLength <= 16 && handlename.match(/^[0-9a-z]+$/i) !== null) {
            return true;
        }
        return false;
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
        const check = await this.handlenameConditions({ handleName, from });

        if (handlename !== "Invalid address.") {
            return "This address is already registered to another handlename."
        } else if (check !== true) {
            return check;
        }

        try {
            const encodedABI = await this.MainContract.methods.addHandleName(userAddress, handleName).encodeABI();
            let gas = await this.MainContract.methods.addHandleName(userAddress, handleName).estimateGas({ from, value: fees });
            gas = Math.round(parseFloat(gas) * 1.5);

            const response = await this.sendTransaction({ encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees })

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
        const check = await this.handlenameConditions({ handleName: newHandleName, from });

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

            const response = await this.sendTransaction({ encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees })

            return response;
        } catch (error) {
            return "Please check all the inputs.";
        }
    }
}

module.exports = { InbloxHandlename };