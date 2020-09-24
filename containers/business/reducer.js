import { VERIFY_BUSINESS_UID, MOBILE_BUSINESS_LINK, MARKETPLACE_BUSINESS, MARKETPLACE_PAY_BUSINESS } from "../rootAction/types";

const initialState = {
  verify: [],
  linkup: [],
  marketbus: [],
  marketpay: [],
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
    case MARKETPLACE_BUSINESS:
      return {
        ...state,
        marketbus: action.payload,
      };
    case MARKETPLACE_PAY_BUSINESS:
      return {
        ...state,
        marketpay: [...state.marketpay, action.payload],
      };
    default:
      return state;
  }
}
