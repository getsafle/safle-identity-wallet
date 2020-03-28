const mainContractABI = [
    {
        "constant": false,
        "inputs": [{
                "name": "_indexnumber",
                "type": "uint256"
            },
            {
                "name": "_blockchainName",
                "type": "string"
            },
            {
                "name": "_aliasName",
                "type": "string"
            }
        ],
        "name": "addCoins",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "_userAddress",
                "type": "address"
            },
            {
                "name": "_handleName",
                "type": "string"
            }
        ],
        "name": "addHandleName",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_registrarName",
            "type": "string"
        }],
        "name": "addRegistrar",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "_userAddress",
                "type": "address"
            },
            {
                "name": "_index",
                "type": "uint256"
            },
            {
                "name": "_address",
                "type": "string"
            }
        ],
        "name": "registerCoinAddress",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_amount",
            "type": "uint256"
        }],
        "name": "setHandleNameFees",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_amount",
            "type": "uint256"
        }],
        "name": "setRegistrarFees",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_registrarStorageContract",
            "type": "address"
        }],
        "name": "setRegistrarStorageContract",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "stopOrRestartRegistration",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "_userAddress",
                "type": "address"
            },
            {
                "name": "_newHandleName",
                "type": "string"
            }
        ],
        "name": "updateHandleNameOfUser",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_registrarName",
            "type": "string"
        }],
        "name": "updateRegistrar",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_walletAddress",
            "type": "address"
        }],
        "name": "updateWalletAddress",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "name": "_walletAddress",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "handleName",
            "type": "string"
        }],
        "name": "checkAlphaNumeric",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "_name",
            "type": "string"
        }],
        "name": "checkLength",
        "outputs": [{
            "name": "",
            "type": "uint8"
        }],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "contractOwner",
        "outputs": [{
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isHandlenameRegistrationPaused",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "registrarFees",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "registrarStorageContractAddress",
        "outputs": [{
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "storageContractAddress",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "str",
            "type": "string"
        }],
        "name": "toLower",
        "outputs": [{
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "userHandleNameRegFees",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "walletAddress",
        "outputs": [{
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

module.exports = { mainContractABI };