import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import loadable from '@loadable/component';

import Navbar from '../features/Navbar';
import Loading from '../components/Loading';
import Footer from '../components/Footer';
import store from './store';
import './App.css';
import Alerts from '../features/Alerts';
import { initAuth, authRejected } from '../features/Auth/authSlice';
import { initTokenCom } from '../utils/storageCom';
import ClassroomRoute from '../features/ClassroomRoute';
import PrivateRoute from '../components/PrivateRoute';
import EmailVerify from '../features/EmailVerify';
import GoogleLogin from '../features/Auth/GoogleLogin';

// Quill text editor, available themes: snow, bubble, core
import 'react-quill/dist/quill.snow.css';

// loadable components
const Course = loadable(() => import('../features/Course'), {
    fallback: <Loading />
});
const Landing = loadable(() => import('../components/Landing'), {
    fallback: <Loading />
});
const ContentContainer = loadable(() => import('../components/ContentContainer'), {
    fallback: <Loading />
});

const Dashboard = loadable(() => import('../features/Dashboard'), {
    fallback: <Loading />
});

const Leaderboard = loadable(() => import('../features/Leaderboard'), {
    fallback: <Loading />
});

const Help = loadable(() => import('../components/Help'), {
    fallback: <Loading />
});

const Profile = loadable(() => import('../features/Profile'), { fallback: <Loading /> });

const Search = loadable(() => import('../features/Search'), { fallback: <Loading /> });

function App() {
    useEffect(() => {
        initTokenCom(
            () => {
                store.dispatch(initAuth({ dontCommunicate: true }));
            },
            () => {
                store.dispatch(authRejected({ dontCommunicate: true }));
            }
        );
    }, []);
    return (
        <Provider store={store}>
            <Router>
                <Navbar />
                <Alerts />
                <main>
                    <Switch>
                        <Route exact path='/' component={Landing} />
                        <Route exact path='/search' component={Search} />
                        <Route exact path='/course/:courseId' component={Course} />
                        <ClassroomRoute
                            path='/course/:courseId/topic/:topicId'
                            render={props => <ContentContainer {...props} />}
                        />
                        <PrivateRoute exact path='/dashboard' component={Dashboard} />
                        <PrivateRoute exact path='/profile/:userId' component={Profile} />
                        <Route exact path='/leaderboard' component={Leaderboard} />
                        <Route exact path='/help' component={Help} />
                        <Route exact path='/email-verify' component={EmailVerify} />
                        <Route exact path='/glogin' component={GoogleLogin} />
                    </Switch>
                </main>
                <Footer />
            </Router>
        </Provider>
    );
}

export default App;
