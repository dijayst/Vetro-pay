import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { GET_USER_PERIODS, GET_USER_TRANSACTION, POST_TRANSACTION, SEND_MONEY_PRE_VERIFY, POST_SEND_MONEY } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// USER PERIODS
export const getSysPeriod = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/user/sysperiods`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_USER_PERIODS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// GET USER TRANSACTION
export const getUserTransaction = (userPeriod) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/user/transactions`, { user_period: userPeriod }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_USER_TRANSACTION,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

//POST TRANSACTION
export const postTransaction = (transactionDate, transactionClass, paymentMethod, amount, paymentCategory, note) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/user/transactions/theta/`,
      {
        off_app: true,
        transaction_date: transactionDate,
        transaction_type: transactionClass,
        payment_method: paymentMethod,
        transaction_category: paymentCategory,
        note: note,
        amount: amount,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: POST_TRANSACTION,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// POST SEND-MONEY PRE-VERIFY
export const postSendMoneyPreVerify = (international, country, phoneNumberUID, amount, paymentCategory, note, transactionPin) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/smart-transfer-verify`,
      {
        international: international,
        country: country,
        recipient: phoneNumberUID,
        amount: amount,
        payment_category: paymentCategory,
        note: note,
        transaction_pin: transactionPin,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: SEND_MONEY_PRE_VERIFY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// POST SEND-MONEY
export const postSendMoney = (international, country, phoneNumberUID, amount, paymentCategory, note, transactionPin) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/smart-transfer`,
      {
        international: international,
        country: country,
        recipient: phoneNumberUID,
        amount: amount,
        payment_category: paymentCategory,
        note: note,
        transaction_pin: transactionPin,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: POST_SEND_MONEY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
