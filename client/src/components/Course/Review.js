import React from 'react';

import Rating from '../layout/Rating';
import Button from '../layout/Button';
import FadeText from '../layout/FadeText';

const Review = () => (
    <section className='reviews'>
        <h3>Reviews</h3>
        <ul>
            <li>
                <p className='date'>10/06/2020</p>
                <Rating rating='2' />
                <p>Sanchit Arora</p>
                <FadeText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                    cursus odio vitae orci feugiat, id maximus elit mollis.
                    Phasellus venenatis tincidunt mauris, at commodo nunc
                    consectetur eget. Suspendisse potenti. Vivamus scelerisque
                    nisl et gravida consequat. Donec nibh mauris, condimentum id
                    odio sit amet, euismod dictum ante. Aenean faucibus rutrum
                    vulputate. In a dolor blandit, rutrum est eu, sagittis erat.
                    Morbi fringilla ligula in gravida pharetra. Pellentesque
                    habitant morbi tristique senectus et netus et malesuada
                    fames ac turpis egestas. Vestibulum aliquet, nunc nec
                    tristique mollis, tortor massa vulputate risus, eu volutpat
                    nunc est eu elit.
                </FadeText>
            </li>
            <li>
                <p className='date'>10/06/2020</p>
                <Rating rating='2' />
                <p>Sanchit Arora</p>
                <FadeText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </FadeText>
            </li>
            <li className='more'>
                <Button text='See more reviews' />
            </li>
        </ul>
    </section>
);

export default Review;
