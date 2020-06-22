import React, { useState } from 'react';

import './style.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const onSubmit = e => {
        e.preventDefault();
        console.log('SUCCESS');
    };

    const { name, email, password, password2 } = formData;
    return (
        <form className='auth-form' onSubmit={onSubmit}>
            <div className='auth-form-group'>
                <label htmlFor='name'>Name</label>
                <input
                    type='text'
                    name='name'
                    placeholder='Name'
                    onChange={onChange}
                    value={name}
                    required
                />
            </div>
            <div className='auth-form-group'>
                <label htmlFor='email'>Email: </label>
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={onChange}
                    value={email}
                    required
                />
            </div>
            <div className='auth-form-group'>
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={onChange}
                    value={password}
                    required
                />
            </div>
            <div className='auth-form-group'>
                <label htmlFor='password2'>Confirm Password</label>
                <input
                    type='password'
                    name='password2'
                    placeholder='Confirm Password'
                    onChange={onChange}
                    value={password2}
                    required
                />
            </div>
            <div className='auth-form-group'>
                <input type='submit' value='Submit' className='btn btn-full' />
            </div>
        </form>
    );
};

export default Register;
