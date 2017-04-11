## Simple Self-Assessment App
Built with React, Redux, Firebase and [redux-react-firebase](https://github.com/tiberiuc/redux-react-firebase).

## Install instructions
  1. `npm install`
  1. `cd third_party/redux-react-firebase`
  1. `npm install --prefix ../..`
  1. `cd ../..`

## Get Started
  1. `npm install -g firebase-tools`
  1. `firebase login`
  1. `firebase init` (with default settings)

## Deployment
  1. `npm run build`
  1. `firebase deploy`

## TODO
* Submission by students:
** Offer text/markdown-based replies by users for every concept

* Versioning system (disable most of client functionality when client and DB version don't match)
* Log all kinds of user interactions
** logUserActions
** logUIActivities
** logUIEvents
* Add system for check progress caching
* Add Google Slides to markdown
* Content: Add a whole lot more checks - https://docs.google.com/presentation/d/1Bt_ARtiApPVIdeTOl_CjIbxRGi3Qn3LBHztJYS2QY9c/edit#slide=id.g16414f4e50_0_51
* Store updatedAt + createdAt data on all kinds of data?
* Test new user + un-privileged users


## TODO: logging

logUserActions (hooks into all server actions; can be used to log all DB writes?)



logUIEvents

```json
[
  uid,
  uiActionName,     // [UserIsBack, UserIdle, ApplicationFocusLost]
  args
]
```

## More TODO

* Show orphaned concepts, checks and other orphaned data
* Notifications
* Groups + Grouping
* More Submission features
** Backend for viewing, checking off and working with submissions
** Peer assessment

* Filter: Finished, Unfinished, Untried
* Filters: Checkboxes of response types
* Display statistics
* Add 小筆記 feature
* Activity logging
* Fancy features
** Handle invalid urls + 404s properly

### Research TODO
* Produce rules for self-evaluating whether we know non-concrete answers or not
* Estimate size of a question in the "learning space" relative to one another (broader, more general questions are bigger than more specific questions)
* Estimate size of entire "learning space"


### Done
* CRUD concepts + concept questions
* Implement original prototype: http://codepen.io/Domiii/pen/MbGLxJ
* Implement generalized Firebase interface and corresponding utilities (see `src/util/firebaseUtil`)
* Add bootstrap + react-bootstrap
* Implement redux-act: https://github.com/pauldijou/redux-act/blob/master/examples/todomvc/reducers/todos.js


# More References
* https://github.com/vacuumlabs/firebase-transactions/blob/master/wiki/tutorial.md
