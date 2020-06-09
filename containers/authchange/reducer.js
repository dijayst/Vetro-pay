import { CHANGE_PASSWORD, CHANGE_PIN } from "../rootAction/types";

const initialState = {
  changepassword: [],
  changepin: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_PASSWORD:
      return {
        ...state,
        changepassword: [...state.changepassword, action.payload],
      };
    case CHANGE_PIN:
      return {
        ...state,
        changepin: [...state.changepin, action.payload],
      };
    default:
      return state;
  }
}
