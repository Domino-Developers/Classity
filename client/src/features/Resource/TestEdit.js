import React, { useState, Fragment } from 'react';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import AddNew from '../../components/AddNew';
import Editable from '../../components/Editable';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import testApi from '../../api/test';
import { setAlert } from '../Alerts/alertSlice';

const TestEdit = ({ payload }) => {
    const dispatch = useDispatch();

    const { data: test } = useSWR(`get-test-${payload.testId}`, () => testApi.get(payload.testId));

    const [questions, setQuestions] = useState();
    const [passScore, setPassScore] = useState();

    const [isSaving, setSave] = useState(false);

    const save = async () => {
        try {
            setSave(true);
            await testApi.update(payload.testId, { ...test, questions, passScore });
            setSave(false);
            dispatch(setAlert('Test Saved Successfully', 'success'));
        } catch (err) {
            if (err.errors) {
                const errors = err.errors;
                errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
            }
            setSave(false);
        }
    };

    const cancel = () => {
        window.location.reload(false);
    };

    if (!test) return <Loading />;
    if (!questions) setQuestions([...test.questions]);
    if (!passScore) setPassScore(test.passScore);
    if (!questions) return <Loading />;

    const deleteOption = (que, opt) =>
        setQuestions(
            questions.map((q, k) =>
                que !== k
                    ? q
                    : { ...q, options: [...q.options.slice(0, opt), ...q.options.slice(opt + 1)] }
            )
        );

    const NewQuestion = ({ index: i }) => (
        <AddNew className='test-edit__question--new'>
            <span
                onAdd={() => {
                    setQuestions([
                        ...questions.slice(0, i + 1),
                        { kind: 'smcq', question: 'question', options: [] },
                        ...questions.slice(i + 1)
                    ]);
                }}>
                Single correct
            </span>
            <span
                onAdd={() => {
                    setQuestions([
                        ...questions.slice(0, i + 1),
                        {
                            kind: 'mmcq',
                            question: 'question',
                            options: [],
                            answers: []
                        },
                        ...questions.slice(i + 1)
                    ]);
                }}>
                Multi correct
            </span>
            <span
                onAdd={() => {
                    setQuestions([
                        ...questions.slice(0, i + 1),
                        { kind: 'short', question: 'question' },
                        ...questions.slice(i + 1)
                    ]);
                }}>
                Short answer
            </span>
            <span
                onAdd={() => {
                    setQuestions([
                        ...questions.slice(0, i + 1),
                        {
                            kind: 'numerical',
                            question: 'question',
                            answer: {}
                        },
                        ...questions.slice(i + 1)
                    ]);
                }}>
                Numerical
            </span>
        </AddNew>
    );

    const NewOption = ({ index: i }) => (
        <div className='test-edit__option'>
            <span
                className='test-edit__option--new'
                onClick={() =>
                    setQuestions(
                        questions.map((que, j) =>
                            i !== j ? que : { ...que, options: [...que.options, 'option'] }
                        )
                    )
                }>
                <i className='fas fa-plus add-new__icon'></i> New Option
            </span>
        </div>
    );

    return (
        <div className='test-edit'>
            <h2>Test Name</h2>
            <div className='test-edit__header'>
                <div>
                    <div>Total score: {questions.length}</div>
                    <label>
                        Pass score:&nbsp;
                        <input
                            type='text'
                            className='test-edit__pass-score input'
                            value={passScore}
                            onChange={e => setPassScore(Number(e.target.value))}
                        />
                        % &nbsp;or&nbsp;
                        <input
                            type='text'
                            className='test-edit__pass-score input'
                            value={(passScore * questions.length) / 100}
                            onChange={e =>
                                setPassScore((Number(e.target.value) * 100) / questions.length)
                            }
                        />
                        &nbsp;score
                    </label>
                </div>
                <div className='test-edit__header test-edit__header--right'>
                    <Button
                        text='Save Test'
                        onClick={save}
                        loading={isSaving ? 'Saving' : ''}
                        className='u-margin-right-small'
                    />
                    <Button text='Cancel' onClick={cancel} />
                </div>
            </div>

            <ol className='test-edit__list' start='0'>
                <li>
                    <NewQuestion index={-1} />
                </li>
                {questions &&
                    questions.map((q, i) => (
                        <Fragment key={i}>
                            <li className='test-edit__question'>
                                <Editable
                                    html={q.question}
                                    tagName='p'
                                    onChange={e => (q.question = e.target.value)}
                                    block
                                />
                                {q.kind === 'smcq' && (
                                    <Fragment>
                                        <div className='test-edit__info'>
                                            Select the correct option
                                        </div>
                                        {q.options.map((op, j) => (
                                            <div key={j} className='test-edit__option'>
                                                <input
                                                    type='radio'
                                                    defaultChecked={q.answer === j}
                                                    name={`q${i}`}
                                                    onChange={e => {
                                                        if (e.target.checked) q.answer = j;
                                                    }}
                                                />
                                                &nbsp;
                                                <Editable
                                                    html={op}
                                                    tagName='span'
                                                    onChange={e => (q.options[j] = e.target.value)}
                                                />
                                                &nbsp;
                                                <i
                                                    className='delete-btn'
                                                    onClick={() => {
                                                        if (q.answer === j) delete q.answer;
                                                        deleteOption(i, j);
                                                    }}>
                                                    &#10006;
                                                </i>
                                            </div>
                                        ))}
                                        <NewOption index={i} />
                                    </Fragment>
                                )}
                                {q.kind === 'mmcq' && (
                                    <Fragment>
                                        <div className='test-edit__info'>
                                            Select all the options that should match
                                        </div>
                                        {q.options.map((op, j) => (
                                            <div key={j} className='test-edit__option'>
                                                <input
                                                    type='checkbox'
                                                    defaultChecked={q.answers.includes(j)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            q.answers.push(j);
                                                        } else {
                                                            const index = q.answers.indexOf(j);
                                                            q.answers.splice(index, 1);
                                                        }
                                                    }}
                                                />
                                                &nbsp;
                                                <Editable
                                                    html={op}
                                                    tagName='span'
                                                    onChange={e => (q.options[j] = e.target.value)}
                                                />
                                                &nbsp;
                                                <i
                                                    className='delete-btn'
                                                    onClick={() => {
                                                        const index = q.answers.indexOf(j);
                                                        if (index !== -1)
                                                            q.answers.splice(index, 1);

                                                        deleteOption(i, j);
                                                    }}>
                                                    &#10006;
                                                </i>
                                            </div>
                                        ))}
                                        <NewOption index={i} />
                                    </Fragment>
                                )}
                                {q.kind === 'short' && (
                                    <Fragment>
                                        <div className='test-edit__info'>
                                            Checking is case insensitive
                                        </div>
                                        <div className='test-edit__option'>
                                            <input
                                                type='text'
                                                placeholder='Correct Answer'
                                                defaultValue={q.answer}
                                                onChange={e => (q.answer = e.target.value)}
                                                className='input'
                                            />
                                        </div>
                                    </Fragment>
                                )}
                                {q.kind === 'numerical' && (
                                    <Fragment>
                                        <div className='test-edit__info'>
                                            Select range for correct answer
                                        </div>
                                        <div className='test-edit__option'>
                                            <label>
                                                From:&nbsp;
                                                <input
                                                    type='text'
                                                    defaultValue={q.answer.from}
                                                    onChange={e =>
                                                        (q.answer.from = Number(e.target.value))
                                                    }
                                                    className='test-edit__num-input input'
                                                />
                                            </label>
                                            &nbsp;
                                            <label>
                                                To:&nbsp;
                                                <input
                                                    type='text'
                                                    defaultValue={q.answer.to}
                                                    onChange={e =>
                                                        (q.answer.to = Number(e.target.value))
                                                    }
                                                    className='test-edit__num-input input'
                                                />
                                            </label>
                                        </div>
                                    </Fragment>
                                )}

                                <div>
                                    <i
                                        className='fas fa-trash-alt test-edit__delete-btn'
                                        onClick={() =>
                                            setQuestions([
                                                ...questions.slice(0, i),
                                                ...questions.slice(i + 1)
                                            ])
                                        }></i>
                                </div>

                                <NewQuestion index={i} />
                            </li>
                        </Fragment>
                    ))}
            </ol>
        </div>
    );
};

export default TestEdit;
