import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { CHANGE_PASSWORD, CHANGE_PIN } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// CHANGE PASSWORD
export const changePassword = (currentPassword, newPassword, confirmPassword) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/auth/changepassword`,
      {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: CHANGE_PASSWORD,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// CHANGE PIN
export const changeTransactionPin = (currentPin, newPin, confirmPin, currentPassword, otp, otpDevice) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/auth/changepin`,
      {
        current_pin: currentPin,
        new_pin: newPin,
        confirm_pin: confirmPin,
        current_password: currentPassword,
        auth_type: otpDevice.includes("@") ? "email" : "sms",
        auth_code: otp,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: CHANGE_PIN,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
