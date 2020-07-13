import React, { useState, useRef } from 'react';

import Button from '../../components/Button';

const Test = ({ payload }) => {
    // temp variables start
    const questions = [
        {
            kind: 'smcq',
            question:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat unde officia assumenda expedita eius necessitatibus dolores autem maxime similique reprehenderit deleniti odit quis atque ipsam, ab qui. Blanditiis, dolore quidem.',
            options: ['hi', 'hello', 'welcome'],
            answer: 2
        },
        {
            kind: 'mmcq',
            question:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat unde officia assumenda expedita eius necessitatibus dolores autem maxime similique reprehenderit deleniti odit quis atque ipsam, ab qui. Blanditiis, dolore quidem.',
            options: ['hi', 'hello', 'welcome'],
            answers: [1, 3]
        },
        {
            kind: 'short',
            question:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat unde officia assumenda expedita eius necessitatibus dolores autem maxime similique reprehenderit deleniti odit quis atque ipsam, ab qui. Blanditiis, dolore quidem.',
            answer: 'Hello'
        },
        {
            kind: 'numerical',
            question:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat unde officia assumenda expedita eius necessitatibus dolores autem maxime similique reprehenderit deleniti odit quis atque ipsam, ab qui. Blanditiis, dolore quidem.',
            answer: { from: 4.3, to: 4.7 }
        }
    ];

    payload.passScore = 10;
    // temp variables end

    const answers = useRef({});
    const [result, setResult] = useState({});

    let score = 0;
    for (const q in result) score += Number(result[q]);
    const scorePercent = (100 * score) / questions.length;

    let submitted = Object.keys(result).length ? true : false;

    const handleChange = e => {
        e = e.target;
        if (e.type !== 'checkbox') {
            answers.current[e.name] = e.value;
        } else {
            answers.current[e.name] = answers.current[e.name] || [];

            const index = answers.current[e.name].indexOf(e.value);

            if (index === -1) {
                answers.current[e.name].push(e.value);
            } else {
                answers.current[e.name].splice(index, 1);
            }
        }
    };

    const submit = () => {
        let tempResult = {};

        questions.forEach((q, i) => {
            if (q.kind === 'smcq') {
                tempResult[`q${i}`] = answers.current[`q${i}`] === q.options[q.answer - 1];
            } else if (q.kind === 'mmcq') {
                const correct = [];
                q.answers.forEach(i => correct.push(q.options[i - 1]));

                correct.sort();
                (answers.current[`q${i}`] || []).sort();

                tempResult[`q${i}`] =
                    JSON.stringify(answers.current[`q${i}`]) === JSON.stringify(correct);
            } else if (q.kind === 'short') {
                tempResult[`q${i}`] =
                    (answers.current[`q${i}`] || '').toLowerCase() === q.answer.toLowerCase();
            } else {
                tempResult[`q${i}`] =
                    Number(answers.current[`q${i}`]) >= q.answer.from &&
                    Number(answers.current[`q${i}`]) <= q.answer.to;
            }
        });

        setResult(tempResult);
    };

    return (
        <div className='test'>
            <div className='test__bar'>
                <a href='#!' className='test__back-icon'>
                    &larr;
                </a>
                Name
            </div>

            {submitted && (
                <div className={`test__score test__score--${scorePercent >= payload.passScore}`}>
                    <div className='test__content'>
                        <div>
                            <h4 className='test__score--result'>&nbsp;</h4>
                            <div className='test__text--small'>
                                <span className='test__text--bold'>TO PASS: </span> Score more than
                                or equal to {payload.passScore}%
                            </div>
                        </div>
                        <div className='test__right'>
                            <Button text='Continue' />
                        </div>
                        <div className='u-center-text test__score--grade'>
                            <div className='test__text--bold'>Grade</div>
                            {scorePercent}%
                        </div>
                    </div>
                </div>
            )}

            <div className='test__content'>
                <h2>Name</h2>
                <ol className='test__question-list'>
                    {questions.map((q, i) => (
                        <li
                            className={
                                'test__question' +
                                (submitted ? ` test__question--${result[`q${i}`]}` : '')
                            }
                            key={i}>
                            <p>{q.question}</p>
                            {q.options ? (
                                q.options.map((option, j) => (
                                    <label key={j} className='test__label'>
                                        <input
                                            type={q.kind === 'smcq' ? 'radio' : 'checkbox'}
                                            className='test__input'
                                            name={`q${i}`}
                                            value={option}
                                            onChange={handleChange}
                                            disabled={submitted}
                                        />
                                        {option}
                                    </label>
                                ))
                            ) : (
                                <input
                                    type='text'
                                    className='test__input--text'
                                    name={`q${i}`}
                                    onChange={handleChange}
                                    disabled={submitted}
                                    placeholder='Type your answer here'
                                />
                            )}
                        </li>
                    ))}
                </ol>

                {!submitted && (
                    <div className='test__submit'>
                        <Button text='Submit' onClick={submit} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test;
