import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { BUY_UTILITY, GET_BOUQUETS_ADDONS, GET_TV_BOUQUETS, GET_CUSTOMER_NAME, ELECTRICITY_VALIDATE, GET_DATA_BUNDLES } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// BUY AIRTIME
export const buyUtility = (transactionPin, transactionDetails, amount) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/utility/makepurchase`, { transaction_pin: transactionPin, transaction_details: transactionDetails, amount: amount }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: BUY_UTILITY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// GET DATA BUNDLES
export const getDataBundleSubscription = (serviceType) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/utility/data-bundles`, { provider: serviceType }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_DATA_BUNDLES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// GET TV BOUQUETS
export const getTvBouquets = (serviceType) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/utility/tv-bouquets`, { service_type: serviceType }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_TV_BOUQUETS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// GET BOUQUET ADDONS
export const getTvBouquetsAddons = (serviceType, productCode) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/utility/tv-bouquets-addons`, { service_type: serviceType, product_code: productCode }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_BOUQUETS_ADDONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// GET CUSTOMER NAME
export const getCustomer = (serviceType, accountNumber) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/utility/tv-verify-customer`, { service_type: serviceType, account_number: accountNumber }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_CUSTOMER_NAME,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const validateElectricityData = (provider, product, accountNumber, amount) => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/utility/electricity-validate`, { provider: provider, product: product, account_number: accountNumber, amount: amount }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ELECTRICITY_VALIDATE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
