import { GET_CREDIT_STATUS, GET_CREDIT_HISTORY, REQUEST_CREDIT } from "../rootAction/types";

const initialState = {
  status: [],
  history: [],
  requestcredit: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CREDIT_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case GET_CREDIT_HISTORY:
      return {
        ...state,
        history: action.payload,
      };
    case REQUEST_CREDIT:
      return {
        ...state,
        requestcredit: [...state.requestcredit, action.payload],
      };
    default:
      return state;
  }
}
