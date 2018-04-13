import * as ActionTypes from './constants';

export function selectGroup(group) {
  return {
    type: ActionTypes.SELECTD_GROUP,
    group,
  };
}

export function groupClean() {
  return {
    type: ActionTypes.GROUP_CLEAN,
  };
}
