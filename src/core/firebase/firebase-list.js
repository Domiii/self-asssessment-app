import { firebaseDb } from './firebase';


export class FirebaseList {
  constructor(actions, modelClass, path = null) {
    this._actions = actions;
    this._modelClass = modelClass;
    this._path = path;
    this._list = null;
    this._isInitialized = false;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  get path() {
    return this._path;
  }

  set path(value) {
    this._path = value;
  }

  push(value) {
    return new Promise((resolve, reject) => {
      firebaseDb.ref(this._path)
        .push(value, error => error ? reject(error) : resolve());
    });
  }

  remove(key) {
    return new Promise((resolve, reject) => {
      firebaseDb.ref(`${this._path}/${key}`)
        .remove(error => error ? reject(error) : resolve());
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      firebaseDb.ref(`${this._path}/${key}`)
        .set(value, error => error ? reject(error) : resolve());
    });
  }

  update(key, value) {
    return new Promise((resolve, reject) => {
      firebaseDb.ref(`${this._path}/${key}`)
        .update(value, error => error ? reject(error) : resolve());
    });
  }

  subscribe(emit) {
    let list = this._list;

    if (this._isInitialized) {
      // started already... re-trigger load event!?
      emit(this._actions.onLoad(list));
      return;
    }
    else if (this._unsubscribe)
    {
      // already started process -> Will trigger events soon enough!
      return;
    }

    // go!
    let ref = firebaseDb.ref(this._path);
    list = this._list = [];

    ref.once('value', () => {
      this._isInitialized = true;
      emit(this._actions.onLoad(list));
    });

    ref.on('child_added', snapshot => {
      if (this._isInitialized) {
        emit(this._actions.onAdd(this.unwrapSnapshot(snapshot)));
      }
      else {
        list.push(this.unwrapSnapshot(snapshot));
      }
    });

    ref.on('child_changed', snapshot => {
      emit(this._actions.onChange(this.unwrapSnapshot(snapshot)));
    });

    ref.on('child_removed', snapshot => {
      emit(this._actions.onRemove(this.unwrapSnapshot(snapshot)));
    });

    this._unsubscribe = () => ref.off();
  }

  unsubscribe() {
    this._unsubscribe();
  }

  unwrapSnapshot(snapshot) {
    let attrs = snapshot.val();
    attrs.key = snapshot.key;
    return new this._modelClass(attrs);
  }
}
