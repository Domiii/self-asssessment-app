This folder provides a few powerful tools to make it even easier to work with [redux-react-firebase](https://github.com/tiberiuc/redux-react-firebase).

DISCLAIMER: This is still in development, and because I of a lack of time to get all my stuff done, I had to focus on the features I most needed at first. Overall design is not bad, but code quality could be better. Tests are still missing entirely. Ideally, the different features could probably be better modularized and made largely independent of one another.


## Features

1. Provides a crude [DSL](https://en.wikipedia.org/wiki/Domain-specific_language) for defining your firebase schema (but without type checking or other sorts of data validators for now).
1. Makes it a lot easier to plug a new data path into your application by providing a bunch of generalized path-to-action mappings.
1. Built-in [composite index](http://stackoverflow.com/questions/26700924/query-based-on-multiple-where-clauses-in-firebase) support.


## Hello World

TODO: A simple hello world


## API

### `makeRefWrapper`

This function creates a factory (and a lot more).

TODO

##### Simple Example

Every `ref wrapper` created from the `makeRefWrapper` factory comes equipped with the following methods:

* `get val()`
* `isLoaded()`
* `set(val)`
* `update(val)`
* `push(val)`
* `transaction(cb)` (INCOMPLETE: is not affected by other configuration the way it should (e.g. `indices`))

Some more methods (but you will/should not need these usually, because of automatically configured `children` (see below)):

* `getRef(path)`
* `getData(path, defaultValue)`
* `setChild(path, val)`
* `updateChild(path, val)`
* `pushChild(path, val)`
* `transactionChild(path, cb)`

TODO

**Example**

``js
``

##### Custom props

* `props`

TODO

#### `pathTemplate`

TODO

#### `children`

Each child can completely define it's own `ref wrapper` specs. The creation process is (almost) the same as for the root, which means that you can again either define a complete config or only a `pathTemplate`.

In addition to automatically generated methods for each child, you can also specify a custom set of `methods` and `cascadingMethods` to be added to any child `ref wrapper` (see below).

TODO

##### Data Accessors

For each child, data access functions are generated and added to the prototype of the objects coming out of the `ref wrapper` factory, specifically for a child named `name`, we would get the following methods:

* `name()` returns the value of the available data at the path
* `push_name(val)`
* `set_name(val)`
* `update_name(val)`
* `batchUpdate_name(val)`
* `delete_name(val)`


``js
const UserRef = makeRefWrapper({
  // ...

  children: {
    name: 'name'
  }

  // ...
});

@firebase(...)    // UserRef.makeQuery(...) here
@connect(...)     // UserRef(firebase, customProps) here
export class UserView {
  render() {
    const { userRef } = this.props;

    // TODO
  }
}
``

##### Automatic Parameters

Parameters in the `pathTemplate` are automatically added to the data accessors.

TODO


#### `methods`

TODO

#### `cascadingMethods`

TODO

#### `inheritedMethods`

TODO

#### `updatedAt`

#### Custom queries

TODO: `queryString` + `makeQuery`

1. The `makeQuery` function can be overridden to return a different path and appended query string.
1. The `queryString` function can be overridden to customize the query string behind the path.
1. A custom `queryString` function can make use of the `indices.where` function to produce custom queries, based on pre-defined `indices`

#### Custom indexing

TODO: `indices`


## More Examples

You probably want to take a look at [how I define my user data](https://github.com/Domiii/self-asssessment-app/blob/master/src/core/users/UserInfoRef.js).

After that, you can find a bucket-load of examples of in [src/core/concepts](https://github.com/Domiii/self-asssessment-app/tree/master/src/core/concepts).