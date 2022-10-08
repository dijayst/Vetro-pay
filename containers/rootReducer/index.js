import { combineReducers } from "redux";
import errors from "./errors";
import messages from "./messages";
import authentication from "../authentication/reducer";
import authchange from "../authchange/reducer";
import regvalidate from "../regvalidate/reducer";
import transactions from "../transactions/reducer";
import banks from "../banks/reducer";
import business from "../business/reducer";
import utility from "../utility/reducer";
import busnotifications from "../busnotifications/reducer";
import deposit from "../deposit/reducer";
import cards from "../cards/reducer";
import savings from "../savings/reducer";
import blockchain from "../blockchain/reducer";
import loans from "../loans/reducer";

export default combineReducers({
  errors,
  messages,
  authentication,
  authchange,
  regvalidate,
  transactions,
  banks,
  business,
  utility,
  busnotifications,
  deposit,
  cards,
  savings,
  blockchain,
  loans,
});
