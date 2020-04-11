const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const { mainContractABI } = require('./ABI/main-contract');
const { storageContractABI } = require('./ABI/storage-contract');
const { mainContractAddress, storageContractAddress } = require('./config');

let web3;

// POST method reusable code
sendTransaction = async function(payload) {
    try {
        const { encodedABI, gas, from, to, privateKey, value } = payload;

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
        return { error: [{ name: 'address & handlename', message: error.message }] };
    }
}

//  Function to check handlename validity
async function isHandlenameValid(handlename) {
    const handlenameLength = handlename.length;

    if (4 <= handlenameLength && handlenameLength <= 16 && handlename.match(/^[0-9a-z]+$/i) !== null) {
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
        this.MainContractAddress = mainContractAddress;
        this.MainContractABI = mainContractABI;
        this.StorageContractAddress = storageContractAddress;
        this.StorageContractABI = storageContractABI;
        this.MainContract = new web3.eth.Contract(this.MainContractABI, this.MainContractAddress);
        this.StorageContract = new web3.eth.Contract(this.StorageContractABI, this.StorageContractAddress);
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

        const fees = await this.handlenameFees();
        const isHNValid = await isHandlenameValid(handleName);

        if(isHNValid === false) {
            return "Handlename should be 4-16 characters alphanumeric string."
        }

        try {
            const encodedABI = await this.MainContract.methods.addHandleName(userAddress, handleName).encodeABI();
            let gas = 4000000;

            const response = await sendTransaction({ encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees })

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
        const isHNValid = await isHandlenameValid(newHandleName);

        if (updateCount >= 2) {
            return "Handlenames cannot be updated more than twice.";
        } else if (isHNValid === false) {
            return "Handlename should be 4-16 characters alphanumeric string."
        }

        try {
            const encodedABI = await this.MainContract.methods.updateHandleNameOfUser(userAddress, newHandleName).encodeABI();
            let gas = 4000000;

            const response = await sendTransaction({ encodedABI, gas, from, to: this.MainContractAddress, privateKey, value: fees })

            return response;
        } catch (error) {
            return "Please check all the inputs.";
        }
    }
}

module.exports = { InbloxHandlename };