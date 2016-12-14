import { FirebaseList } from 'src/core/firebase';
import * as actions from './actions';
import { ConceptCategory } from './ConceptCategory';


export const conceptCategoryList = new FirebaseList({
  onAdd: actions.createSuccess,
  onChange: actions.updateSuccess,
  onLoad: actions.readListSuccess,
  onRemove: actions.deleteSuccess
}, ConceptCategory);
