import { GET_TRX_TRANSACTIONS, GET_USDT_TRANSACTIONS, GET_TRX_FEES, POST_TRX } from "../rootAction/types";

const initialState = {
  usdt: { processing: true },
  trx: { processing: true },
  fees: [],
  posts: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USDT_TRANSACTIONS:
      return {
        ...state,
        usdt: action.payload,
      };
    case GET_TRX_TRANSACTIONS:
      return {
        ...state,
        trx: action.payload,
      };
    case GET_TRX_FEES:
      return {
        ...state,
        fees: [...state.fees, action.payload],
      };
    case POST_TRX:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    default:
      return state;
  }
}
