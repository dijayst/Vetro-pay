import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { GET_LOAN_HISTORY, MAKE_LOAN_REPAYMENT, REQUEST_LOAN, VERIFY_EMPLOYMENT } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// GET USER LOAN HISTORY
export const getUserLoanHistory = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/loans/history`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_LOAN_HISTORY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// USER REQUEST NEW LOAN
export const requestNewLoan = (amount, duration) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/loans/new-request`, { amount, duration }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: REQUEST_LOAN,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// USER UPDATE LOAN REQUISITE
export const updateEmploymentDetails = (employer, bank_code, account_no) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/loans/verify-employment`, { employer, bank_code, account_no }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: VERIFY_EMPLOYMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// LOAN REPAYMENT
export const makeLoanRepayment = (amount, loan_id) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/loans/make-payment`, { amount, loan_id }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: MAKE_LOAN_REPAYMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
