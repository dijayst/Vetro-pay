import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { CARD_DEPOSIT } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// CHANGE PASSWORD
export const cardDeposit = (txRef, transactionId, phoneNumber) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/card-deposit`,
      {
        phone_number: phoneNumber,
        transaction_id: transactionId,
        transaction_ref: txRef,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: CARD_DEPOSIT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
