const getDateString = () => {
    const dateObj = new Date();
    const date = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear();
    return date + '/' + month + '/' + year;
};

module.exports = getDateString;
