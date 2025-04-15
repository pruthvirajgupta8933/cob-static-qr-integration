import moment from "moment";

const DateFormatter = (date, time = true) => {
  if (!date) {
    return null;
  }

  let DateFormat = "YYYY-MM-DD";
  if (time) {
    DateFormat = "YYYY-MM-DD HH:mm:ss";
  }

  const formattedDate = moment(date).format(DateFormat).toUpperCase();
  return <span>{formattedDate}</span>;
};

export const DateFormatAlphaNumeric = (date, time = true) => {
  if (!date) {
    return null;
  }

  let DateFormat = "ll";
  if (time) {
    DateFormat = "lll";
  }

  const formattedDate = moment(date).format(DateFormat);
  return <span>{formattedDate}</span>;
}

export const dateFormatBasic = (dateVal) => {
  if (!dateVal) return dateVal; // Handle null/undefined

  const dateStr = dateVal instanceof Date ? dateVal.toISOString() : dateVal; // Convert Date to string

  if (!dateStr.includes("T")) return dateStr;
  if (!dateStr.includes("Z")) return DateFormatter(dateStr);

  let date;
  if (dateStr === "NA") {
    date = "N/A";
  } else {
    const sdate = new Date(dateStr);
    const day = String(sdate.getUTCDate()).padStart(2, "0");
    const month = String(sdate.getUTCMonth() + 1).padStart(2, "0");
    const year = sdate.getUTCFullYear();

    const hours = String(sdate.getUTCHours()).padStart(2, "0");
    const minutes = String(sdate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(sdate.getUTCSeconds()).padStart(2, "0");

    date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return date;
};


export default DateFormatter;
