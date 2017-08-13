## Simple Self-Assessment App
Built with React, Redux, Firebase and [redux-react-firebase](https://github.com/tiberiuc/redux-react-firebase).

## Get Ready #1: Install the app
  1. `git submodule update --init --recursive`
  1. `cd local_modules/react-redux-firebase`
  1. (`git remote set-url --push origin git@github.com:Domiii/react-redux-firebase.git`)
  1. `git checkout master`
  1. `npm update` # (see [NPM issue #9707](https://github.com/npm/npm/issues/9707))
  1. `cd ../..`
  1. `npm update`

## Get Ready #2: Setup firebase
  1. `npm install -g firebase-tools`
  1. `firebase login`
  1. `firebase init` (with default settings)

## Deployment
  1. `npm run deploy` (requires full privileges for the firebase account)


## Technology Stack
  1. NodeJs
  1. Bable (for [ES6](http://es6-features.org/) + ES7 support) ([a brief history of JS](https://benmccormick.org/2015/09/14/es5-es6-es2016-es-next-whats-going-on-with-javascript-versioning/), [一看就懂的 React ES5、ES6+ 常見用法對照表](http://blog.techbridge.cc/2016/04/04/react-react-native-es5-es6-cheat-sheet/))
  1. React (front-end)
  1. Redux (front-end data model)
  1. Firebase (database)
  1. redux-react-firebase (glues it all together)
  1. Other libraries (Bootstrap)
  1. Other tools: `npm` + `git`



## TODO
* User "groups"
* self-assessment system
* skill trees
* assign students to group
* setup explicitIndices for many-to-many relationships
* setup group<->user many-to-many relationship
* let students of same group create + edit teams
* create + edit learnerCheckListTemplates
* create learnerCheckLists from learnerCheckListTemplates
* add students/teams/groups to learnerCheckLists
* be able to work through learnerCheckLists

* layout: change layout of "done" items: background = grey-ish, change button color (red -> green)
* bug: Safari layouting is broken!!!!
* bug: percentage summation is broken
* safety switch: Don't be able to delete concepts that have children
* safety switch: Don't display trash can when adding stuff

* Notifications
** create a parameter -> path mapping for notification-related data
** create a batch request for all notification-related data, possibly using simpler syntax
** render notifications properly


* feedback system
** teacher/admin can give written feedback on all submissions
** add notification for feedback entry
** can see all feedback given to self on one page


* Better submission + progress overview
** submission progress bar
*** three-colored bar: A x (not done), B x (submitted + unchecked), C x (submitted + checked)
** need single (admin-only?) view over everyone's current submission status (of a specific concept + child concepts)
** submission: simple YSIWYG MD editor
** add new symbols to markdown: link, google drive/slides, youtube video, scratch project (can easily choose: embed mode and/or code)

* proper error handling

* stats + "evaluation system"
** Visualize data and evaluate first results, after Wed class
** See stats/comparisons related to every concept/conceptCheck?

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
* bug: Safari layouting is broken!!!!

* Data cleaning + verification: Add methods to view + easily remove duplicate children on pre-defined indices


## More TODO
* bug: move ensureUserInitialized to componentWillMount, use onAuthStateChanged event
* bug: language buttons appear only after user is updated the first time?
* bug: Scratch embed craps out?
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

* Data refactoring
** separate progress updates from other check responses, separate into different paths, instead of using `selected` child
** change checkResponse key to match `uid_checkId` index

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


# Some component design strategies
* make sure, all queries are executed on page level (for now)
* pass down modifier actions to let children make changes to query parameters
* actions and accessors can be on lower (but not too often used) components
* components that are created a lot should not define their own data accessors (because they are not performance-optimizied, for now)



# More References
* https://github.com/vacuumlabs/firebase-transactions/blob/master/wiki/tutorial.md



group plan:


* get all paths from group ref wrapper entries
  if (groupBy) {
    paths = children.map(getVariables(groupBy))...
  }

* paths of children of groups should all feed from group variables

* func of group has no pathTemplate or path argument, but needs to act as a path argument propagater
  * When calling child func of group, need to pull arguments from group