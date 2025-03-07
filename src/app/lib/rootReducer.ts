// ./src/app/lib/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "../lib/features/users/userSlice";

const rootReducer = combineReducers({
  users: usersReducer, // Add your reducers here
});

export default rootReducer;
