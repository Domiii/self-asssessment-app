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

* submission system
** allow users to submit outcomes to concepts/missions
** add new symbols to markdown: google drive/slides, youtube video, scratch embed, (scratch w/ code?) 
** simple YSIWYG MD editor

* submission review page route
** feedback system

* Log all kinds of user interactions
** logUserActions
** logUIActivities
** logUIEvents

* stats + "evaluation system"
** Visualize data and evaluate first results, after Wed class
** See stats/comparisons related to every concept/conceptCheck?

* User "groups"
** Used to limit what activity other users see

* all kinds of small things
** Navigation: Add "left" , "right" + "up" buttons to quickly navigate to previous and next siblings, and parent
** Editor: Add "move up" + "move down" buttons to child concepts edit tools (changes order)
** Add preview to concept display + editor
** Move editor save button to the top

* User overview
** See all users

* notification system

* firebase rule replacer utility: make it nice and easy to write aliases for rule checks

* Add buttons to evaluate a concept: good/bad/requests/"add to short list"?

* Add optional written feedback option to concept check response (automatically opens up when selecting report-type checks)
* make the interface more exploratory
** Hide advanced concepts
** Boss level unlocks advanced concepts
* Content: Add a whole lot more checks - https://docs.google.com/presentation/d/1Bt_ARtiApPVIdeTOl_CjIbxRGi3Qn3LBHztJYS2QY9c/edit#slide=id.g16414f4e50_0_51
* Test new user + un-privileged users
* Checks: Add "Done!" (or "Skip") check + "Like!" reply options to concepts
** When not all checks are checked, "Done!" button is actually "Skip" button, and triggers special confirmation modal


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
