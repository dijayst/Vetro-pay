import { CARD_DEPOSIT, TOKEN_DEPOSIT } from "../rootAction/types";

const initialState = {
  card: [],
  token: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CARD_DEPOSIT:
      return {
        ...state,
        card: [...state.card, action.payload],
      };
    case TOKEN_DEPOSIT:
      return {
        ...state,
        token: [...state.token, action.payload],
      };
    default:
      return state;
  }
}
