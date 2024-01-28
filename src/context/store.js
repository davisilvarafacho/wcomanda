import { combineReducers, createStore } from "redux";
import * as reducers from "./reducers";

const context = combineReducers({
  // user: reducers.user,
});

export const store = {}; // createStore(context);
