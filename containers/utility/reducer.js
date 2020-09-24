import { BUY_UTILITY, GET_TV_BOUQUETS, GET_BOUQUETS_ADDONS, GET_CUSTOMER_NAME, ELECTRICITY_VALIDATE } from "../rootAction/types";

const initialState = {
  buyutility: [],
  tvbouquets: [],
  tvaddons: [],
  tvcustomer: [],
  electricityvalidate: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case BUY_UTILITY:
      return {
        ...state,
        buyutility: [...state.buyutility, action.payload],
      };
    case GET_TV_BOUQUETS:
      return {
        ...state,
        tvbouquets: [...state.tvbouquets, action.payload],
      };
    case GET_BOUQUETS_ADDONS:
      return {
        ...state,
        tvaddons: [...state.tvaddons, action.payload],
      };
    case GET_CUSTOMER_NAME:
      return {
        ...state,
        tvcustomer: [...state.tvcustomer, action.payload],
      };
    case ELECTRICITY_VALIDATE:
      return {
        ...state,
        electricityvalidate: [...state.electricityvalidate, action.payload],
      };
    default:
      return state;
  }
}
