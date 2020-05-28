import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { GET_USER_PERIODS, GET_USER_TRANSACTION, POST_TRANSACTION } from "../rootAction/types";
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
