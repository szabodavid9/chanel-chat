import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import { firebaseApp } from '../firebase';
import AddTopic from './AddTopic';
import TopicList from './TopicList';

import '../css/app.css';


class App extends Component {
    static mySignOut() {
        firebaseApp.auth().signOut();
    }

    render() {
        return (
            <div className="wrapper">
                <div className="main-title-con">
                    <h1>Chanel</h1>
                </div>

                <Panel>
                    <Panel.Body>
                        <div className="welcome-con">
                            <div className="welcome-con__text">
                                <h2>Welcome back {this.props.users.user.email} </h2>
                            </div>

                            <div className="welcome-con__btn">
                                <button
                                    className="btn btn-danger btn-lg"
                                    onClick={() => App.mySignOut()}
                                >
                                        Sign Out
                                </button>
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>

                <div>
                    {<AddTopic />}
                    {<TopicList />}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state,
    };
}


App.propTypes = {
    users: PropTypes.object.isRequired,
};


export default connect(mapStateToProps, null)(App);

