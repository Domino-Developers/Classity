import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FadeText from '../../components/FadeText';
import Editable from '../../components/Editable';

const Description = props => {
    const { editing, desc, changeCourse } = props;
    const [description, changeDescription] = useState(desc);

    const handleChange = e => {
        changeDescription(e.target.value);
        changeCourse('description', e.target.value);
    };

    return (
        <section className='course-page-description'>
            <h2>Description</h2>
            {editing ? (
                <Editable html={description} onChange={handleChange} rich />
            ) : (
                <FadeText html>{description}</FadeText>
            )}
        </section>
    );
};

Description.propTypes = {
    editing: PropTypes.bool.isRequired,
    desc: PropTypes.string.isRequired,
    changeCourse: PropTypes.func.isRequired
};

export default Description;
