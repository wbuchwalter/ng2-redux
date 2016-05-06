# ng2-redux
Angular 2 bindings for [Redux](https://github.com/reactjs/redux).

For Angular 1 see [ng-redux](https://github.com/wbuchwalter/ng-redux)

[![Circle CI](https://circleci.com/gh/angular-redux/ng2-redux/tree/master.svg?style=svg)](https://circleci.com/gh/angular-redux/ng2-redux/tree/master)
[![npm version](https://img.shields.io/npm/v/ng2-redux.svg?style=flat-square)](https://www.npmjs.com/package/ng2-redux)

`ng2-redux` lets you easily connect your Angular 2 components with Redux.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [The decorator interface](#the-decorator-interface)
    - [The @dispatch decorator](#the-dispatch-decorator)
    - [The @select decorator](#the-select-decorator)
    - [The @dispatchAll decorator](#the-dispatchall-decorator)
    - [The decorator interface: putting it all together](#the-decorator-interface-putting-it-all-together)
  - [The select pattern](#the-select-pattern)
  - [The connect pattern](#the-connect-pattern)
- [Cookbooks](#cookbooks)
  - [Using Angular 2 Services in your Action Creators](#using-angular-2-services-in-your-action-creators)
  - [Using Angular 2 Services in your Middleware](#using-angular-2-services-in-your-middleware)
  - [Using Redux DevTools](#using-devtools)
- [API](#api)

## Installation

```sh
npm install --save ng2-redux
```

## Quick Start

### Initialization

Import the `NgRedux` class and add it to your application as an Angular 2
provider.

```typescript
import {bootstrap} from '@angular/platform-browser-dynamic';
import { App } from './containers/App';

bootstrap(App, [ NgRedux ]);
```

Once you've done this, you'll be able to inject `NgRedux` into your
Angular 2 components. In your top-level app component, you
can configure your Redux store with reducers, initial state,
and optionally middleware and enhancers as you would in Redux directly.

```typescript
import { NgRedux } from 'ng2-redux';
const thunk = require('redux-thunk').default;
import { rootReducer } from './reducers';

interface IAppState {
  // ...   
};
@Component({
  // ... etc.
})
class App {
  constructor(private ngRedux: NgRedux) {
    this.ngRedux.configureSture(rootReducer, {}, [ thunk ]);
  }

  // ...
}
```

Now your Angular 2 app has been reduxified!

## Usage

`ng2-redux` has three main usage patterns:

1. The decorator interface.
2. The `select` pattern.
3. The `connect` pattern.

### The Decorator Interface

This is the simplest and cleanest approach. It signigicantly reduces
boilerplate code and separates Redux concerns from the class's business
logic.

It also reduces the learning curve associated with Redux configuration.
Finally, it reduces the effort associated with granular, modular components
in Angular 2 as shown in the examples below.

The decorator interface currently consists of 3 decorators: 
- `@dispatch`: attaches redux action creators to methods in your component.
- `@select`: selects store slices and makes them available as `Observable` 
properties on your component.
- `@dispatchAll`: attaches a map of action creators to your component. 

> Note: all decorators require that `NgRedux` be injected and configured in the
angular app's root component. Aside from that, the decorators fully encapsulate
the Redux connectivity and `NgRedux` doesn't need to be injected in any other 
class that needs to use the decorators. This removes the need to implement a 
constructor and call functions within the component's lifecycle simply for
Redux connectivity.

#### The `@dispatch` decorator

The `@dispatch` decorator can be added to the property of any angular 
component or injectable class to allow it to dispatch an action creator.

It will decorate a property of a class, replacing it with a function that
will dispatch the action creator it receives as a parameter. 

```typescript
import { Component } from '@angular2/core';
import { dispatch } from 'ng2-redux';

// import the action creator function
import { increment } from '../actions/CounterActions';

@Component({
    selector: 'increment-button',
    template: `
    <button (click)="increment()"></button>
    `
})
export class IncrementButton {
    // decorate a function on the class called increment
    // which will dispatch the increment action creator 
    //   imported from '../actions/CounterActions'
    @dispatch(increment) increment;
}
```

#### The `@select` decorator

The `@select` decorator can be added to a property of any Angular component
or injectable.

It will replace the property with an `Observable` which observes the specified
slice of the Redux store.

The decorator expects to receive a `string`, a `function` or no parameter at
all.

- If a `string` is passed the `@select` decorator will attempt to observe a
store property whose name matches the value represented by the `string`.
- If a `function` is passed the `@select` decorator will attempt to use that
function as a selector on the RxJs observable.
- If nothing is passed then the `@select` decorator will attempt to use the
name of the class property to find a matching value in the Redux store. Note
that a utility is in place here where any $ characters will be ignored from
the class property's name; this is to respect the convention of suffixing
`Observable` properties with `$`.

```typescript
import { Component } from '@angular2/core';
import { AsyncPipe } from '@angular2/common';
import { Observable } from 'rxjs/Observable';
import { select } from 'ng2-redux';

@Component({
    pipes: [AsyncPipe],
    selector: 'counter-value-printed-many-times',
    template: `
    <p>{counter$ | async}</p>
    <p>{counter | async}</p>
    <p>{counterSelectedWithString | async}</p>
    <p>{counterSelectedWithFunction | async}</p>
    <p>{counterSelectedWithFunctionAndMultipliedByTwo | async}</p>
    `
})
export class CounterValue {

    // this selects `counter` from the store and attaches it to this property
    // it uses the property name to select, and ignores the $ from it
    @select() counter$: Observable<number>;

    // this selects `counter` from the store and attaches it to this property
    @select() counter: Observable<number>;

    // this selects `counter` from the store and attaches it to this property
    @select('counter') counterSelectedWithString: Observable<number>;

    // this selects `counter` from the store and attaches it to this property
    @select(state => state.counter) counterSelectedWithFunction: Observable<number>;

    // this selects `counter` from the store and multiples it by two
    @select(state => state.counter * 2)
    counterSelectedWithFuntionAndMultipliedByTwo: Observable<number>;
}
```

#### The @dispatchAll decorator

A class decorator that does the same thing that the `ngRedux.mapDispatchToThis`
does for the `connect` pattern.

The benefit of using this decorator is that it reduces code even further (and
quite significantly, the more actions need to be added).

A potential caveat however could be that this decorator magically attaches
functions to your class without making it very obvious in the code. Some teams
may find this confusing. In that case the `@dispatch` decorator offers a
perfect alternative.

```typescript
import { Component } from '@angular2/core';
import { dispatchAll } from 'ng2-redux';

// assuming that this module file exports 4 action creator functions called:
// increment, decrement, incrementIfOdd, incrementAsync
import * as CounterActions from '../actions/CounterActions';

@Component({
    selector: 'counter-menu',
    template: `
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
    <button (click)="incrementIfOdd()">Increment if odd</button>
    <button (click)="incrementAsync()">Increment async</button>
    `
})
@dispatchAll(CounterActions)
export class CounterMenu {}
```

> Note: Since `@dispatchAll` decorates the class with new methods which are
never declared as properties of the class, the methods will only be available
within the template. In order to call the methods from the class's code, their
names can be predefined in the class, otherwise typescript won't know they
exist, and will not compile.

#### The decorator interface: putting it all together

The decorator interface allows classes to focus on what they represent. This
simplification makes it easier to design better-encapsulated components which
can aggregate their behaviour and data internally, from multiple reducers and
store slices, without a lot of boilerplate.

In the example below we can see a fully encapsulated `counter` component, which
doesn't require a smart component to pass its data, aggregates behaviour from
multiple reducers using the `@dispatch` decorator, and showcases some internal
logic combining multiple values from the store using the `@select` decorator.

```typescript
import { Component } from '@angular2/core';
import { dispatch, 
         dispatchAll,
         select } from 'ng2-redux';
import { AsyncPipe } from '@angular2/common';
import * as CounterActions from '../actions/CounterActions';
import { logout } from '../actions/UserSessionActions';
import 'rxjs/add/operator/combineLatest';

@Component({
    pipes: [AsyncPipe],
    selector: 'counter',
    template: `
    <p>Clicked: {{ counter | async }} times</p>
    <p>Value from combined observables: {{ doublePlusCounter | async }}</p>
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
    <button (click)="incrementIfOdd()">Increment if odd</button>
    <button (click)="incrementAsync()">Increment async</button></p>
    <button (click)="actionFromAnotherReducer()">Logout</button></p>
    `
})
@dispatchAll(CounterActions)
export class Counter {

    @select() counter: Observable<number>;
    @select(state => state.counter * state.counter) counterDouble: Observable<number>;

    doublePlusCounter$: counter
      .combineLatest(this.counterDouble,
          (latestCounter, latestCounterDouble) => {
              return latestCounter + latestCounterDouble;
        });

    @dispatch(logout) actionFromAnotherReducer;
}
```

### The Select Pattern

This is a good approach for those that don't want to use decorators yet still
want to use `Observables` to interface more cleanly with common Angular 2 usage
patterns.

In this approach, we use `ngRedux.select()` to get observables from slices of our store
state:

```typescript
import { Component } from '@angular2/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular2/common';
import { Counter } from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { NgRedux } from 'ng2-redux';

interface IAppState {
  counter: number;
};

@Component({
    selector: 'root',
    directives: [Counter],
    pipes: [AsyncPipe],
    template: `
  <counter [counter]="counter$| async"
    [increment]="increment"
    [decrement]="decrement">
  </counter>
  `
})
export class Counter {
  private count$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>) {
    let {increment, decrement } = CounterActions;
    this.counter$ = this.ngRedux.select('counter');
  }

  incrementIfOdd = () => this.ngRedux.dispatch(
    <any>CounterActions.incrementIfOdd());

  incrementAsync = () => this.ngRedux.dispatch(
    <any>CounterActions.incrementAsync());
}
```

`ngRedux.select` can take a property name or a function which transforms a property.
Since it's an observable, you can also transform data using observable operators like
`.map`, `.filter`, etc.

### The Connect Pattern

Alternately you can use the 'ngRedux.connect' API, which will map your state and action creators
to the component class directly.

This pattern is provided for backwards compatibility. It's worth noting that
Angular 2's view layer is more optimized for Observables and the `select`
pattern above.

```typescript
import { Component } from '@angular/core';
import { Counter } from '../components/Counter';
import { NgRedux } from 'ng2-redux';
import { bindActionCreators } from 'redux';

export interface IAppState {
  counter: number;
};

// NB: 'import * as CounterActions' won't provide the right type
// for bindActionCreators.
const CounterActions = require('../actions/CounterActions');

@Component({
    selector: 'root',
    directives: [Counter],
    template: `
  <counter [counter]="counter"
    [increment]="actions.increment"
    [decrement]="actions.decrement">
  </counter>
  `
})
export class Counter {
  private count$: Observable<number>;

  mapStateToTarget(state) {
    return { counter: state.counter };
  }

  ngOnDestroy() {
    this.disconnect();
  }

  // Will result in this.counter being set to the store value of counter
  // after each change.
  mapStateToTarget(state) {
    return { counter: state.counter };
  }

  // Will result in a method being created on the component for each
  // action creator, which dispatches to the store when called.
  mapDispatchToThis(dispatch) {
    return { actions: bindActionCreators(CounterActions, dispatch) };
  }
}
```

## Cookbooks

### Using Angular 2 Services in your Action Creators

In order to use services in your action creators, you need to integrate
them into Angular 2's dependency injector.

This means attaching your action creators to a class so that:

1. you can make it `@Injectable()`, and
2. you can inject other services into its constructor for your
action creators to use.

Take a look at this example, which uses
* [redux-thunk](https://github.com/gaearon/redux-thunk) to
allow for asynchronous actions, and
* Angular 2's `http` service to make auth requests.

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import {
  LOGIN_USER_PENDING,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER
} from '../constants';

// Wrap our action creators in a class and make it @Injectable.
// Don't forget to add it to your app's `providers`.
@Injectable()
export class SessionActions {
  constructor(private http: Http) {}

  // Here's an action creator that uses HTTP.
  // Note the use of an arrow function to ensure that 'this'
  // is bound correctly.
  loginUser(credentials) = () => {
    return (dispatch, getState) => {
      dispatch({type: LOGIN_USER_PENDING});

      this.http.post('/auth/login', credentials)
        .toPromise()
        .then(response => dispatch({type: LOGIN_USER_SUCCESS, payload: response.json()})
        .catch(error => dispatch({type: LOGIN_USER_ERROR, payload: error, error: true });
      });
    };
  }

  // Just a regular, synchronous action creator.
  logoutUser = () => {
    return { type: LOGOUT_USER };
  }
}
```

To use these action creators, we can just go ahead attach them
to our component using `@dispatch`:

```typescript
import { Component } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { SessionActions } from '../actions/session';
import { IAppState } from './app-state';

@Component({
  template: `
    <button (click)="login()">Log In</button>
    <button (click)="logout()">Log Out</button>
    `
  // ... etc.
})
export class LoginPage {
  // Here we inject the SessionActions instance into our
  // smart component.
  constructor(private sessionActions: SessionActions) {}

  // And then hook it up to Redux and our template.
  @dispatch(this.sessionActions.loginUser) login;
  @dispatch(this.sessionActions.logout)    logout;
};
```

### Using Angular 2 Services in your Middleware

Again, we just want to use Angular DI the way it was meant to be used.

Here's a contrived example that fetches a name from a remote API using Angular's
`Http` service:

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LogRemoteName {
  constructor(private http: Http) {}

  // Arrow functions to ensure a properly-bound 'this'.
  // They also provide a cleaner way to express Redux's
  // curried middleware.
  middleware = store => next => action => {
    console.log('getting user name');
    this.http.get('http://jsonplaceholder.typicode.com/users/1')
      .toPromise()
      .then(response => {
        console.log('got name:', response.json().name);
        return next(action);
      })
      .catch(err => console.log('get name failed:', err));
    }
}
```

As with the action example above, we've attached our middleware function to
an `@Injectable` class that can itself receive services from Angular's dependency
injector.

Note the arrow function called `middleware`: this is what we can pass to the middlewares
parameter when we initialize `NgRedux` in our top-level component. We use an arrow function
to make sure that what we pass to `NgRedux` has a properly-bound function context.

```typescript
import { LogRemoteName } from './middleware/log-remote-name';
const thunk = require('redux-thunk').default;
const reduxLogger = require('redux-logger');

@Component({
  providers: [ LogRemoteName ],
  // ...
})
class App {
  constructor(
    private ngRedux: NgRedux
    logRemoteName: LogRemoteName) {

    const middleware = [ thunk, reduxLogger(), logRemoteName.middleware ];
    this.ngRedux.configureStore(
      rootReducer,
      initialState,
      middleware);
  }
}
```

### Using DevTools

Ng2Redux is fully compatible with the Chrome extension version of the Redux dev
tools:

https://github.com/zalmoxisus/redux-devtools-extension

Here's how to enable them in your app (you probably only want to do
this in development mode):

```typescript
const enhancers = [];

// Add Whatever other enhancers you want.

if (__DEVMODE__ && window.devToolsExtension) {
  enhancers = [ ...enhancers, window.devToolsExtension() ];
}

// Add the dev tools enhancer your ngRedux.configureStore called
// when you initialize your root component:
@Component({
  // ...
})
class App {
  constructor(private ngRedux: NgRedux) {
    this.ngRedux.configureStore(rootReducer, initialState, [], enhancers);
  }
}
```

## API

### `configureStore()`

Initializes your ngRedux store. This should be called once, typically in your
top-level app component's constructor.

__Arguments:__

* `rootReducer` \(*Reducer*): Your top-level Redux reducer.
* `initialState` \(*Object): The desired initial state of your store.
* `middleware` \(*Middleware[]*): An optional array of Redux middleware functions.
* `enhancers` \(*StoreEnhancer[StoreEnhancer]*): An optional array of Redux
store enhancer functions.

### select(key | function,[comparer]) => Observable

Exposes a slice of state as an observable. Accepts either a property name or a
selector function.

If using the async pipe, you do not need to subscribe to it explicitly, but can
use the angular Async pipe to bind its values into your template.

__Arguments:__

* `key` \(*string*): A key within the state that you want to subscribe to. 
* `selector` \(*Function*): A function that accepts the application state, and
returns the slice you want subscribe to for changes.

e.g:
```typescript
this.counter$ = this.ngRedux.select(state=>state.counter);
// or 
this.counterSubscription = this.ngRedux
  .select(state=>state.counter)
  .subscribe(count=>this.counter = count);
// or

this.counter$ = this.ngRedux.select('counter');  
```

### @select(key | function)

Property decorator.

Attaches an observable to the property which will reflect the latest value in
the Redux store.

__Arguments:__

* `key` \(*string*): A key within the state that you want to subscribe to.
* `selector` \(*Function*): A function that accepts the application state, and
returns the slice you want to subscribe to for changes.

e.g. see [the @select decorator](#the-select-decorator)

### @dispatch(func)

Property decorator.

Attaches a class instance method which will dispatch the action creator passed
as the function.

__Arguments:__

* `func` \(*Function*): A redux action creator function

e.g. see [the @dispatch decorator](#the-dispatch-decorator)

### @dispatchAll(obj)

Class decorator.

Attaches class instance methods to the class which will dispatch every action
creator function found on the received object.

__Arguments:__

* `obj` \(*Object*): An object containing Action Creator functions. Anything
else other than a function will be ignored.

That is if: 

```typescript
@dispatchAll({
    increment: () => (<Redux.Action>{ type: 'INCREMENT' }),
    decrement: () => (<Redux.Action>{ type: 'DECREMENT' })
})
class Counter {}
```

then the counter component will have two methods: `this.increment` and
`this.decrement` which will dispatch the action creators from the received
object.

e.g. see [the @dispatchAll decorator](#the-dispatchall-decorator)

### `connect(mapStateToTarget, mapDispatchToTarget)(target)`

Connects an Angular component to Redux, and maps action creators and store
properties onto the component instance.

__Arguments:__

* `mapStateToTarget` \(*Function*): connect will subscribe to Redux store
updates. Any time it updates, mapStateToTarget will be called. Its result
must be a plain object, and it will be merged into `target`. If you have
a component which simply triggers actions without needing any state you
can pass null to `mapStateToTarget`.
* [`mapDispatchToTarget`] \(*Object* or *Function*): Optional. If an object
is passed, each function inside it will be assumed to be a Redux action
creator. An object with the same function names, but bound to a Redux store,
will be merged onto `target`. If a function is passed, it will be given
`dispatch`. It’s up to you to return an object that somehow uses `dispatch`
to bind action creators in your own way. (Tip: you may use the
[`bindActionCreators()`](http://gaearon.github.io/redux/docs/api/bindActionCreators.html)
helper from Redux.).

*You then need to invoke the function a second time, with `target` as
parameter:*

* `target` \(*Object* or *Function*): If passed an object, the results of
`mapStateToTarget` and `mapDispatchToTarget` will be merged onto it. If
passed a function, the function will receive the results of `mapStateToTarget`
and `mapDispatchToTarget` as parameters.

e.g:
```typescript
connect(this.mapStateToThis, this.mapDispatchToThis)(this);
// or:
connect(this.mapState, this.mapDispatch)((selectedState, actions) => {/* ... */});
```

__Remarks:__
* The `mapStateToTarget` function takes a single argument of the entire Redux
store’s state and returns an object to be passed as props. It is often called a
selector. Use reselect to efficiently compose selectors and compute derived
data.

### Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are
exposed by $ngRedux and can be accessed directly. For example:

```typescript
ngRedux.subscribe(() => {
    let state = $ngRedux.getState();
    //...
})
```

This means that you are free to use Redux basic API in advanced cases where
`connect`'s API doesn't fill your needs.
