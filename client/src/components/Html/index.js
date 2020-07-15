import React from 'react';
import PropTypes from 'prop-types';

const Html = React.forwardRef((props, ref) => {
    const { children, className, tag } = props;

    const CustomTag = tag || 'span';

    return (
        <CustomTag
            ref={ref}
            className={className}
            dangerouslySetInnerHTML={{ __html: React.Children.toArray(children).join('') }}
        />
    );
});

Html.propTypes = {
    tag: PropTypes.string,
    className: PropTypes.string
};

export default Html;
