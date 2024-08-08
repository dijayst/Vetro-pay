import React, { useEffect, useRef } from "react";
import { Dimensions, PixelRatio } from "react-native";
//export const ONE_BTC_TO_SATS = 100_000_000;
export const ONE_BTC_TO_SATS = 100000000;
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const numberWithCommas = (value) => {
  try {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch {
    return "";
  }
};

export const customTrxWithCommas = (value) => {
  try {
    let splitted = value.split(".");
    return `${splitted[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${
      splitted[1]
    }`;
  } catch {
    return "";
  }
};

export const calculateBandwithOrEnergy = (object, type) => {
  try {
    // (freeNetLimit - freeNetUsed) + (NetLimit - NetUsed)
    let available =
      object.freeNetLimit -
      (object.freeNetUsed || 0) +
      ((object.NetLimit || 0) - (object.NetUsed || 0));
    let total = object.freeNetLimit + (object.NetLimit || 0);
    return {
      available,
      total,
    };
  } catch {
    return {
      available: 0,
      total: 0,
    };
  }
};

export function normalizeFontSize(size) {
  // Base dimensions for 5.5 to 6 inches, 1080p resolution
  const BASE_WIDTH = 375;
  const BASE_HEIGHT = 812;

  const scale = SCREEN_WIDTH / BASE_WIDTH;

  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const nigeriaBanks = [
  { bankCode: "000", bankName: "VetroPay Africa" },
  { bankCode: "120001", bankName: "9mobile 9Payment Service Bank" },
  { bankCode: "044", bankName: "Access Bank" },
  { bankCode: "063", bankName: "Access Bank Diamond" },
  { bankCode: "120004", bankName: "Airtel Smartcash PSB" },
  { bankCode: "035A", bankName: "ALAT by WEMA" },
  { bankCode: "401", bankName: "ASO Savings and Loans" },
  { bankCode: "565", bankName: "Carbon Microfinance Bank" },
  { bankCode: "50171", bankName: "Chanelle Microfinance Bank" },
  { bankCode: "50823", bankName: "CEMCS Microfinance Bank" },
  { bankCode: "023", bankName: "Citibank Nigeria" },
  { bankCode: "050", bankName: "Ecobank Nigeria" },
  { bankCode: "562", bankName: "Ekondo MicroFinance Bank" },
  { bankCode: "50126", bankName: "Eyowo MFB" },
  { bankCode: "51318", bankName: "Fairmoney Microfinance Bank" },
  { bankCode: "070", bankName: "Fidelity Bank" },
  { bankCode: "011", bankName: "First Bank of Nigeria" },
  { bankCode: "214", bankName: "First City Monument Bank" },
  { bankCode: "00103", bankName: "Globus Bank" },
  { bankCode: "058", bankName: "Guaranty Trust Bank" },
  { bankCode: "50383", bankName: "Hasal Microfinance Bank" },
  { bankCode: "030", bankName: "Heritage Bank" },
  { bankCode: "301", bankName: "Jaiz Bank" },
  { bankCode: "082", bankName: "Keystone Bank" },
  { bankCode: "50211", bankName: "Kuda Bank" },
  { bankCode: "120003", bankName: "MTN Momo PSB" },
  { bankCode: "100002", bankName: "Paga" },
  { bankCode: "999991", bankName: "PalmPay" },
  { bankCode: "999992", bankName: "Paycom" },
  { bankCode: "526", bankName: "Parallex Bank" },
  { bankCode: "076", bankName: "Polaris Bank" },
  { bankCode: "101", bankName: "Providus Bank" },
  { bankCode: "125", bankName: "Rubies MFB" },
  { bankCode: "51310", bankName: "Sparkle Microfinance Bank" },
  { bankCode: "221", bankName: "Stanbic IBTC Bank" },
  { bankCode: "068", bankName: "Standard Chartered Bank" },
  { bankCode: "232", bankName: "Sterling Bank" },
  { bankCode: "100", bankName: "Suntrust Bank" },
  { bankCode: "302", bankName: "TAJ Bank" },
  { bankCode: "51211", bankName: "TCF MFB" },
  { bankCode: "102", bankName: "Titan Bank" },
  { bankCode: "51316", bankName: "Unilag Microfinance Bank" },
  { bankCode: "032", bankName: "Union Bank of Nigeria" },
  { bankCode: "033", bankName: "United Bank For Africa" },
  { bankCode: "215", bankName: "Unity Bank" },
  { bankCode: "566", bankName: "VFD" },
  { bankCode: "035", bankName: "Wema Bank" },
  { bankCode: "057", bankName: "Zenith Bank" },
];

export const onboarding = [
  {
    id: "1",
    title: "Mobile Banking Account for your Everyday use",
    description:
      "Experience the freedom of banking whenever and wherever you need it, empowering you to take control of your financial well-being with ease",
    image: require("../../assets/onboarding1.png"),
  },
  {
    id: "2",
    title: "⁠Explore the experience of Payday Loans",
    description:
      "Experience the ease and convenience of accessing immediate financial assistance with our payday loans",
    image: require("../../assets/onboarding2.png"),
  },
  {
    id: "3",
    title: "⁠Savings, Bill payments & Expense Management ",
    description:
      "Effortlessly handle all aspects of your finances in one place. From building savings and staying ahead on bills to monitoring expenses.",
    image: require("../../assets/onboarding3.png"),
  },
  {
    id: "4",
    title: "Unprecedented Cashback Offers",
    description:
      "Get rewarded for your everyday purchases in ways you never imagined, making every transaction more rewarding than ever before.",
    image: require("../../assets/onboarding4.png"),
  },
  {
    id: "5",
    title: "⁠Get Virtual Credit cards & Physical ATM cards",
    description:
      "Enjoy seamless flexibility in managing your finances, whether you're shopping online or in-store, ensure you're always equipped with the right solution",
    image: require("../../assets/onboarding5.png"),
  },
  {
    id: "6",
    title: "Send, Receive & Exchange Digital Currencies",
    description:
      "Our platform empowers you to navigate the world of cryptocurrencies, enabling you to securely send, receive, and exchange digital assets with ease.",
    image: require("../../assets/onboarding6.png"),
  },
];
