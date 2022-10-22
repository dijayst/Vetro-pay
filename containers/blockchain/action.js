import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { GET_USDT_TRANSACTIONS, GET_TRX_TRANSACTIONS, GET_TRX_FEES, POST_TRX, GET_USD_TRANSACTIONS, DEPOSIT_USD, WITHDRAW_USD, USD_USDT_SWAP } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// GET USDT
export const getUsdtTransactions = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/blockchain/get-transactions/USDT`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_USDT_TRANSACTIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const getTrxTransactions = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/blockchain/get-transactions/TRX`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_TRX_TRANSACTIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const getTrxFees = (type, network, address) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/blockchain/get-transaction-fee`, { type, network, address }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_TRX_FEES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const postTrxTransaction = (type, network, address, amount, transaction_pin) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/blockchain/post-transaction`, { type, network, address, amount, transaction_pin }, tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: POST_TRX,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// GET USD
export const getUsdTransactions = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/usd/get-transactions`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_USD_TRANSACTIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// DEPOSIT USD
export const depositUsdFromNgnWallet = (amount) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/usd/swap-ngn-to-usd`, { amount }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DEPOSIT_USD,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// WITHDRAW USD
export const withdrawFromUsdWallet =
  (destination, priority, amount, beneficiary_account_name, beneficiary_bank_name, beneficiary_account_number, transaction_pin) => (dispatch, getState) => {
    axios
      .post(
        `${BASE_URL}/api/usd/usd-withdraw`,
        {
          destination,
          priority,
          amount,
          beneficiary_account_name,
          beneficiary_bank_name,
          beneficiary_account_number,
          transaction_pin,
        },
        tokenConfig(getState)
      )
      .then((res) => {
        dispatch({
          type: WITHDRAW_USD,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

// SWAP USD
export const swapUsdForUsdt = (amount, transaction_pin) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/usd/swap-usd-to-usdt`, { amount, transaction_pin }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USD_USDT_SWAP,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
