import moment from 'moment';

const timeFormat = 'D/M/YYYY';

export const getxycoordinates = data => {
    const dates = Object.keys(data);
    const dateObjs = dates.map(d => moment(d, timeFormat));
    const dateObjsSorted = dateObjs.sort((a, b) => a - b);
    const datesSorted = dateObjsSorted.map(d => d.format(timeFormat));
    let score = 0;
    const coodinates = datesSorted.map(d => {
        score += data[d];
        return {
            x: d,
            y: score
        };
    });
    return coodinates;
};
