import React, { useState } from 'react';

const Tags = props => {
    const [tags, setTags] = useState(props.tags);
    const { courseChanges } = props;

    return (
        <div className='add-tags'>
            Tags:
            <ul className='add-tags__list'>
                {tags.map((tag, i) => (
                    <li className='add-tags__tag' key={i}>
                        {tag}
                        <span
                            className='add-tags__delete'
                            onClick={() => {
                                setTags([...tags.slice(0, i), ...tags.slice(i + 1)]);
                                courseChanges.current.tags = [
                                    ...tags.slice(0, i),
                                    ...tags.slice(i + 1)
                                ];
                            }}>
                            &#10005;
                        </span>
                    </li>
                ))}
                <li>
                    <input
                        type='text'
                        className='add-tags__input'
                        onKeyDown={e => {
                            if (e.key === 'Enter' && e.target.value) {
                                setTags([...tags, e.target.value]);
                                courseChanges.current.tags = [...tags, e.target.value];
                                e.target.value = '';
                            } else if (e.key === 'Backspace' && !e.target.value) {
                                setTags([...tags.slice(0, -1)]);
                                courseChanges.current.tags = [...tags.slice(0, -1)];
                            }
                        }}
                    />
                </li>
            </ul>
        </div>
    );
};

export default Tags;
