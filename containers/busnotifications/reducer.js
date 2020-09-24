import { GET_BUSINESS_NOTIFICATIONS } from "../rootAction/types";

const initialState = {
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_BUSINESS_NOTIFICATIONS:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    default:
      return state;
  }
}
