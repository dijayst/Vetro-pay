import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { CREATE_SAVINGS_PLAN, GET_SAVINGS_DATA, WITHDRAW_SAVINGS } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// GET USER SAVINGS DATA
export const getSavingsData = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/savings/brief`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_SAVINGS_DATA,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// CREATE NEW SAVINGS PLAN
export const createNewSavingsPlan = (title, amount, savingsType, tenure) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/savings/create`,
      {
        title: title,
        amount: amount,
        savings_type: savingsType,
        duration: tenure,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: CREATE_SAVINGS_PLAN,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// PROMPT EARLY WITHDRAWAL
export const promptEarlyWithdrawal = (planId) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/savings/withdraw`,
      {
        savings_id: planId,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: WITHDRAW_SAVINGS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
