# actiontypemiddleware
This middleware allows you to subscribe to a redux-store on a case-by-case basis depending on what type of action has been called. It's super easy to use and is useful for various scenarios including unit testing

## Installation
```
npm install ---save-dev actiontypemiddleware
```

## Properties
### *middleware*
(function) the main middleware function

### *subscriptions*
(object) the list of subscriptions to the middleware




## Methods
### *subscribe(name, type, callback)*
**name**: (string) the name of the subscription. Multiple action types can be subscribed under the same name.

**type**: (string) the redux action type.

**callback**: (function) the callback function invoked whenever the subscribed action is dispatched to the store.
The callback accepts an object of the following structure: {**timestamp**: *date in milliseconds*, **action**: *dispatched action*}

### *unsubscribe(name)*
**name**: (string) the name of the subscription to remove.

### *unsubscribeAction(name, type)*
**name**: (string) the name of the subscription.

**type**: (string) the specific action type to unsubscribe from under this name. If there is only one action subscribed under this name then it will remove the entire subscription


## Usage
The following usage assumes you are familiar with redux actions and redux stores. For further information please refer to [this excellent documentation](https://redux.js.org/docs/introduction/).

The middleware works on a subscription based model, meaning you can turn it on and off at will.

```javascript
import ACTIONTYPEM from 'actiontypemiddleware'
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'

/* import this object wherever it's needed and turn it on and off to listen for actions */
export const signOutButton = {
    on() {
        ACTIONTYPEM.subscribe('signout', 'USER_SIGN_OUT', signOutButton.listener)
    },
    off() {
        ACTIONTYPEM.unsubscribe('signout')
    },
    listner({timestamp, action}){
        console.log(`someone signed out at: ${timestamp}`)
        console.log(`the action data is', action`)
    }
}

export default createStore(reducers, applyMiddleware(ACTIONTYPEM.middleware))
```
