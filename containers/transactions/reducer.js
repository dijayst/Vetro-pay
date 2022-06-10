import { GET_USER_PERIODS, GET_USER_TRANSACTION, POST_TRANSACTION, SEND_MONEY_PRE_VERIFY, POST_SEND_MONEY, FINANCE_VISUALIZER, GET_FX_RATE } from "../rootAction/types";

const initialState = {
  userperiod: [],
  usertransactions: [],
  posttransaction: [],
  sendmoneypreverify: [],
  sendmoney: [],
  visualizer: [],
  fxrates: [
    {
      name: "N?A",
      currency: "M?A",
      short: "N?A",
      emoji: "N?A",
      fee: "",
      rate: 0,
      minimum: 1000,
    },
  ],
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
    case FINANCE_VISUALIZER:
      return {
        ...state,
        visualizer: [...state.visualizer, action.payload],
      };

    case GET_FX_RATE:
      return {
        ...state,
        fxrates: action.payload,
      };
    default:
      return state;
  }
}
