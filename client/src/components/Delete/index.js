import React from 'react';

import './Delete.css';

const Delete = props => <i className='fas fa-minus delete-btn' onClick={props.onDelete}></i>;

export default Delete;
