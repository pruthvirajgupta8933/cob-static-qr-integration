import moment from "moment";

export const durationFilter = ({ fromDate, toDate }) => {
    const start = moment(fromDate, "YYYY-MM-DD");
    const end = moment(toDate, "YYYY-MM-DD");
    const daysDiff = end.diff(start, "days");
    // console.log("daysDiff ", daysDiff);

    let options = [];
    if (daysDiff === 0) {
        options = ["hourly"];
    } else if (daysDiff > 0 && daysDiff < 7) {
        options = ["daily", "hourly"];
    } else if (daysDiff >= 7 && daysDiff <= 60) {
        options = ["weekly", "daily"];
    } else if (daysDiff > 60 && daysDiff <= 366) {
        options = ["monthly", "weekly"];
    } else options = ["annually", "monthly"];


    return options;
}