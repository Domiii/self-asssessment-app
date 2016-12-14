import { FirebaseList } from 'src/core/firebase';
import * as actions from './actions';
import { ConceptResponse } from './ConceptResponse';


export const ConceptResponseList = new FirebaseList({
  onAdd: actions.createSuccess,
  onChange: actions.updateSuccess,
  onLoad: actions.loadSuccess,
  onRemove: actions.deleteSuccess
}, ConceptResponse);
