import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import FadeText from '../../components/FadeText';
import Editable from '../../components/Editable';

const Description = props => {
    const { editing, desc, courseChanges } = props;
    const description = useRef(desc);

    const handleChange = e => {
        description.current = e.target.value;
        courseChanges.current.description = e.target.value;
    };

    return (
        <section className='course-page-description'>
            <h2>Description</h2>
            {editing ? (
                <Editable html={description.current} onChange={handleChange} rich />
            ) : (
                <FadeText html>{description.current}</FadeText>
            )}
        </section>
    );
};

Description.propTypes = {
    editing: PropTypes.bool.isRequired,
    desc: PropTypes.string.isRequired,
    courseChanges: PropTypes.object.isRequired
};

export default Description;
