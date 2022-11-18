import {
  GET_TRX_TRANSACTIONS,
  GET_USDT_TRANSACTIONS,
  GET_TRX_FEES,
  POST_TRX,
  GET_USD_TRANSACTIONS,
  DEPOSIT_USD,
  WITHDRAW_USD,
  USD_USDT_SWAP,
  DEPOSIT_TRX,
} from "../rootAction/types";

const initialState = {
  usd: { processing: true },
  usdt: { processing: true },
  trx: { processing: true },
  fees: [],
  posts: [],
  depositusd: [],
  withdrawusd: [],
  usdusdtswap: [],
  deposittrx: [],
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
    case GET_USD_TRANSACTIONS:
      return {
        ...state,
        usd: action.payload,
      };
    case DEPOSIT_USD:
      return {
        ...state,
        depositusd: [...state.depositusd, action.payload],
      };
    case WITHDRAW_USD:
      return {
        ...state,
        withdrawusd: [...state.withdrawusd, action.payload],
      };
    case USD_USDT_SWAP:
      return {
        ...state,
        usdusdtswap: [...state.usdusdtswap, action.payload],
      };
    case DEPOSIT_TRX:
      return {
        ...state,
        deposittrx: [...state.deposittrx, action.payload],
      };
    default:
      return state;
  }
}
