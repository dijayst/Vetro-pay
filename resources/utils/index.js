import React, { useEffect, useRef } from "react";

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const numberWithCommas = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
