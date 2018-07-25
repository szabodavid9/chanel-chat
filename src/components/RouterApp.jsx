import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';

import App from './App';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ToDoList from './ToDoList';
import { firebaseApp } from '../firebase';
import Home from './Home';

import { logUser, addHistory, addActiveTab } from '../actions';

class RouterApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            key: 1,
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillMount() {
        firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    loggedin: true,
                });
                this.props.logUser(user.email);
            } else {
                this.setState({
                    loggedin: false,
                });
            }
        });
    }
    // componentDidMount() {
    //     if (this.props.users.activeTab !== undefined &&
    // this.props.users.activeTab.length !== 0) {
    //         this.setState({ key: 1 });
    //     }
    // }

    handleSelect(key) {
        this.setState({ key });
        this.props.addActiveTab(key);
    }

    render() {
        // let activeTab = null;
        // if (this.props.users.activeTab.length !== 0) {
        //     activeTab = this.props.users.activeTab;
        // } else { activeTab = this.state.key; }

        let { activeTab } = this.props.users;
        if (activeTab.length === 0) {
            activeTab = this.state.key;
        }

        return (
            <Router path="/" >
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route
                        exact
                        path="/signin"
                        render={() => (
                            this.state.loggedin ? (
                                <Redirect to="/app" />
                            ) : (
                                <SignIn />
                            )
                        )}
                    />
                    <Route
                        exact
                        path="/app"
                        render={() => (
                            this.state.loggedin ? (
                                <div>
                                    <Tabs
                                        className="wrapper"
                                        activeKey={activeTab}
                                        onSelect={this.handleSelect}
                                        animation={false}
                                        id="noanim-tab-example"
                                    >
                                        <Tab eventKey={1} title="Topics">
                                            <App />
                                        </Tab>
                                        <Tab eventKey={2} title="To-do List">
                                            <ToDoList />
                                        </Tab>
                                    </Tabs>;
                                </div>
                            ) : (
                                <Redirect to="/signIn" />
                            )
                        )}
                    />

                    <Route path="/signup" component={SignUp} />


                </Switch>
            </Router>
        );
    }
}


function mapStateToPros(state) {
    return {
        users: state,
    };
}

RouterApp.propTypes = {
    logUser: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    addActiveTab: PropTypes.func.isRequired,
};

// RouterApp.defaultProps = {
//     logUser: PropTypes.function.isRequired,
//     users: PropTypes.object,
//     // addActiveTab: PropTypes.function,
// };


export default connect(mapStateToPros, { logUser, addHistory, addActiveTab })(RouterApp);

