import axios from "axios";
import { tokenConfig } from "../authentication/action";
import { GET_BUSINESS_NOTIFICATIONS } from "../rootAction/types";
import { returnErrors } from "../messages/messages";
import { BASE_URL } from "../rootAction/env";

// GET NOTIFICATIONS SENT FROM BUSINESSES
export const getBusinessNotifications = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/notifications-all`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_BUSINESS_NOTIFICATIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// GET NOTIFICATIONS SENT FROM BUSINESSES
export const setRecentNotificationsAsRead = () => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/notifications-all`, {}, tokenConfig(getState))
    .then((res) => {
      //
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
