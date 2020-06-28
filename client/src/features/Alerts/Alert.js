import React from 'react';
import PropTypes from 'prop-types';

const Alert = props => {
    return <div className={`alert alert-${props.type}`}>{props.text}</div>;
};

Alert.propTypes = {
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};
export default Alert;
