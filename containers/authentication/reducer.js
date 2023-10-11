import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  PUSH_ACTIVITY_VERIFICATION_TOKEN,
  DOCUMENT_VERIFICATION,
  DELETE_ACCOUNT_SUCCESS,
  FLUSH_DEEPLINK_DATA,
} from "../rootAction/types";

const initialState = {
  token: AsyncStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  dateTime: new Date(),
  activityToken: [],
  documentVerification: [],
  deeplinkGatewayExchange: null,
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
      AsyncStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        dateTime: new Date(),
        deeplinkGatewayExchange: action.deeplinkGatewayExchange,
      };

    case FLUSH_DEEPLINK_DATA:
      return {
        ...state,
        deeplinkGatewayExchange: null,
      };

    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case DELETE_ACCOUNT_SUCCESS:
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

    case DOCUMENT_VERIFICATION:
      return {
        ...state,
        documentVerification: [...state.documentVerification, action.payload],
      };

    default:
      return state;
  }
}
