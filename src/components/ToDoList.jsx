import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addTodos, addComments } from '../actions';
import { todoRef, commentRef } from '../firebase';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

class ToDoList extends Component {
    componentDidMount() {
        todoRef.on('value', (snap) => {
            const todos = [];
            snap.forEach((todo) => {
                const {
                    email,
                    description,
                    parentId,
                    parentType,
                    children,
                    dateStamp,
                    completed,
                    completedBy,
                    title,
                } = todo.val();
                const serverKey = todo.key;
                todos.push({
                    email,
                    description,
                    serverKey,
                    parentId,
                    parentType,
                    children,
                    dateStamp,
                    completed,
                    completedBy,
                    title,
                });
            });
            this.props.addTodos(todos);
        });

        commentRef.on('value', (snap) => {
            const commentList = [];
            snap.forEach((comment) => {
                const {
                    codeText,editedAt,selectedFile, text, email, dateStamp, children, parentType, parentId,
                } = comment.val();
                const serverKey = comment.key;
                commentList.push({
                    codeText,editedAt,selectedFile, text, email, dateStamp, serverKey, children, parentId, parentType,
                });
            });
            this.props.addComments(commentList);
        });
    }

    render() {
        const { todos } = this.props;
        // console.log(this.props.history, 'totoro');
        if (todos !== undefined) {
            return (
                <div className="wrapper">
                    <div className="main-title-con">
                        <h1 >The To-do List </h1>
                    </div>


                    <h2>Create a new to-do</h2>
                    <AddTodo />

                    <h2>Uncompleted to-do list</h2>
                    {
                        this.props.todos.reverse().map((todo) => {
                            if (!todo.completed) { return <TodoItem key={todo.serverKey} todo={todo} nolink="true" />; }
                            return null;
                        })
                    }

                    <h2>Completed to-do list</h2>

                    {
                        this.props.todos.map((todo) => {
                            if (todo.completed) { return <TodoItem key={todo.serverKey} todo={todo} nolink="true" />; }
                            return null;
                        })
                    }

                </div>
            );
        }
        return (<div />);
    }
}

function mapStateToProps(state) {
    const { todos, history } = state;
    return { todos, history };
}

ToDoList.propTypes = {
    addTodos: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    todos: PropTypes.array,
    // addActiveTab: PropTypes.function,
};

ToDoList.defaultProps = {
    todos: PropTypes.array,
};


export default connect(mapStateToProps, { addTodos, addComments })(ToDoList);
