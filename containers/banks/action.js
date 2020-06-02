import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { GET_BANK, RESOLVE_BANK, UPDATE_BANK, WITHDRAW_TO_BANK } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// GET USER BANK
export const getBank = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/user/getbank`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_BANK,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// RESOLVE BANK
export const resolveBank = (bankName, bankAccount) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/user/validatebank`, { bankName: bankName, bankAccount: bankAccount, customerName: "" }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: RESOLVE_BANK,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// UPDATE BANK
export const updateBank = (bankName, bankAccount, customerName) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/user/updatebank`, { bankName: bankName, bankAccount: bankAccount, customerName: customerName }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: UPDATE_BANK,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// WITHDRAW TO BANK
export const userBankWithdraw = (amount) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/user/bankwithdrawal`, { amount: amount }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: WITHDRAW_TO_BANK,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
