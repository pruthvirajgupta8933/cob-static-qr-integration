import moment from "moment";

const DateFormatter = (date, time = true) => {
  if (!date) {
    return null;
  }

  let DateFormat = "DD/MM/YYYY";
  if (time) {
    DateFormat = "DD/MM/YYYY hh:mm A";
  }

  const formattedDate = moment(date).format(DateFormat).toUpperCase();
  return <span>{formattedDate}</span>;
};


export const dateFormatBasic = (dateVal) => {
  //convert only this format 2024-10-10T12:36:30Z 

  let date;
  if (dateVal === null && isNaN(date)) {
    date = "N/A"
  } else {
    // Extract date components
    const sdate = new Date(dateVal);
    const day = String(sdate?.getUTCDate()).padStart(2, '0');
    const month = String(sdate?.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = sdate?.getUTCFullYear();

    // Extract time components
    const hours = String(sdate?.getUTCHours()).padStart(2, '0');
    const minutes = String(sdate?.getUTCMinutes()).padStart(2, '0');
    const seconds = String(sdate?.getUTCSeconds()).padStart(2, '0');

    // Format the date and time
    date = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  return date;
};


export default DateFormatter;
