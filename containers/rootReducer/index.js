import { combineReducers } from "redux";
import errors from "./errors";
import messages from "./messages";
import authentication from "../authentication/reducer";
import authchange from "../authchange/reducer";
import regvalidate from "../regvalidate/reducer";
import transactions from "../transactions/reducer";
import banks from "../banks/reducer";

export default combineReducers({
  errors,
  messages,
  authentication,
  authchange,
  regvalidate,
  transactions,
  banks,
});
