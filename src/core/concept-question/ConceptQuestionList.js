import { FirebaseList } from 'src/core/firebase';
import * as actions from './actions';
import { ConceptQuestion } from './ConceptQuestion';


export const conceptCategoryList = new FirebaseList({
  onAdd: actions.createSuccess,
  onChange: actions.updateSuccess,
  onLoad: actions.readListSuccess,
  onRemove: actions.deleteSuccess
}, ConceptQuestion);
