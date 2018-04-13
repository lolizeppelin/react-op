/*
 *
 *  group reducer
 *
 */

import { fromJS } from 'immutable';

import * as CONSTANTS from './constants';

const initialState = fromJS({
  // showd: null,
  // deleted: null,
  // created: null,
  // updated: null,
  // loading: false,
  // groups: [],
  group: null,
  // message: '',
});

function groupsReducer(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.SELECTD_GROUP:
      return state.set('group', action.group);
    case CONSTANTS.GROUP_CLEAN: {
      return state.set('group', null)
        // .set('created', null)
        // .set('deleted', null)
        // .set('updated', null)
        // .set('showed', null)
        ;
    }
    default:
      return state;
  }
}

export default groupsReducer;
