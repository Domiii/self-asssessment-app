import { getPath } from './constants';
import firebase from 'firebase';
import { actionCreator } from 'src/util/actionUtil';

const createAction = actionCreator('SESSION_');

export function gotoNextProblem(db) {
  db.put();
}