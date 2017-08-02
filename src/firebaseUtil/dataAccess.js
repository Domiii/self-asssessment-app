import isString from 'lodash/isString';
import initial from 'lodash/initial';
import last from 'lodash/last';
import merge from 'lodash/merge';

import { pathJoin } from 'src/util/pathUtil';

export function createDataAccessors(prototype, children, variableTransform) {
  // add all children
  createChildDataAccessors(prototype, children, '', variableTransform);
}

function createChildDataAccessors(prototype, children, parentPathTemplate, variableTransform) {
  if (!children) {
    return;
  }

  for (let wrapperName in children) {
    const childCfgOrPath = children[wrapperName];
    const childPath = isString(childCfgOrPath) && childCfgOrPath || (childCfgOrPath && childCfgOrPath.pathTemplate || '');
    if (!childPath) {
      throw new Error(`invalid: no path given for '${wrapperName}' under '${parentPathTemplate}'`);
    }

    // the path is the relative path from the node of given prototype to current child
    // NOTE: The path is NOT the full path.
    // NOTE2: The path for `push` is actually the path up to and including the parent only.
    const pathTemplate = pathJoin(parentPathTemplate, childPath);
    const getPath = createPathGetterFromTemplateArray(pathTemplate, variableTransform);
    const addGetPath = createPathGetterFromTemplateArray(parentPathTemplate, variableTransform);

    if (prototype[wrapperName]) {
      throw new Error(`invalid: duplicate path name '${wrapperName}' under '${parentPathTemplate}'`);
    }

    // get
    prototype[wrapperName] = createChildDataGet(getPath);

    // add
    prototype['push_' + wrapperName] = createChildDataPush(addGetPath);

    // set
    prototype['set_' + wrapperName] = createChildDataSet(getPath);

    // update
    prototype['update_' + wrapperName] = createChildDataUpdate(getPath);

    // batch update (add to a single bigger update, instead of sending out multiple smaller updates individually)
    prototype['batchUpdate_' + wrapperName] = createAddChildDataUpdate(getPath);

    // delete
    prototype['delete_' + wrapperName] = createChildDataDelete(getPath);

    // keep going
    createChildDataAccessors(prototype, childCfgOrPath.children, pathTemplate);
  }
}

function createChildDataGet(getPath) {
  return function _get(...args) {
    const path = getPath(...args);
    return this.getData(path);
  };
}
function createChildDataPush(getPath) {
  if (getPath.hasVariables) {
    return function _push(...args) {
      const pathArgs = initial(args);
      const data = last(args);
      const path = getPath(...pathArgs);
      return this.pushChild(path, data);
    };
  }
  else {
    const path = getPath();
    return function _push(data) {
      return this.pushChild(path, data);
    };
  }
}
function createChildDataSet(getPath) {
  if (getPath.hasVariables) {
    return function _set(...args) {
      const pathArgs = initial(args);
      const data = last(args);
      const path = getPath(...pathArgs);
      return this.setChild(path, data);
    };
  }
  else {
    const path = getPath();
    return function _set(data) {
      return this.setChild(path, data);
    };
  }
}
function createChildDataUpdate(getPath) {
  if (getPath.hasVariables) {
    return function _update(...args) {
      const pathArgs = initial(args);
      const data = last(args);
      const path = getPath(...pathArgs);
      return this.updateChild(path, data);
    };
  }
  else {
    const path = getPath();
    return function _update(data) {
      return this.updateChild(path, data);
    };
  }
}
function createAddChildDataUpdate(getPath) {
  if (getPath.hasVariables) {
    return function _update(update, ...args) {
      const pathArgs = initial(args);
      const data = last(args);
      const path = getPath(...pathArgs);
      update[path] = update[path] && merge(update[path], data) || data;
    };
  }
  else {
    const path = getPath();
    return function _update(update, data) {
      update[path] = update[path] && merge(update[path], data) || data;
    };
  }
}
function createChildDataDelete(getPath) {
  if (getPath.hasVariables) {
    return function _delete(...args) {
      const path = getPath(...args);
      return this.setChild(path, null);
    };
  }
  else {
    const path = getPath();
    return function _delete() {
      return this.setChild(path, null);
    };
  }
}