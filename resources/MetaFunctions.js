export const convertUTCDateToLocalDate = (date) => {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
};

export const numberWithCommas = (x) => {
  x = Number(x).toFixed(2);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const shortenNames = (text, max) => {
  return text && text.length > max ? text.slice(0, max).split(" ").slice(0, -1).join(" ") : text;
};

export const convertEpochToLocalDate = (time) => {
  return `${new Date(time).toDateString().substr(4)} ${new Date(time).toLocaleTimeString().substr(0, 5)}`;
};

/* An example function to generate a random transaction reference */
export const generateTransactionRef = (length) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `flw_tx_ref_${result}`;
};
