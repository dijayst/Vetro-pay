import {
  GET_TRX_TRANSACTIONS,
  GET_USDT_TRANSACTIONS,
  GET_TRX_FEES,
  POST_TRX,
  GET_USD_TRANSACTIONS,
  DEPOSIT_USD,
  WITHDRAW_USD,
  USD_USDT_SWAP,
  DEPOSIT_USDT,
  DEPOSIT_TRX,
  FREEZE_TRX,
  GET_BTC_TRANSACTIONS,
  GET_BTC_FEES,
  POST_BTC,
  DEPOSIT_BTC,
} from "../rootAction/types";

const initialState = {
  usd: { processing: true },
  usdt: { processing: true },
  trx: { processing: true },
  btc: { processing: true },
  fees: [],
  posts: [],
  depositusd: [],
  depositusdt: [],
  withdrawusd: [],
  usdusdtswap: [],
  deposittrx: [],
  freezetrx: [],
  depositbtc: [],
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
    case GET_BTC_FEES:
      return {
        ...state,
        fees: [...state.fees, action.payload],
      };
    case POST_TRX:
    case POST_BTC:
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
    case DEPOSIT_USDT:
      return {
        ...state,
        depositusdt: [...state.depositusdt, action.payload],
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
    case FREEZE_TRX:
      return {
        ...state,
        freezetrx: [...state.freezetrx, action.payload],
      };
    case GET_BTC_TRANSACTIONS:
      return {
        ...state,
        btc: action.payload,
      };

    case DEPOSIT_BTC:
      return {
        ...state,
        depositbtc: [...state.depositbtc, action.payload],
      };
    default:
      return state;
  }
}
