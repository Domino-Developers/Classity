import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FadeText from '../layout/FadeText';
import Editable from '../layout/Editable';

const Description = props => {
    const { editing } = props;
    const [description, changeDescription] = useState(
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
        cursus odio vitae orci feugiat, id maximus elit mollis.
        Phasellus venenatis tincidunt mauris, at commodo nunc
        consectetur eget. Suspendisse potenti. Vivamus scelerisque nisl
        et gravida consequat. Donec nibh mauris, condimentum id odio sit
        amet, euismod dictum ante. Aenean faucibus rutrum vulputate. In
        a dolor blandit, rutrum est eu, sagittis erat. Morbi fringilla
        ligula in gravida pharetra. Pellentesque habitant morbi
        tristique senectus et netus et malesuada fames ac turpis
        egestas. Vestibulum aliquet, nunc nec tristique mollis, tortor
        massa vulputate risus, eu volutpat nunc est eu elit. In a dolor
        blandit, rutrum est eu, sagittis erat. Morbi fringilla ligula in
        gravida pharetra. Pellentesque habitant morbi tristique senectus
        et netus et malesuada fames ac turpis egestas. Vestibulum
        aliquet, nunc nec tristique mollis, tortor massa vulputate
        risus, eu volutpat nunc est eu elit.`
    );

    return (
        <section className='course-page-description'>
            <h2>Description</h2>
            {editing ? (
                <Editable
                    html={description}
                    onChange={e => changeDescription(e.target.value)}
                    disabled={!editing}
                />
            ) : (
                <FadeText html>{description}</FadeText>
            )}
        </section>
    );
};

Description.propTypes = {
    editing: PropTypes.bool.isRequired
};

export default Description;
