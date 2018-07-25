import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { topicRef, commentRef, todoRef } from '../firebase';
import { addTopics, addComments, addTodos } from '../actions';
import TopicItem from './TopicItem';


class TopicList extends Component {
    componentDidMount() {
        topicRef.on('value', (snap) => {
            const topics = [];
            snap.forEach((topic) => {
                const {
                    email, title, description, children, dateStamp, editedAt,
                } = topic.val();
                const serverKey = topic.key;
                topics.push({
                    email, title, description, serverKey, children, dateStamp, editedAt,
                });
            });
            this.props.addTopics(topics);
        });

        commentRef.on('value', (snap) => {
            const commentList = [];
            snap.forEach((comment) => {
                const {
                    codeText,text, email, dateStamp, children, editedAt, parentId, parentType, selectedFile
                } = comment.val();
                
                const serverKey = comment.key;
                commentList.push({
                    codeText,text, email, dateStamp, serverKey, children, editedAt, parentId, parentType, selectedFile
                });
            });
            console.log(commentList);
            this.props.addComments(commentList);
        });

        todoRef.on('value', (snap) => {
            const todoList = [];
            snap.forEach((todo) => {
                const {
                    email, description, children, parentId, parentType, dateStamp, title,
                } = todo.val();
                const serverKey = todo.key;
                todoList.push({
                    email, description, serverKey, children, parentId, parentType, dateStamp, title,
                });
            });
            this.props.addTodos(todoList);
        });
    }

    render() {
        return (
            <div>
                {
                    this.props.topics.reverse().map(topic => (
                        <TopicItem key={topic.serverKey} topic={topic} />
                    ))
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { topics } = state;
    return { topics };
}

TopicList.propTypes = {
    addTodos: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    addTopics: PropTypes.func.isRequired,
    topics: PropTypes.arrayOf(PropTypes.shape({
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
    })),
};

TopicList.defaultProps = {
    topics: [],
};


export default connect(mapStateToProps, { addTopics, addComments, addTodos })(TopicList);
