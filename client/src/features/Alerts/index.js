import React from 'react';
import Alert from './Alert';
import { useSelector } from 'react-redux';

const Alerts = () => {
    const alerts = useSelector(state => state.alerts);
    return (
        <div className='alerts'>
            {alerts.map(alert => (
                <Alert key={alert.id} type={alert.type} text={alert.text} />
            ))}
        </div>
    );
};

export default Alerts;
