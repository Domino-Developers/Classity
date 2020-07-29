import React, { useState, useRef } from 'react';

import Button from '../../components/Button';

import { addScore } from '../User/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Test = ({ test, pastScore, resDoneSize, totResSize }) => {
    const { questions, passScore, _id: id, courseId, topicId, resId } = test;
    const answers = useRef({});
    const [result, setResult] = useState({});
    const dispatch = useDispatch();
    const submitLoading = useSelector(state => state.user.resourceLoading);

    let score = 0;
    for (const q in result) score += Number(result[q]);
    const scorePercent = (100 * score) / questions.length;

    let submitted = Object.keys(result).length ? true : false;
    submitted = submitted && !submitLoading;

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
                tempResult[`q${i}`] = answers.current[`q${i}`] === q.options[q.answer];
            } else if (q.kind === 'mmcq') {
                const correct = [];
                q.answers.forEach(i => correct.push(q.options[i]));

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

        let scoreSubmit = 0;
        for (const q in tempResult) scoreSubmit += Number(tempResult[q]);
        const percentScored = (100 * scoreSubmit) / questions.length;
        const scoreChange = Math.max(scoreSubmit - (pastScore || 0), 0);
        const passed = percentScored >= passScore;
        dispatch(
            addScore(
                id,
                scoreChange,
                courseId,
                topicId,
                resId,
                passed,
                resDoneSize + passed === totResSize
            )
        );
        setResult(tempResult);
    };

    return (
        <div className='test'>
            <div className='test__bar'>{test.name}</div>

            {submitted && (
                <div className={`test__score test__score--${scorePercent >= passScore}`}>
                    <div className='test__content'>
                        <div>
                            <h4 className='test__score--result'>&nbsp;</h4>
                            <div className='test__text--small'>
                                <span className='test__text--bold'>TO PASS: </span> Score more than
                                or equal to {passScore}%
                            </div>
                        </div>
                        <div className='test__right'>
                            <Button text='Continue' to={`/course/${courseId}/topic/${topicId}`} />
                        </div>
                        <div className='u-center-text test__score--grade'>
                            <div className='test__text--bold'>Grade</div>
                            {scorePercent}%
                        </div>
                    </div>
                </div>
            )}

            <div className='test__content'>
                <h2>{test.name}</h2>
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
                                    className='test__input--text input'
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
                        <Button
                            text='Submit'
                            onClick={submit}
                            loading={submitLoading && 'Submiting'}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test;
