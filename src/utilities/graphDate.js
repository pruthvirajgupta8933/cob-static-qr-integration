export const graphDate = (data) => {
    function getDatesInMonth(year, month) {
        const dates = [];
        const date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return dates;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function addMissingDates(data) {
        if (data.length === 0) return data;

        // Get the month and year from the first date
        const firstDate = new Date(data[0].txnDate);
        const year = firstDate.getFullYear();
        const month = firstDate.getMonth();

        // Get all dates in the current month
        const allDates = getDatesInMonth(year, month).map(date => formatDate(date));

        // Convert existing data to a map for quick lookup
        const existingDatesMap = new Map(data.map(item => [item.txnDate, item]));

        // Add missing dates to the map
        allDates.forEach((date, i) => {
            if (!existingDatesMap.has(date)) {
                existingDatesMap.set(date, {
                    txnDate: date,
                    txnNo: "0", // or any default value
                    tsr: "0.00", // or any default value
                    id: i + 1 // you might want to adjust the id assignment logic
                });
            }
        });

        // Convert the map back to an array and sort by date
        const result = Array.from(existingDatesMap.values()).sort((a, b) => new Date(a.txnDate) - new Date(b.txnDate));

        return result;
    }

    const updatedData = addMissingDates(data);
    // console.log(updatedData);

    return updatedData

}