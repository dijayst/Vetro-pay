import { VERIFY_BUSINESS_UID, MOBILE_BUSINESS_LINK } from "../rootAction/types";

const initialState = {
  verify: [],
  linkup: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VERIFY_BUSINESS_UID:
      return {
        ...state,
        verify: [...state.verify, action.payload],
      };
    case MOBILE_BUSINESS_LINK:
      return {
        ...state,
        linkup: [...state.linkup, action.payload],
      };
    default:
      return state;
  }
}
