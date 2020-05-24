import { CREATE_MESSAGE, GET_ERRORS } from "../rootAction/types";

// MESSAGE  & ERROR REDUCERS IS LOCATED IN ../rootReducer/message.js  && ../rootReducer/message.js respectively

// CREATE MESSAGE
export const createMessage = (msg) => {
  return {
    type: CREATE_MESSAGE,
    payload: msg,
  };
};

// RETURN ERRORS
export const returnErrors = (msg, status) => {
  return {
    type: GET_ERRORS,
    payload: { msg, status },
  };
};
