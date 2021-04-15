# Safle Identity Wallet

This package is used to interact with Safle smart contracts. Registered Registrars can use this package to set and update safleId for the user.

Anyone can use this for SafleId Resolution.

For now the registrar process is manual, if you want to become one, drop us an email or engage on our social media channels. We will be making it democratic and decentralized soon, it's already in the smart contracts [Hint: You can build on it by yourself too!].

> **Disclaimer - This is WIP, and release in alpha.**

## Installation and Usage

> Installation

Install the package by running the command,

```npm install @getsafle/safle-identity-wallet```

Import the package into your project using,

```const safleId = require('@getsafle/safle-identity-wallet').SafleID;```

> Initialising

Initialise the constructor using your Infura secret key or RPC URL like this,

```const safle = new safleId(env);```


### List of all functions

> Set SafleId

---

* ```setSafleId()```

#### Inputs

```userAddress``` - Address of the user.
```safleId``` - SafleId to be set.
```from``` - Address of the registrar.
```privateKey``` - Private Key of the registrar.

#### Output

Transaction details.

> Update SafleId

___

* ```updateSafleId()```

#### Inputs

```userAddress``` - Address of the user.
```newSafleId``` - New SafleId to be set.
```from``` - Address of the registrar.
```privateKey``` - Private Key of the registrar.

#### Output

Transaction details.

> Check if SafleId registration is paused,

---

* ```isRegistrationPaused()```

#### Inputs

No inputs.

#### Output

If registration is paused - ```true```
If registration is not paused - ```false```

> SafleId update count

---

* ```getUpdateCount()```

#### Input

```address``` - Address of the user to check the SafleId update count.

#### Output

update count
If invalid or wrong address - ```Invalid address.```

> Retrieve the SafleId of a particular address

---

* ```getSafleId()```

#### Input

```userAddress``` - Address of the user to get the SafleId.

#### Output

SafleId of the user
If invalid or wrong address - ```Invalid address.```

> Retrieve the address of a particular SafleId

---

* ```getAddress()```

#### Input

```safleId``` - SafleId of the user to get the address.

#### Output

Address of the user.

> Get the current SafleId registration fees

---

* ```safleIdFees()```

#### Output

SafleId registration fees.

## WIP

Want to contribute, we would :heart: that!

We are a Global :earth_asia::earth_africa::earth_americas: team! :muscle:

Write to dev@getsafle.com, or follow us on twitter, [https://twitter.com/getsafle](https://twitter.com/getsafle)
