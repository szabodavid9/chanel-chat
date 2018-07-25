import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../firebase';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: {
                message: '',
            },
        };
    }

    signUp() {
        const { email, password } = this.state;
        firebaseApp.auth().createUserWithEmailAndPassword(email, password)
            .catch((error) => {
                this.setState({ error });
            });
    }

    render() {
        return (
            <div className="wrapper">
                <div className="form-inline">
                    <h2>Sign Up</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="email"
                            onChange={event => this.setState({
                                email: event.target.value,
                            })}
                        />
                        <input
                            type="password"
                            className="form-control"
                            placeholder="password"
                            onChange={event => this.setState({
                                password: event.target.value,
                            })}
                        />

                        <div>{this.state.error.message} </div>
                        <button
                            className="btn btn-succes"
                            type="button"
                            onClick={() => this.signUp()}
                        >
                            Sign Up
                        </button>

                    </div>
                </div>
                <Link to="/signin"> If you already have an account, please login! </Link>
            </div>

        );
    }
}

export default SignUp;
