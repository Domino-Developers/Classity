import React from 'react';
import Video from './Video';
import TextRes from './TextRes';
import TestView from './TestView';
import './Resource.css';

const Resource = () => {
    const resources = [
        {
            kind: 'text',
            name: 'Lorem ipsum dolor sit amet.',
            text:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero sit dolores veritatis amet in reiciendis optio tempore et voluptatem excepturi, pariatur incidunt non enim nam cumque quod autem, quos aut consectetur reprehenderit tenetur ad laboriosam perspiciatis recusandae? Amet aperiam iste ab sed soluta quia quasi possimus praesentium illo ipsam cum, voluptatem consectetur fugiat nam dolorem a, optio dignissimos laudantium vel enim? Incidunt delectus numquam, dignissimos eaque deleniti explicabo architecto consectetur quibusdam dolorem officiis repellat aut accusamus a, tenetur odit quasi!'
        },
        {
            kind: 'test',
            name: 'Quiz1',
            passScore: '80',
            score: '100'
        }
    ];

    const templates = {
        video: props => <Video {...props} />,
        text: props => <TextRes {...props} />,
        test: props => <TestView {...props} />
    };

    return (
        <div className='main-content-area'>
            <div className='main-content'>
                {templates[resources[1].kind]({ payload: resources[1] })}
            </div>
        </div>
    );
};

export default Resource;
