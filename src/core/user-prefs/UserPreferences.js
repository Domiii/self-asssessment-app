import { Record } from 'immutable';


/** Data schema:

userPreferences: {
  $uid: {
    quizCategoryId: ...,
    quizQuestionId: ...
  }
}
 */


export const UserPreferences = new Record({
  quizCategoryId: null,
  quizQuestionId: null
});