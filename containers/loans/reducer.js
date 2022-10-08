import { GET_LOAN_HISTORY, MAKE_LOAN_REPAYMENT, REQUEST_LOAN, VERIFY_EMPLOYMENT } from "../rootAction/types";

const initialState = {
  loans: [],
  request: [],
  employment: [],
  repayment: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LOAN_HISTORY:
      return {
        ...state,
        loans: [...state.loans, action.payload],
      };
    case REQUEST_LOAN:
      return {
        ...state,
        request: [...state.request, action.payload],
      };
    case VERIFY_EMPLOYMENT:
      return {
        ...state,
        employment: [...state.employment, action.payload],
      };
    case MAKE_LOAN_REPAYMENT:
      return {
        ...state,
        repayment: [...state.repayment, action.payload],
      };
    default:
      return state;
  }
}
