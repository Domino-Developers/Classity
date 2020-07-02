import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FadeText from '../../components/FadeText';
import Editable from '../../components/Editable';

const Description = props => {
    const { editing, desc } = props;
    const [description, changeDescription] = useState(desc);

    return (
        <section className='course-page-description'>
            <h2>Description</h2>
            {editing ? (
                <Editable
                    html={description}
                    onChange={e => changeDescription(e.target.value)}
                    rich
                />
            ) : (
                <FadeText html>{description}</FadeText>
            )}
        </section>
    );
};

Description.propTypes = {
    editing: PropTypes.bool.isRequired,
    desc: PropTypes.string.isRequired
};

export default Description;
