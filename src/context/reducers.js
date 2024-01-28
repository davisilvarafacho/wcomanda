import * as initalStates from 'context/defineStates';
import { actions } from 'constants/actions';

export function userReducer(state = { ...initalStates.user }, action) {
  const newState = { ...state };

  switch (action.type) {
    default:
      return state;
  }
}
