import React, { useEffect, useRef } from "react";

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
    return `${splitted[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${splitted[1]}`;
  } catch {
    return "";
  }
};

export const calculateBandwithOrEnergy = (object, type) => {
  try {
    // (freeNetLimit - freeNetUsed) + (NetLimit - NetUsed)
    let available = object.freeNetLimit - (object.freeNetUsed || 0) + ((object.NetLimit || 0) - (object.NetUsed || 0));
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

export const nigeriaBanks = [
  { bankCode: "000", bankName: "VetroPay Africa" },
  { bankCode: "044", bankName: "Access Bank" },
  { bankCode: "063", bankName: "Access Bank Diamond" },
  { bankCode: "035A", bankName: "ALAT by WEMA" },
  { bankCode: "401", bankName: "ASO Savings and Loans" },
  { bankCode: "50823", bankName: "CEMCS Microfinance Bank" },
  { bankCode: "023", bankName: "Citibank Nigeria" },
  { bankCode: "050", bankName: "Ecobank Nigeria" },
  { bankCode: "562", bankName: "Ekondo MicroFinance Bank" },
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
  { bankCode: "526", bankName: "Parallex Bank" },
  { bankCode: "076", bankName: "Polaris Bank" },
  { bankCode: "101", bankName: "Providus Bank" },
  { bankCode: "125", bankName: "Rubies MFB" },
  { bankCode: "51310", bankName: "Sparkle Microfinance Bank" },
  { bankCode: "221", bankName: "Stanbic IBTC Bank" },
  { bankCode: "232", bankName: "Sterling Bank" },
  { bankCode: "100", bankName: "Suntrust Bank" },
  { bankCode: "302", bankName: "TAJ Bank" },
  { bankCode: "51211", bankName: "TCF MFB" },
  { bankCode: "102", bankName: "Titan Bank" },
  { bankCode: "032", bankName: "Union Bank of Nigeria" },
  { bankCode: "033", bankName: "United Bank For Africa" },
  { bankCode: "215", bankName: "Unity Bank" },
  { bankCode: "566", bankName: "VFD" },
  { bankCode: "035", bankName: "Wema Bank" },
  { bankCode: "057", bankName: "Zenith Bank" },
];
