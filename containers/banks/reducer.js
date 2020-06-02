import { GET_BANK, RESOLVE_BANK, UPDATE_BANK, WITHDRAW_TO_BANK } from "../rootAction/types";

const initialState = {
  banks: [],
  resolvebank: [],
  updatebank: [],
  bankwithdraw: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_BANK:
      return {
        ...state,
        banks: action.payload,
      };
    case RESOLVE_BANK:
      return {
        ...state,
        resolvebank: [...state.resolvebank, action.payload],
      };
    case UPDATE_BANK:
      return {
        ...state,
        updatebank: [...state.updatebank, action.payload],
      };
    case WITHDRAW_TO_BANK:
      return {
        ...state,
        bankwithdraw: [...state.bankwithdraw, action.payload],
      };
    default:
      return state;
  }
}
