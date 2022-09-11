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
