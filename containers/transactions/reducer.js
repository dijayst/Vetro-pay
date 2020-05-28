import { GET_USER_PERIODS, GET_USER_TRANSACTION, POST_TRANSACTION } from "../rootAction/types";

const initialState = {
  userperiod: [],
  usertransactions: [],
  posttransaction: [],
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
    default:
      return state;
  }
}
