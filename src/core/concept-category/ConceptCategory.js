import { Record } from 'immutable';


/** Data schema:

conceptsCategories: {
  $id: {
    name: ...
  }
}
 */


export const ConceptCategory = new Record({
  name: null
});

// TODO:
// var todosRef = new Firebase("https://yourdb.firebaseio.com/todos/" + uid);
// var privateTodosRef = todos.orderByChild("x/y/z/categoryId").equalTo(true);