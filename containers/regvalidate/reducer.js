import { POST_PREREG_DETAILS, REG_AUTH_CHECKER, REGISTER_USER } from "../rootAction/types";

const initialState = {
  prereg: [],
  regauth: [],
  register: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case POST_PREREG_DETAILS:
      return {
        ...state,
        prereg: [...state.prereg, action.payload],
      };
    case REG_AUTH_CHECKER:
      return {
        ...state,
        regauth: [...state.regauth, action.payload],
      };
    case REGISTER_USER:
      return {
        ...state,
        register: [...state.register, action.payload],
      };
    default:
      return state;
  }
}
