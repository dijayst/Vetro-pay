import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { GET_CREDIT_STATUS, GET_CREDIT_HISTORY, REQUEST_CREDIT } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// CREDIT STATUS
export const getCreditStatus = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/credit/status`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_CREDIT_STATUS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// CREDIT HISTORY
export const getCreditHistory = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/credit/history`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_CREDIT_HISTORY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// REQUEST CREDIT
export const requestCredit = (amount) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/credit/request`, { amount: amount }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: REQUEST_CREDIT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
