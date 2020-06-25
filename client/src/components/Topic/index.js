import React from 'react';
import SideBar from '../layout/SideBar';
import Collapse from '../layout/Collapse';

import './Topic.css';

const Topic = () => {
    return (
        <div className='main-content-area'>
            <SideBar.Container>
                <SideBar.Tab text='Topic1'>
                    <SideBar.Item>video1</SideBar.Item>
                    <SideBar.Item>video1</SideBar.Item>
                    <SideBar.Item>video1</SideBar.Item>
                    <SideBar.Item>video1</SideBar.Item>
                </SideBar.Tab>
                <SideBar.Tab text='Topic1'>
                    <SideBar.Item>video1</SideBar.Item>
                    <SideBar.Item>video1</SideBar.Item>
                    <SideBar.Item>video1</SideBar.Item>
                    <SideBar.Item>video1</SideBar.Item>
                </SideBar.Tab>
            </SideBar.Container>
        </div>
    );
};

export default Topic;
