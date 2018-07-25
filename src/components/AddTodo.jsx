import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Panel, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import { todoRef } from '../firebase';

class AddTodo extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            title: '',
            description: '',
            open: false,
            created: false,
        };
    }

    onToggleHandler() {
        return (this.state.open);
    }

    addTodo() {
        const { description, title } = this.state;
        const { email } = this.props.user;
        const children = [];
        const dateStamp = moment().format('MMMM Do YYYY, h:mm:ss a');
        const completed = false;

        todoRef.push({
            email, description, children, dateStamp, completed, title,
        });
        this.setState({
            created: true,
        });
    }

    cancelTodo = () => {
        this.myFormRef.reset();
        this.setState({ open: false, created: false });
    }

    render() {
        const { created } = this.state;
        return (
            <div>
                <Panel id="collapsible-panel-example-1">
                    <Panel.Heading>
                        <Panel.Title toggle>
                            <div className="createtopic-con" role="presentation" onClick={() => this.setState({ open: !this.state.open })}>
                                <Button className="btn btn-success createtopic-btn">
                                Add a new Todo
                                    <Glyphicon glyph="plus" className="plus-icon" />
                                </Button>
                            </div>
                            <br />
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>
                            <form className="new-topic-form" ref={(el) => { this.myFormRef = el; }}>
                                <div className="form-group">
                                    <h3>Title</h3>
                                    <input
                                        type="text"
                                        placeholder="Topic title"
                                        className="form-control"
                                        onChange={(event) => {
                                            this.setState({
                                                title: event.target.value,
                                            });
                                        }}
                                    />
                                    <h3>Description</h3>
                                    <textarea name="" rows="5" className="topic-description" onChange={event => this.setState({ description: event.target.value })} />
                                </div>
                                <button className="btn btn-success" type="button" onClick={() => this.addTodo()}>
                                        Submit
                                </button>

                                <button className="btn btn-danger" type="button" onClick={() => this.cancelTodo()} >
                                        Cancel
                                </button>
                                {
                                    (created)
                                        ? <p className="topic-success"> The todo has been created successfully </p>
                                        : ''
                                }
                            </form>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>

            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return { user };
}

AddTodo.propTypes = {
    user: PropTypes.object,
};

AddTodo.defaultProps = {
    user: null,
};


export default connect(mapStateToProps, null)(AddTodo);
