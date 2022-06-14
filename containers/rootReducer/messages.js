import { CREATE_MESSAGE } from "../rootAction/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_MESSAGE:
      return {
        ...action.payload,
        dateTime: new Date(),
      };
    default:
      return state;
  }
}
