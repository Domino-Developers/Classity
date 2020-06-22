import React, { Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import './App.css';

function App() {
    return (
        <Fragment>
            <Router>
                <Navbar />
                <div className='main'>
                    <Landing />
                </div>
            </Router>
        </Fragment>
    );
}

export default App;
