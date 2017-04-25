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

* bug: Safari layouting is broken!!!!
* bug: language buttons appear only after user is updated the first time?
* bug: Scratch embed craps out?

* submission system
** allow users to submit outcomes to concepts/missions
** add new symbols to markdown: google drive/slides, youtube video, scratch embed, (scratch w/ code?) 
** simple YSIWYG MD editor

* User "groups"
** Used to limit what activity other users see

* Log all kinds of user interactions
** -> Establish aliases for DB actions (pathTemplate + write action, pathTemplate + method)
** logUserActions
** logUIActivities
** logUIEvents

* stats + "evaluation system"
** Visualize data and evaluate first results, after Wed class
** See stats/comparisons related to every concept/conceptCheck?

* add submission review page route
** feedback system
** user must see all pending feedback on one screen!!!

* submission progress bar
** three-colored bar: A x (not done), B x (submitted + unchecked), C x (submitted + checked)

* all kinds of small things
** Navigation: Add "left" , "right" + "up" buttons to quickly navigate to previous and next siblings, and parent
** Editor: Add "move up" + "move down" buttons to child concepts edit tools (changes order)
** Add preview to concept display + editor
** Move editor save button to the top

* User overview
** See all users

* notification system

* Add buttons to evaluate a concept: good/bad/requests/"add to short list"?

* Add optional written feedback option to concept check response (automatically opens up when selecting report-type checks)
* make the interface more exploratory
** Hide advanced concepts
** Boss level unlocks advanced concepts

* Test new users + un-privileged users



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
* firebase rule replacer utility: make it nice and easy to write aliases for rule checks
* firebase index validation utility: make it nice and easy to check/verify/update all indices through commandline
* firebase cache validation utility: make it nice and easy to check/verify/update all kinds of cached info through commandline
* Add system for "check progress caching", reduce load requirements
* Add auto-screenshot preview feature (use [html2canvas](http://html2canvas.hertzen.com/examples.html))
* Show orphaned concepts, checks and other orphaned data
* Add Google Slides to markdown
* Versioning system (disable most of client functionality when client and DB version don't match)
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



# More References
* https://github.com/vacuumlabs/firebase-transactions/blob/master/wiki/tutorial.md
