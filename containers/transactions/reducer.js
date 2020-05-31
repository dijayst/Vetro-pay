import { GET_USER_PERIODS, GET_USER_TRANSACTION, POST_TRANSACTION, SEND_MONEY_PRE_VERIFY, POST_SEND_MONEY } from "../rootAction/types";

const initialState = {
  userperiod: [],
  usertransactions: [],
  posttransaction: [],
  sendmoneypreverify: [],
  sendmoney: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_PERIODS:
      return {
        ...state,
        userperiod: action.payload,
      };
    case GET_USER_TRANSACTION:
      return {
        ...state,
        usertransactions: [...state.usertransactions, action.payload],
      };
    case POST_TRANSACTION:
      return {
        ...state,
        posttransaction: [...state.posttransaction, action.payload],
      };
    case SEND_MONEY_PRE_VERIFY:
      return {
        ...state,
        sendmoneypreverify: [...state.sendmoneypreverify, action.payload],
      };
    case POST_SEND_MONEY:
      return {
        ...state,
        sendmoney: [...state.sendmoney, action.payload],
      };
    default:
      return state;
  }
}
