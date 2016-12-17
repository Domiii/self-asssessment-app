import { Record } from 'immutable';


/** Data schema:

conceptsCategories: {
  $id: {
    name: ...
  }
}
 */


export const ConceptCategory = new Record({
  name: null,
  icon: null
});