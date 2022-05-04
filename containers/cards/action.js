import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { GET_CARDS } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// GET USER BANK
export const getCards = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/debit-cards`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_CARDS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
