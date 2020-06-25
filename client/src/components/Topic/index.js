import React, { Fragment } from 'react';
import SideBar from '../layout/SideBar';
import Breadcrumb from '../layout/Breadcrumb';

import './Topic.css';

const Topic = () => {
    return (
        <Fragment>
            <Breadcrumb.Container instructor={false}>
                <Breadcrumb.Item>Hi</Breadcrumb.Item>
                <Breadcrumb.Item>Hello</Breadcrumb.Item>
            </Breadcrumb.Container>
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
        </Fragment>
    );
};

export default Topic;
