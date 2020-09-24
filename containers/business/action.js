import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { VERIFY_BUSINESS_UID, MOBILE_BUSINESS_LINK, MARKETPLACE_BUSINESS, MARKETPLACE_PAY_BUSINESS } from "../rootAction/types";
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

//GET MARKETPLACE BUSINESS
export const getMarketplaceBusiness = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/marketplace/billers`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: MARKETPLACE_BUSINESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

//POST PAYMENT TO MARKETPLACE BUSINESS
export const postPaymentMarketplaceBusiness = (merchantId, merchantName, billerId, amount, reference, billerJsonInfo, transactionPin) => (dispatch, getState) => {
  axios
    .post(
      `${BASE_URL}/api/marketplace-pay`,
      {
        merchant_id: merchantId,
        merchant_name: merchantName,
        biller_id: billerId,
        amount: amount,
        reference: reference,
        biller_json_data: billerJsonInfo,
        transaction_pin: transactionPin,
      },
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: MARKETPLACE_PAY_BUSINESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
