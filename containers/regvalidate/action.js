import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { AUTH_ERROR, POST_PREREG_DETAILS, REG_AUTH_CHECKER, REGISTER_USER, POST_EMAIL, EMAIL_VERIFY } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// POST PRE REG
export const postPreReg = (country, phoneNumber, fullName) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/phonenumber/verify`,
      {
        country: country,
        phone_number: phoneNumber,
        fullname: fullName,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: POST_PREREG_DETAILS,
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

// POST REG AUTHENTICATION CODE
export const postRegAuth = (country, phoneNumber, authCode) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/phonenumber/authchecker`,
      {
        country: country,
        phone_number: phoneNumber,
        auth_code: authCode,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: REG_AUTH_CHECKER,
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

// REGISTER USER
export const registerUser = (country, phoneNumber, fullName, password, securityQuestion, securityAnswer, transactionPin) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/auth/register`,
      {
        country: country,
        phone_number: phoneNumber,
        fullname: fullName,
        password: password,
        security_question: securityQuestion,
        security_answer: securityAnswer,
        transaction_pin: transactionPin,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: REGISTER_USER,
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

// POST USER EMAIL
export const postEmail = (email) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/email/verify`, { email: email }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: POST_EMAIL,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

//VERIFY USER EMAIL AUTHCODE
export const emailVerify = (email, authCode) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/email/authchecker`, { email: email, verify: authCode }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: EMAIL_VERIFY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
