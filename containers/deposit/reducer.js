import { CARD_DEPOSIT } from "../rootAction/types";

const initialState = {
  card: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CARD_DEPOSIT:
      return {
        ...state,
        card: [...state.card, action.payload],
      };
    default:
      return state;
  }
}
