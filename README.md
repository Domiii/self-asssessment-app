# Simple Self-Assessment App
Built with React, Redux, Firebase and based on [todo-react-redux](https://github.com/r-park/todo-react-redux).

# Install instructions
## `npm install`
## `cd third_party/redux-react-firebase`
## `npm install --prefix ../..`
## `cd ../..`


### TODO
* fix RefWrapper to work as a factory with easier access to all data
* finalize quiz + question editor GUI
* Convert question data to new format
* Store question data in DB
* Store responses in DB
* Visualize responses of each individual Question
* ResponseSummary
* Teacher view: Pick a user from list of all users and check their responses with options: [OverEstimated, UnderEstimated, JustRight]
* Filter: Finished, Unfinished, Untried
* Filters: Checkboxes of response types
* Advanced question rendering
** Render per-question code beneath text
** Add markdown support to question text
** (Render symbol images in questions)
* Add all questions - https://docs.google.com/presentation/d/1Bt_ARtiApPVIdeTOl_CjIbxRGi3Qn3LBHztJYS2QY9c/edit#slide=id.g16414f4e50_0_51
* Display statistics
* Make sure, 小筆記 feature works
* Activity logging
* Fancy features
** Render in-line code vertically centered
** Handle invalid urls

### Research TODO
* Produce rules for self-evaluating whether we know non-concrete answers or not
* Estimate size of a question in the "learning space" relative to one another (broader, more general questions are bigger than more specific questions)
* Estimate size of entire "learning space"


### Done
* CRUD quizzes + quiz questions
* Implement original prototype: http://codepen.io/Domiii/pen/MbGLxJ
* Implement generalized Firebase interface and corresponding utilities (see `src/util/firebaseUtil`)
* Add bootstrap + react-bootstrap
* Implement redux-act: https://github.com/pauldijou/redux-act/blob/master/examples/todomvc/reducers/todos.js


# More References
* https://github.com/vacuumlabs/firebase-transactions/blob/master/wiki/tutorial.md