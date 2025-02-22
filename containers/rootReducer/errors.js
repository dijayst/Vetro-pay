import { GET_ERRORS } from "../rootAction/types";

const initialState = {
  msg: {},
  status: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        dateTime: new Date(),
      };
    default:
      return state;
  }
}
