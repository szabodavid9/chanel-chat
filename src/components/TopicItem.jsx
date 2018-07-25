import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon, Button, Panel } from 'react-bootstrap';
import moment from 'moment';
import { addTopics } from '../actions';
import { topicRef, databaseRef } from '../firebase';
import AddComment from './AddComment';
import MapChildren from './MapChildren';
import Confirm from './Confirm';
import RemoveChildren from './RemoveChildren';

class TopicItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            edit: false,
            newTitle: this.props.topic.title,
            newDescription: this.props.topic.description,

        };

        this.removeTopic = this.removeTopic.bind(this);
    }


    removeChildren(children, parent) {
        children.forEach((child) => {
            let items = null;
            switch (child.childType) {
            case 'comments':
                items = this.props.comments;

                break;
            case 'todos':
                items = this.props.todos;
                break;
            default:
                break;
            }
            const filteredItem = items.filter(item => (item.serverKey === child.childId));
            // console.log('CHILDREN' , items);
            const { parentType, parentId, serverKey } = filteredItem[0];

            if (filteredItem[0].children !== undefined && filteredItem[0].children.length !== 0) {
                this.removeChildren(filteredItem[0].children, filteredItem[0]);
            }

            if (parent !== null) {
                // console.log('itt a prent' , parent);
                const newParentChildren = parent.children.filter(newChild => (
                    newChild.childId !== serverKey
                ));
                databaseRef(parentType).child(parentId).update({ children: newParentChildren });
            } else {
                topicRef.child(this.props.topic.serverKey).update({ children: null });
            }
            databaseRef(child.childType).child(filteredItem[0].serverKey).remove();
        });
    }
    removeTopic() {
        const { children, serverKey } = this.props.topic;
        if (children !== undefined) {
            this.removeChildren(children, null);
            // <RemoveChildren parentServerkey='serverKey' reference={topicRef} children={children}/>
        }
        topicRef.child(serverKey).remove();
    }

    editTopic() {
        this.setState({
            edit: !this.state.edit,
        });
    }

    updateTopic() {
        const { serverKey } = this.props.topic;
        const editedAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        const { newTitle, newDescription } = this.state;
        topicRef.child(serverKey).update({
            title: newTitle,
            description: newDescription,
            editedAt,
        });
    }

    render() {
        const { edit, newTitle, newDescription } = this.state;

        const {
            email, title, description, children, dateStamp, editedAt,
        } = this.props.topic;

        return (
            <div>
                <Panel>
                    <Panel.Body >

                        {
                            (edit) ?
                                <div>
                                    <h2>Title</h2>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={newTitle}
                                        onChange={event => this.setState({
                                            newTitle: event.target.value,
                                        })}
                                    />
                                    <h2>Description</h2>
                                    <textarea
                                        name=""
                                        rows="5"
                                        value={newDescription}
                                        className="topic-description"
                                        onChange={event => this.setState({
                                            newDescription: event.target.value,
                                        })}
                                    />

                                {<Confirm
                                    action={() => {
                                        this.updateTopic();
                                        this.editTopic();
                                    }}
                                    actionType="saveChanges"
                                />}
                                </div>
                                :
                                <div className="topic-item-top">
                                    <div className="topic-item__props">
                                        <h2>{title}</h2>
                                        <h4>{description}</h4>
                                        <h5>submitedd by <em> {email} </em></h5>
                                        <h5>at {dateStamp}</h5>
                                        {(editedAt !== undefined) ?
                                            <h5>edited at {editedAt}</h5>
                                            : ''}
                                    </div>

                                    <div className="topic-item__remove">
                                        {<Confirm
                                            action={() => this.removeTopic()}
                                            actionType="removeTopic"
                                        />}
                                        {

                                            (this.props.user.email === email) ?
                                                <span>
                                                    <Button bsStyle="info" bsSize="small" onClick={() => this.editTopic()}>
                                                        <Glyphicon glyph="edit" />
                                                    </Button>

                                                </span>
                                                : ''
                                        }
                                    </div>
                                </div>
                        }


                        <strong>{this.state.error}</strong>
                        <h3>Comments</h3>

                        <MapChildren
                            parentId={this.props.topic.serverKey}
                            parentType={topicRef}
                            children={children}
                        />
                        <AddComment parentType={topicRef} parentId={this.props.topic.serverKey} />

                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const {
        topics, user, comments, todos,
    } = state;

    const { children } = ownProps.topic;
    return {
        topics, children, user, todos, comments,
    };
}

TopicItem.propTypes = {
    topic: PropTypes.shape({
        children: PropTypes.arrayOf(PropTypes.shape({
            childId: PropTypes.string.isRequired,
            childType: PropTypes.string.isRequired,
        })),
        dateStamp: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        editedAt: PropTypes.string,
        email: PropTypes.string.isRequired,
        serverKey: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }),
    comments: PropTypes.arrayOf(PropTypes.shape({
        children: PropTypes.arrayOf(PropTypes.shape({
            childId: PropTypes.string.isRequired,
            childType: PropTypes.string.isRequired,
        })),
        dateStamp: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        parentId: PropTypes.string.isRequired,
        parentType: PropTypes.string.isRequired,
        serverKey: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    })),
    todos: PropTypes.arrayOf(PropTypes.shape({
        children: PropTypes.arrayOf(PropTypes.shape({
            childId: PropTypes.string.isRequired,
            childType: PropTypes.string.isRequired,
        })),
        completed: PropTypes.bool,
        completedBy: PropTypes.string,
        dateStamp: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        parentId: PropTypes.string.isRequired,
        parentType: PropTypes.string.isRequired,
        title: PropTypes.string,
    })),
    user: PropTypes.shape({
        email: PropTypes.string.isRequired,
    }).isRequired,
};

TopicItem.defaultProps = {
    topic: [],
    comments: [],
    todos: [],
};


export default connect(mapStateToProps, { addTopics })(TopicItem);
