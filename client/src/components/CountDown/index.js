import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CountDown = ({ till }) => {
    const [time, setTime] = useState(getTimeLeft(till));

    useEffect(() => {
        const timer = () => {
            setTime(getTimeLeft(till));
            setTimeout(() => {
                timer();
            }, 1000);
        };
        timer();
    }, []);

    return (
        <div>
            {time.mins} : {time.secs}
        </div>
    );
};

CountDown.propTypes = {
    till: PropTypes.number.isRequired
};

export default CountDown;
