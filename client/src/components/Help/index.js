import React, { useEffect } from 'react';

const Help = () => {
    useEffect(() => {
        const { hash } = window.location;
        if (hash !== '') {
            const element = document.getElementById(hash.slice(1));

            if (element) element.classList.add('help__item--focus');
        }
    });

    return (
        <div className='container'>
            <ul className='help'>
                <li className='help__item' id='energy'>
                    <p className='help__question'>What is energy?</p>
                    <div className='help__answer'>
                        <p>
                            We try our best to make your learning effective, and that can be only
                            possible if you focus on what you're studying. According to a report,
                            one can't focus on more than four different areas simultaneously.
                        </p>
                        <p>
                            Initially, you get four units of energy and enrolling in a course costs
                            one energy. Don't worry as you'll get your energy back as soon as you
                            complete the course or unenroll from it. We do understand that everyone
                            has their own pace of studying and therefore, don't have any
                            restrictions on the number of courses completed in a given time. Just
                            one rule, complete one before starting another!
                        </p>
                    </div>
                </li>
                <li className='help__item' id='score'>
                    <p className='help__question'>How can I get more score?</p>
                    <div className='help__answer'>
                        Your score is a measure of your combined progress in all your enrolled
                        courses. Grow your score graph by completing resources and trying to score
                        best in tests. Completing each resource gives you a score of five. You also
                        get a bonus score equal to twice your best marks in each test. Start your
                        learning and climb up the leaderboard!
                    </div>
                </li>
                <li className='help__item' id='contribution'>
                    <p className='help__question'>What counts as a contribution?</p>
                    <div className='help__answer'>
                        <p>
                            Classity is not about you or me, it's about us, as a community. We aim
                            to build a community of learners learning together. You may be a learner
                            today in some area, but we are sure that you have much more knowledge
                            than others in some other area. Come forward and share your knowledge
                            with the community!
                        </p>
                        <p>
                            If you find something useful while learning a topic make sure to share
                            it in the Resource dump section of that topic as each like on your
                            shared resource gives you 5 contribution points.
                        </p>
                        <p>
                            If you have a decent knowledge of any subject/topic, we request you to
                            create a course about it to share your expertise with others.
                        </p>
                        <p>
                            By creating a course you earn contribution in two ways:
                            <ol>
                                <li>
                                    <p>
                                        Every review gives you some contribution points as follows:
                                    </p>
                                    <ul>
                                        <li>5 stars : + 20 contribution</li>
                                        <li>4 stars : + 10 contribution</li>
                                        <li>3 stars : + 5 contribution</li>
                                        <li>2 stars : + 0 contribution</li>
                                        <li>1 stars : - 5 contribution</li>
                                    </ul>
                                </li>
                                <li>
                                    <p>
                                        Course contribution is equal to 50 * number of resources
                                        (including reading resources, videos and tests). But you'll
                                        not get these contribution points immediately after creating
                                        the course.
                                    </p>
                                    <p>
                                        But don't worry you'll get these points whenever you cross
                                        checkpoints which at the start is 100 review contribution
                                        points. Next checkpoint is always the double of the previous
                                        one.
                                    </p>
                                </li>
                            </ol>
                        </p>
                        <p>
                            Wanna show off your expertise? Get an infinite supply of contribution
                            points by creating a course!
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Help;
