import React, { Fragment, useRef, useState } from 'react';
import Button from '../../components/Button';

const TestView = ({ payload }) => {
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
    const [started, setStarted] = useState(false);

    let submitted = Object.keys(result).length ? true : false;

    let score = 0;
    for (const q in result) score += Number(result[q]);
    const scorePercent = (100 * score) / questions.length;

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

    const start = () => {
        setStarted(true);
    };

    return (
        <Fragment>
            <div className='test'>
                <h2 className='test__heading'> {payload.name} </h2>
                <div className='test__content'>
                    <div>
                        <h3 className='test__text--bold'>Submit Assignment</h3>
                        <div className='test__text--small'>
                            <span className='test__text--bold'>ATTEMPTS</span> 3 every 8 hours
                        </div>
                    </div>
                    <div>
                        <Button text='Attempt' full onClick={start}></Button>
                    </div>
                </div>
                <div className='test__content'>
                    <div>
                        <h3 className='test__text--bold'>Recieve grade</h3>
                        <div className='test__text--small'>
                            <span className='test__text--bold'>TO PASS: </span> Score more than or
                            equal to {payload.passScore}%
                        </div>
                    </div>
                    <div className='test__grade'>
                        <div className='u-center-text'>
                            <div className='test__grade--text'>Grade</div>
                            {payload.score}%
                        </div>
                        <Button text='View Feedback'></Button>
                    </div>
                </div>
            </div>

            <div className={'test-view' + (started ? ' test-view__start' : '')}>
                <div className='test-view__bar'>
                    <a href='#!' className='test-view__back-icon'>
                        &larr;
                    </a>
                    Name
                </div>

                {submitted && (
                    <div
                        className={`test-view__score test-view__score--${
                            scorePercent >= payload.passScore
                        }`}>
                        <div className='test-view__content'>
                            <div>
                                <h4 className='test-view__score--result'></h4>
                                <div className='test__text--small'>
                                    <span className='test__text--bold'>TO PASS: </span> Score more
                                    than or equal to {payload.passScore}%
                                </div>
                            </div>
                            <div className='test-view__right'>
                                <Button text='Continue' />
                            </div>
                            <div className='u-center-text test-view__score--grade'>
                                <div className='test__text--bold'>Grade</div>
                                {scorePercent}%
                            </div>
                        </div>
                    </div>
                )}

                <div className='test-view__content'>
                    <h2>Name</h2>
                    <ol className='test-view__question-list'>
                        {questions.map((q, i) => (
                            <li
                                className={
                                    'test-view__question' +
                                    (submitted ? ` test-view__question--${result[`q${i}`]}` : '')
                                }
                                key={i}>
                                <p>{q.question}</p>
                                {q.options ? (
                                    q.options.map((option, j) => (
                                        <label key={j} className='test-view__label'>
                                            <input
                                                type={q.kind === 'smcq' ? 'radio' : 'checkbox'}
                                                className='test-view__input'
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
                                        className='test-view__input--text'
                                        name={`q${i}`}
                                        onChange={handleChange}
                                        disabled={submitted}
                                    />
                                )}
                            </li>
                        ))}
                    </ol>

                    {!submitted && (
                        <div className='test-view__submit'>
                            <Button text='Submit' onClick={submit} />
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default TestView;
