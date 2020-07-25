import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Loading from '../Loading';

const Button = props => {
    const { full, text, onClick, to, loading, value, className } = props;
    return loading ? (
        <div
            className={
                'btn btn--disabled ' +
                (full ? 'btn--full ' : 'btn--ghost ') +
                (className ? className : '')
            }>
            <div className='btn__show'>
                <span className='text'>{loading}</span>
                <Loading size='2' className='u-margin-left-small' white={full} />
            </div>
            <span className='btn__hide'>{text || value}</span>
        </div>
    ) : value ? (
        <input
            type='submit'
            value={value}
            className={'btn btn--full ' + (className ? className : '')}
        />
    ) : to ? (
        <Link
            className={(full ? 'btn btn--full ' : 'btn btn--ghost ') + (className ? className : '')}
            to={to}>
            {text}
        </Link>
    ) : (
        <button
            className={(full ? 'btn btn--full ' : 'btn btn--ghost ') + (className ? className : '')}
            onClick={onClick}>
            {text}
        </button>
    );
};

Button.propTypes = {
    full: PropTypes.bool,
    text: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    to: PropTypes.string,
    value: PropTypes.string,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default Button;
