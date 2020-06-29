import React from 'react';
import Alert from './Alert';
import { useSelector } from 'react-redux';
import './Alert.css';

const Alerts = () => {
    const alerts = useSelector(state => state.alerts);
    return (
        <div className='alert-container'>
            {alerts.map(alert => (
                <Alert key={alert.id} type={alert.type} text={alert.text} />
            ))}
        </div>
    );
};

export default Alerts;
