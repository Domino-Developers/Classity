import React from 'react';
import PropTypes from 'prop-types';

const Html = props => {
    const { children, className, tag } = props;

    const CustomTag = tag || 'div';
    return <CustomTag className={className} dangerouslySetInnerHTML={{ __html: children }} />;
};

Html.propTypes = {
    tag: PropTypes.string,
    className: PropTypes.string
};

export default Html;
