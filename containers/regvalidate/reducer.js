import { POST_PREREG_DETAILS, REG_AUTH_CHECKER, REGISTER_USER, POST_EMAIL, EMAIL_VERIFY } from "../rootAction/types";

const initialState = {
  prereg: [],
  regauth: [],
  register: [],
  postemail: [],
  emailverify: [],
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
    case POST_EMAIL:
      return {
        ...state,
        postemail: [...state.postemail, action.payload],
      };
    case EMAIL_VERIFY:
      return {
        ...state,
        emailverify: [...state.emailverify, action.payload],
      };
    default:
      return state;
  }
}
