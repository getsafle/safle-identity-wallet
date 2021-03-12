/* eslint-disable max-lines */
const storageContractABI = [
  {
    constant: false,
    inputs: [
      {
        name: '_auctionAddress',
        type: 'address',
      },
    ],
    name: 'setAuctionContract',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'resolveUserAddress',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'auctionProcess',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalRegistrars',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'safleId',
        type: 'string',
      },
    ],
    name: 'checkAlphaNumeric',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_registrar',
        type: 'address',
      },
      {
        name: '_newRegistrarName',
        type: 'string',
      },
    ],
    name: 'updateRegistrar',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_name',
        type: 'string',
      },
    ],
    name: 'checkLength',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_mainContractAddress',
        type: 'address',
      },
    ],
    name: 'upgradeMainContractAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_registrar',
        type: 'address',
      },
      {
        name: '_userAddress',
        type: 'address',
      },
      {
        name: '_safleId',
        type: 'string',
      },
    ],
    name: 'updateSafleId',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'resolveOldRegistrarAddress',
    outputs: [
      {
        name: '',
        type: 'bytes',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'totalRegistrarUpdates',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_registrar',
        type: 'address',
      },
      {
        name: '_userAddress',
        type: 'address',
      },
      {
        name: '_safleId',
        type: 'string',
      },
    ],
    name: 'registerSafleId',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_address',
        type: 'string',
      },
    ],
    name: 'coinAddressToId',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_safleId',
        type: 'string',
      },
      {
        name: '_index',
        type: 'uint256',
      },
    ],
    name: 'idToCoinAddress',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_safleId',
        type: 'string',
      },
    ],
    name: 'resolveSafleId',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_userAddress',
        type: 'address',
      },
      {
        name: '_index',
        type: 'uint256',
      },
      {
        name: '_newAddress',
        type: 'string',
      },
      {
        name: '_registrar',
        type: 'address',
      },
    ],
    name: 'updateCoinAddress',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_name',
        type: 'string',
      },
    ],
    name: 'resolveRegistrarName',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_registrar',
        type: 'address',
      },
      {
        name: '_registrarName',
        type: 'string',
      },
    ],
    name: 'registerRegistrar',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'Registrars',
    outputs: [
      {
        name: 'isRegisteredRegistrar',
        type: 'bool',
      },
      {
        name: 'registrarName',
        type: 'string',
      },
      {
        name: 'registarAddress',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'str',
        type: 'string',
      },
    ],
    name: 'toLower',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'isAddressTaken',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'OtherCoin',
    outputs: [
      {
        name: 'coinName',
        type: 'string',
      },
      {
        name: 'aliasName',
        type: 'string',
      },
      {
        name: 'isIndexMapped',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_safleId',
        type: 'string',
      },
      {
        name: '_oldOwner',
        type: 'address',
      },
      {
        name: '_newOwner',
        type: 'address',
      },
    ],
    name: 'transferSafleId',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'resolveOldSafleIdFromAddress',
    outputs: [
      {
        name: '',
        type: 'bytes',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'contractOwner',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'mainContract',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'totalSafleIDCount',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_safleIdOwner',
        type: 'address',
      },
      {
        name: '_safleId',
        type: 'string',
      },
    ],
    name: 'auctionInProcess',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'auctionContractAddress',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_indexnumber',
        type: 'uint256',
      },
      {
        name: '_coinName',
        type: 'string',
      },
      {
        name: '_aliasName',
        type: 'string',
      },
      {
        name: '_registrar',
        type: 'address',
      },
    ],
    name: 'mapCoin',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_userAddress',
        type: 'address',
      },
      {
        name: '_index',
        type: 'uint256',
      },
      {
        name: '_address',
        type: 'string',
      },
      {
        name: '_registrar',
        type: 'address',
      },
    ],
    name: 'registerCoinAddress',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSafleIdRegistered',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_mainContractAddress',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
];

module.exports = { storageContractABI };
