import { createSelector } from 'reselect';

/**
 * Direct selector to the selectGogamechen1 state domain
 */
const selectGogamechen1 = () => (state) => state.get('groups');


/**
 * Default selector used by Gogamechen1
 */

const makeSelectGogamechen1 = () => createSelector(
  selectGogamechen1(),
  (substate) => {
    if (substate === undefined) return { group: null };
    return substate.toJS();
  }
);

export default makeSelectGogamechen1;

export { selectGogamechen1 };
