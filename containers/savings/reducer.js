import { CREATE_SAVINGS_PLAN, GET_SAVINGS_DATA, WITHDRAW_SAVINGS } from "../rootAction/types";

const initialState = {
  create: [],
  withdraw: [],
  savings: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SAVINGS_DATA:
      return {
        ...state,
        savings: [...state.savings, action.payload],
      };
    case CREATE_SAVINGS_PLAN:
      return {
        ...state,
        create: [...state.create, action.payload],
      };

    case WITHDRAW_SAVINGS:
      return {
        ...state,
        withdraw: [...state.withdraw, action.payload],
      };
    default:
      return state;
  }
}
