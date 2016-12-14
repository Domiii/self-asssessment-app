import { Record } from 'immutable';


/** Data schema:

concepts: {
  $id: {
    categoryId: ...,
    text_en: ...,
    text_zh: ...,
    isPublic: ...,
    code: ...,
    info: ...,
    tags: {
      ...
    }
  }
}
".indexOn": "categoryId"


// for later (to replace text_en + text_zh):
conceptTexts: {
  $categoryId: {
    $lang: {
      $conceptId: "..."
    }
  }
}
 */


export const ConceptQuestion = new Record({
  categoryId: null,
  textId: null,
  code: null,
  info: null,
  tags: []
});

// TODO:
// var todosRef = new Firebase("https://yourdb.firebaseio.com/todos/" + uid);
// var privateTodosRef = todos.orderByChild("x/y/z/categoryId").equalTo(true);