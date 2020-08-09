import React, { Fragment, useState, useRef } from 'react';

import { submitFeedback } from '../../api/general';
import Button from '../Button';

const Form = ({ close }) => {
    const [submitted, setSubmitted] = useState(false);
    const formData = useRef({ email: '', suggestions: '', ui: 3, score: 3, contribution: 3 });

    const changeRangeValue = e => {
        const input = e.target.closest('.footer-form__slider');
        for (let i = 1; i <= 5; i++) input.classList.remove(`footer-form__slider--${i}`);
        input.classList.add(`footer-form__slider--${e.target.value}`);

        formData.current[e.target.name] = e.target.value;
    };

    const onChange = e => (formData.current[e.target.name] = e.target.value);

    const submit = async () => {
        setSubmitted(true);

        try {
            await submitFeedback(formData.current);
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className='overlay'>
            <a href='#!' className='overlay__close' onClick={close}>
                <i className='fas fa-times'></i>
            </a>
            <div className='overlay__container'>
                {submitted ? (
                    <div className='u-center-text u-margin-top-medium'>
                        <h2>Thanks for giving us a feedback.</h2>
                        <Button full text='Close' onClick={close} />
                    </div>
                ) : (
                    <Fragment>
                        <h2 className='u-center-text u-margin-top-medium'>Feedback Form</h2>
                        <form action='#!' className='footer-form' onSubmit={submit}>
                            <label className='footer-form__component'>
                                <span>Email (only if you expect reply):</span>
                                <input
                                    type='email'
                                    className='input footer-form__answer footer-form__input'
                                    onChange={onChange}
                                    name='email'
                                />
                            </label>
                            <div className='footer-form__component'>
                                <span>Look & Feel:</span>
                                <div className='footer-form__answer footer-form__slider footer-form__slider--3'>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <input
                                        type='range'
                                        min='1'
                                        max='5'
                                        defaultValue='3'
                                        onChange={changeRangeValue}
                                        name='ui'
                                    />
                                </div>
                            </div>
                            <div className='footer-form__component'>
                                <span>Score Distribution:</span>
                                <div className='footer-form__answer footer-form__slider footer-form__slider--3'>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <input
                                        type='range'
                                        min='1'
                                        max='5'
                                        defaultValue='3'
                                        onChange={changeRangeValue}
                                        name='score'
                                    />
                                </div>
                            </div>
                            <div className='footer-form__component'>
                                <span>Contribution Distribution:</span>
                                <div className='footer-form__answer footer-form__slider footer-form__slider--3'>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <span className='footer-form__slider-dots'></span>
                                    <input
                                        type='range'
                                        min='1'
                                        max='5'
                                        defaultValue='3'
                                        onChange={changeRangeValue}
                                        name='contribution'
                                    />
                                </div>
                            </div>
                            <label className='footer-form__component'>
                                <span>Other Suggestions/Feature Request</span>
                                <textarea
                                    className='input footer-form__answer footer-form__input'
                                    name='suggestions'
                                    onChange={onChange}
                                />
                            </label>
                            <div className='u-center-text'>
                                <Button full value='Submit' />
                            </div>
                        </form>
                    </Fragment>
                )}
            </div>
        </div>
    );
};
export default Form;
