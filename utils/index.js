
    // POST method reusable code
     sendTransaction=(async(payload)=> {
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
    })
    //  Function to check for all the common conditions for set and update handlename
     handlenameConditions=(async({handleName, from}) =>{
        const registrar = await registrarDetails({ address: from });
        const handlenameValid = await isHandlenameValid({ handlename: handleName });
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
     })
    //  Get the registrar details using the registrar address
     registrarDetails=(async({address}) =>{

        try {
            const registrarDetails = await this.StorageContract.methods.Registrars(address).call();
            return registrarDetails;
        } catch (error) {
            return "This address is not a valid registrar."
        }
    })

    //  Function to check handlename validity
     isHandlenameValid=(async({handlename}) =>{
        const handlenameLength = handlename.length;

        if (4 <= handlenameLength && handlenameLength <= 16 && handlename.match(/^[0-9a-z]+$/i) !== null) {
            return true;
        }
        return false;
    })

    module.exports={
        sendTransaction:sendTransaction,
        handlenameConditions:handlenameConditions,
        registrarDetails:registrarDetails,
        isHandlenameValid:isHandlenameValid
    }