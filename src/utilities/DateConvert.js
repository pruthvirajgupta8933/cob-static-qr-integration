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

export default DateFormatter;
