import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Glyphicon } from 'react-bootstrap';
import CommentItem from './CommentItem';
import TodoItem from './TodoItem';
import { addChildren } from '../actions';


class MapChildren extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
        };
        this.onToggleHandler = this.onToggleHandler.bind(this);
    }

    onToggleHandler() {
        // return new Promise((resolve, reject) => {
        //     this.setState({
        //         open: true,
        //     });
        //     resolve(this.state.open);
        //     reject('Error');
        // });
        //! this.state.open
        this.setState({
            open: true,
        });
    }

    render() {
        const { children, comments, todos } = this.props;
        // console.log('thosa', this.props.parentType);
        const { open } = this.state;
        if (children.length !== 0) {
            return (
                <div className="map-children">
                    {/* expanded={open} */}
                    <Panel className="children-con" id="collapsible-panel-example-2" >

                        <Panel.Heading>
                            <Panel.Title toggle />
                            <Panel.Toggle componentClass="a">
                                <span role="presentation" onClick={() => this.setState({ open: !open })}>
                                    {children.length} Comments and/or to-dos
                                    {

                                        (open)
                                            ? <Glyphicon glyph="menu-down" className="com-menu-down" />
                                            : <Glyphicon glyph="menu-up" className="com-menu-down" />
                                    }
                                </span>

                            </Panel.Toggle>
                        </Panel.Heading>

                        <Panel.Collapse>
                            <Panel.Body>
                                {children.map((child) => {
                                    switch (child.childType) {
                                    case 'todos': {
                                        const filteredTodo = todos.filter(todo => (
                                            todo.serverKey === child.childId
                                        ));
                                        if (filteredTodo[0] !== undefined) {
                                            return (<TodoItem
                                                todo={filteredTodo[0]}
                                                key={child.childId}
                                                handler={this.onToggleHandler}
                                            />);
                                        }
                                        break;
                                    }
                                    case 'comments': {
                                        const filteredComment = comments.filter(comment => (
                                            comment.serverKey === child.childId
                                        ));


                                        if (filteredComment[0] !== undefined) {
                                            return (


                                                <CommentItem
                                                    ref={filteredComment[0].text}
                                                    parentId={this.props.parentId}
                                                    parentType={this.props.parentType}
                                                    comment={filteredComment[0]}
                                                    commentId={child.childId}
                                                    key={child.childId}
                                                    handler={this.onToggleHandler}
                                                />

                                            );
                                        }
                                        break;
                                    }
                                    default:
                                        break;
                                    }

                                    return null;
                                })}
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>
                </div>
            );
        }
        return (<div />);
    }
}

function mapStateToProps(state) {
    const { comments, todos } = state;
    return { comments, todos };
}


MapChildren.propTypes = {
    parentId: PropTypes.string.isRequired,
    parentType: PropTypes.object.isRequired,
    children: PropTypes.arrayOf(PropTypes.shape({
        childId: PropTypes.string.isRequired,
        childType: PropTypes.string.isRequired,
    })),
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
};

MapChildren.defaultProps = {
    children: [],
    comments: [],
    todos: [],
};


export default connect(mapStateToProps, { addChildren })(MapChildren);
