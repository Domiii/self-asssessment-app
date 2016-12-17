import { actionCreator } from 'src/util/actionUtil';

const createAction = actionCreator('CONCEPT_QUESTION_');

export const createSuccess = createAction('createSuccess');
export const updateSuccess = createAction('updateSuccess');
export const readListSuccess = createAction('readListSuccess');
export const deleteSuccess = createAction('deleteSuccess');



// TODO:
// var todosRef = new Firebase("https://yourdb.firebaseio.com/todos/" + uid);
// var privateTodosRef = todos.orderByChild("x/y/z/categoryId").equalTo(true);