import localStorage from "react-native-sync-localstorage";
import { USER_LOADING, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, PUSH_ACTIVITY_VERIFICATION_TOKEN } from "../rootAction/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  dateTime: new Date(),
  activityToken: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
        dateTime: new Date(),
      };

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        dateTime: new Date(),
      };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        dateTime: new Date(),
      };

    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        dateTime: new Date(),
      };

    case PUSH_ACTIVITY_VERIFICATION_TOKEN:
      return {
        ...state,
        activityToken: [...state.activityToken, action.payload],
      };

    default:
      return state;
  }
}
