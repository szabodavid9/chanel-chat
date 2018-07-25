import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Checkbox, Button } from 'react-bootstrap';
import moment from 'moment';

import { todoRef, databaseRef } from '../firebase';
import AddComment from './AddComment';
import MapChildren from './MapChildren';
import Confirm from './Confirm';

import { addActiveTab, addBackToComment } from '../actions';

class TodoItem extends Component {
    constructor(props) {
        super(props);

        let newTitle = '';
        if (this.props.todo.title !== undefined) { newTitle = this.props.todo.title; }

        this.state = {
            newCom: false,
            edit: false,
            newDescription: this.props.todo.description,
            newTitle,
        };
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

            const { parentType, parentId, serverKey } = filteredItem[0];


            if (filteredItem[0].children !== undefined && filteredItem[0].children.length !== 0) {
                this.removeChildren(filteredItem[0].children, filteredItem[0]);
            }

            if (parent !== null) {
                const newParentChildren = parent.children.filter(newChild => (
                    newChild.childId !== serverKey
                ));
                databaseRef(parentType).child(parentId).update({ children: newParentChildren });
            } else {
                todoRef.child(this.props.todo.serverKey).update({ children: null });
            }
            databaseRef(child.childType).child(filteredItem[0].serverKey).remove();
        });
    }


    removeTodo() {
        const { serverKey } = this.props.todo;
        const { parentId, parentType, children } = this.props.todo;

        if (children !== undefined) {
            this.removeChildren(children, null);
        }

        if (parentId !== undefined) {
            let newChildren = null;

            // Remove comment form the parent
            databaseRef(parentType).child(parentId).on('value', (snap) => {
                if (snap.val().children !== undefined) {
                    newChildren = snap.val().children;
                    newChildren = newChildren.filter(child => (child.childId !== serverKey));
                }
            });

            if (newChildren !== null) {
                databaseRef(parentType).child(parentId).update({ children: newChildren });
            }
        }

        todoRef.child(serverKey).remove();
    }

    editTodo() {
        this.setState({
            edit: !this.state.edit,
        });
    }

    // componentDidUpdate() {
    //     // if (this.props.handler !== undefined )
    //     // this.props.handler();
    // }
    completeTodo(e) {
        const { serverKey } = this.props.todo;
        const { email } = this.props.user;
        if (e.target.checked === true) {
            todoRef.child(serverKey).update({ completed: true, completedBy: email });
        }
    }

    updateTodo() {
        const { serverKey } = this.props.todo;
        const { newDescription, newTitle } = this.state;
        const editedAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        todoRef.child(serverKey).update({ description: newDescription, title: newTitle, editedAt });
    }

    seeConversation(parentId) {
        this.props.addActiveTab(1);
        this.props.addBackToComment(parentId);
    }

    render() {
        const {
            parentId, description, email, dateStamp, completed, completedBy, title,
        } = this.props.todo;
        const {
            newCom, edit, newDescription, newTitle,
        } = this.state;

        return (
            <div>

                <Panel>
                    <Panel.Body className="todo-con">
                        {
                            (edit)
                                ?
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
                                    {
                                        <Confirm
                                            action={() => { this.updateTodo(); this.editTodo(); }}
                                            actionType="saveChanges"
                                        />
                                    }
                                    </div>
                                :
                                    <div className="todo-unit">

                                        <h2>{title}</h2>
                                        <div className="todo-content">
                                            <div className="todo-description-con">
                                                <p className="todo-description">{description} </p>
                                            </div>

                                            <div className="comment-author-con">
                                                <p>by <em>{email}</em><br />
                                                at {dateStamp}
                                                </p>
                                                {
                                                    (completedBy !== undefined) ?
                                                        <p>compeleted by
                                                            <em>
                                                                {completedBy}
                                                            </em>
                                                        </p>
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                        }
                        <Button bsStyle="link" bsSize="sm" onClick={() => this.setState({ newCom: true })}>
                                        Reply
                        </Button>
                        {
                            newCom ?
                                <div className="new-comment">

                                    <AddComment
                                        parentType={todoRef}
                                        parentId={this.props.todo.serverKey}
                                        nested
                                    />
                                </div>

                                : ''
                        }

                        {
                            (this.props.user.email === email) ?
                                <span>
                                {<Confirm
                                    action={() => this.removeTodo()}
                                    actionType="removeComp"
                                />}
                                    <Button bsStyle="link" bsSize="sm" onClick={() => this.editTodo()}>
                                        Edit
                                    </Button>

                                </span>
                                : ''
                        }
                        {
                            // Todo list
                            (this.props.nolink) ?
                                (<div>
                                    {
                                        (parentId !== undefined) ?
                                            <button onClick={() => this.seeConversation(parentId)} className="btn btn-info">
                                                See the conversation
                                            </button>
                                            : ''
                                    }
                                    {
                                        (!completed) ?
                                            <Checkbox onChange={e => this.completeTodo(e)} >
                                                Complete this To-do
                                            </Checkbox>
                                            : ''
                                    }

                                 </div>
                                )

                                : ''
                        }
                    </Panel.Body>
                </Panel>

                <div className="nested-children">
                    <MapChildren
                        parentId={this.props.todo.serverKey}
                        parentType={todoRef}
                        children={this.props.todo.children}
                    />
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    const {
        user, comments, todos, history,
    } = state;
    return {
        user, comments, todos, history,
    };
}

TodoItem.propTypes = {
    todo: PropTypes.shape({
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
        serverKey: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
        email: PropTypes.string.isRequired,
    }).isRequired,
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
    addActiveTab: PropTypes.func.isRequired,
    addBackToComment: PropTypes.func.isRequired,
    nolink: PropTypes.string,
};

TodoItem.defaultProps = {
    comments: [],
    todos: [],
    nolink: '',
};

export default connect(mapStateToProps, { addActiveTab, addBackToComment })(TodoItem);
