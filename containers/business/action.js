import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { VERIFY_BUSINESS_UID, MOBILE_BUSINESS_LINK } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// VERIFY BUSINESS UID BEFORE REQUESTING CONNECT
export const verifyBusinessUID = (uid) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/verify-business-uid`, { uid: uid }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: VERIFY_BUSINESS_UID,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// LINK MOBILE TO BUSINESS
export const linkMobileBusiness = (uid) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/link-mobile-business`, { uid: uid }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: MOBILE_BUSINESS_LINK,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
