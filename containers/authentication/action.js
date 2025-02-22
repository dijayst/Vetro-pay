import axios from "axios";
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
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

//Create Token Config
export const tokenConfig = (getState) => {
  //Get token from state
  token = getState().authentication.token;

  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};

//CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
  //User Loading
  dispatch({ type: USER_LOADING });

  axios
    .get(`${BASE_URL}/api/auth/user`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

// LOGIN USER
export const login =
  (phoneNumber, password, deeplinkGatewayExchange = null) =>
  (dispatch, getState) => {
    axios
      .post(`${BASE_URL}/api/auth/login`, { phone_number: phoneNumber, password: password }, tokenConfig(getState))
      .then((res) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
          deeplinkGatewayExchange: deeplinkGatewayExchange,
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: LOGIN_FAIL,
        });
      });
  };

// FLUSH DEEPLINK GATEWAY EXCHANGE
export const flushDeepLinkGatewayExchange = () => (dispatch, getState) => {
  dispatch({
    type: FLUSH_DEEPLINK_DATA,
  });
};

// USER DELETE ACCOUNT
export const deleteUserAccountPrompt = () => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/auth/delete-account`, { action: "delete" }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_ACCOUNT_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// PUSH ACTIVITY VERIFICATION TOKE
export const pushActivityVerificationToken = () => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/user/push-verification-token`, {}, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: PUSH_ACTIVITY_VERIFICATION_TOKEN,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// POST VERIFICATION ID
export const postVerificationId = (verification_id) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/user/post-verification-document`, { verification_id }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DOCUMENT_VERIFICATION,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/auth/logout`, null, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
