import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Panel, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import { topicRef } from '../firebase';

class AddTopic extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            title: '',
            description: '',
            created: false,
        };
    }

    addTopic() {
        const { title, description } = this.state;
        const { email } = this.props.user;
        const children = [];
        const dateStamp = moment().format('MMMM Do YYYY, h:mm:ss a');
        topicRef.push({
            email, title, description, children, dateStamp,
        });
        this.setState({
            created: true,
        });
        this.myFormRef.reset();
    }

    cancelTopic = () => {
        this.myFormRef.reset();
        this.setState({ created: false });
    }

    render() {
        const { created } = this.state;

        return (
            <div>
                <Panel id="collapsible-panel-example-2" defaultExpanded={false}>
                    <Panel.Heading>
                        <Panel.Title toggle>
                            <div className="createtopic-con" role="presentation" >
                                <Button className="btn btn-success createtopic-btn">
                        Add a new Topic
                                    <Glyphicon glyph="plus" className="plus-icon" />
                                </Button>

                            </div>
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
                                <button className="btn btn-success" type="button" onClick={() => this.addTopic()}>
                                Submit
                                </button>

                                <button className="btn btn-danger" type="button" onClick={() => this.cancelTopic()} >
                                Cancel
                                </button>
                                {
                                    (created)
                                        ? <p className="topic-success"> The topic has been created successfully </p>
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

AddTopic.propTypes = {
    user: PropTypes.object,
};

AddTopic.defaultProps = {
    user: null,
};

export default connect(mapStateToProps, null)(AddTopic);
