# Inblox Handlename Package

## How to use

Install the package using

```npm install @inbloxme/inblox-handlename-package```

Import the package into your project using,

```const inbloxHandlename = require('@inbloxme/inblox-handlename-package').InbloxHandlename;```

Initialise the constructor using your Infura secret key like this,

```const handlename = new inbloxHandlename('YOUR_INFURA_KEY');```

Now you can set the handlename for other users using the function,

```const setHandlename = await handlename.setHandlename({ userAddress, handleName, from, privateKey });```

### List of all functions
---
* ```setHandlename()```

#### Inputs

```userAddress``` - Address of the user.
```handleName``` - Handlename to be set.
```from``` - Address of the registrar.
```privateKey``` - Private Key of the registrar.

#### Output

Transaction details.

___

* ```updateHandlename()```

#### Inputs

```userAddress``` - Address of the user.
```newHandleName``` - New Handlename to be set.
```from``` - Address of the registrar.
```privateKey``` - Private Key of the registrar.

#### Output

Transaction details.

---

* ```isHandlenameRegistrationPaused()```

#### Inputs

No inputs.

#### Output

If registration is paused - ```Handlename registration is paused.```
If registration is not paused - ```Handlename registration is not paused.```

---

* ```handlenameUpdateCount()```

#### Input

```address``` - Address of the user to check the handlename update count.

#### Output

update count
If invalid or wrong address - ```Invalid address.```

---

* ```resolveHandleNameFromAddress()```

#### Input

```userAddress``` - Address of the user to get the handlename.

#### Output

Handlename of the user
If invalid or wrong address - ```Invalid address.```

---

* ```resolveAddressFromHandleName()```

#### Input

```handlename``` - Handlename of the user to get the address.

#### Output

Address of the user.

---

* ```handlenameFees()```

#### Output

Handlename registration fees.
