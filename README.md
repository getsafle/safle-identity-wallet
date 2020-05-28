# InbloxMe Identity Wallet

This package is used to interact with Inblox smart contracts. Registered Registrars can use this package to set and update handlename for the user.

> **Disclaimer - This is WIP, and release in alpha.**

## Installation and Usage

> Installation

Install the package by running the command,

```npm install @inbloxme/inbloxme-identity-wallet```

Import the package into your project using,

```const inbloxHandlename = require('@inbloxme/inbloxme-identity-wallet').InbloxHandlename;```

> Initialising

Initialise the constructor using your Infura secret key or RPC URL like this,

```const handlename = new inbloxHandlename('YOUR_INFURA_KEY' or 'RPC URL');```

> Set Handlename using

```const setHandlename = await handlename.setHandlename({ userAddress, handleName, from, privateKey });```

### List of all functions

> Set Handlename

---

* ```setHandlename()```

#### Inputs

```userAddress``` - Address of the user.
```handleName``` - Handlename to be set.
```from``` - Address of the registrar.
```privateKey``` - Private Key of the registrar.

#### Output

Transaction details.

> Update Handlename

___

* ```updateHandlename()```

#### Inputs

```userAddress``` - Address of the user.
```newHandleName``` - New Handlename to be set.
```from``` - Address of the registrar.
```privateKey``` - Private Key of the registrar.

#### Output

Transaction details.

> Check if Handlename registration is paused,

---

* ```isHandlenameRegistrationPaused()```

#### Inputs

No inputs.

#### Output

If registration is paused - ```Handlename registration is paused.```
If registration is not paused - ```Handlename registration is not paused.```

> Handlename update count

---

* ```handlenameUpdateCount()```

#### Input

```address``` - Address of the user to check the handlename update count.

#### Output

update count
If invalid or wrong address - ```Invalid address.```

> Retrieve the handlename of a particular address

---

* ```resolveHandleNameFromAddress()```

#### Input

```userAddress``` - Address of the user to get the handlename.

#### Output

Handlename of the user
If invalid or wrong address - ```Invalid address.```

> Retrieve the address of a particular handlename

---

* ```resolveAddressFromHandleName()```

#### Input

```handlename``` - Handlename of the user to get the address.

#### Output

Address of the user.

> Get the current handlename registration fees

---

* ```handlenameFees()```

#### Output

Handlename registration fees.

## WIP

Want to contribute, we would :heart: that!

We are a Global :earth_asia::earth_africa::earth_americas: team! :muscle:

Write to dev@inblox.me, or follow us on twitter, [https://twitter.com/inblox_me](https://twitter.com/inblox_me)