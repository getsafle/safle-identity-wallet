# InbloxMe Identity Wallet

This package is used to interact with Inblox smart contracts. Registered Registrars can use this package to set and update inblox id for the user.

Anyone can use this for Inblox Identity Resolution.

For now the registrar process is manual, if you want to become one, drop us an email or engage on our social media channels. We will be making it democratic and decentralized soon, it's already in the smart contracts [Hint: You can build on it by yourself too!].

> **Disclaimer - This is WIP, and release in alpha.**

## Installation and Usage

> Installation

Install the package by running the command,

```npm install @inbloxme/inbloxme-identity-wallet```

Import the package into your project using,

```const inbloxId = require('@inbloxme/inbloxme-identity-wallet').InbloxID;```

> Initialising

Initialise the constructor using your Infura secret key or RPC URL like this,

```const inbloxid = new inbloxId({ infuraKey, rpcUrl });```


### List of all functions

> Set Inblox ID

---

* ```setInbloxId()```

#### Inputs

```userAddress``` - Address of the user.
```inbloxId``` - Inblox ID to be set.
```from``` - Address of the registrar.
```privateKey``` - Private Key of the registrar.

#### Output

Transaction details.

> Update Inblox ID

___

* ```updateInbloxId()```

#### Inputs

```userAddress``` - Address of the user.
```newInbloxId``` - New Inblox ID to be set.
```from``` - Address of the registrar.
```privateKey``` - Private Key of the registrar.

#### Output

Transaction details.

> Check if Inblox ID registration is paused,

---

* ```isRegistrationPaused()```

#### Inputs

No inputs.

#### Output

If registration is paused - ```true```
If registration is not paused - ```false```

> Inblox ID update count

---

* ```getUpdateCount()```

#### Input

```address``` - Address of the user to check the Inblox ID update count.

#### Output

update count
If invalid or wrong address - ```Invalid address.```

> Retrieve the Inblox ID of a particular address

---

* ```getInbloxId()```

#### Input

```userAddress``` - Address of the user to get the Inblox ID.

#### Output

Inblox ID of the user
If invalid or wrong address - ```Invalid address.```

> Retrieve the address of a particular Inblox ID

---

* ```getAddress()```

#### Input

```inbloxId``` - Inblox ID of the user to get the address.

#### Output

Address of the user.

> Get the current Inblox ID registration fees

---

* ```inbloxIdFees()```

#### Output

Inblox ID registration fees.

## WIP

Want to contribute, we would :heart: that!

We are a Global :earth_asia::earth_africa::earth_americas: team! :muscle:

Write to dev@inblox.me, or follow us on twitter, [https://twitter.com/inblox_me](https://twitter.com/inblox_me)
