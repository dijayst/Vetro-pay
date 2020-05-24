import { combineReducers } from "redux";
import errors from "./errors";
import messages from "./messages";
import authentication from "../authentication/reducer";
import regvalidate from "../regvalidate/reducer";

export default combineReducers({
  errors,
  messages,
  authentication,
  regvalidate,
});
