import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
// import scrollToComponent from 'react-scroll-to-component';
import { Panel, Button } from 'react-bootstrap';
import { addBackToComment } from '../actions';
import { commentRef, databaseRef } from '../firebase';
import ConvertToToDo from './ConvertToToDo';
import AddComment from './AddComment';
import MapChildren from './MapChildren';
import Confirm from './Confirm';
import Highlight from 'react-highlight';

class CommentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCom: false,
            error: '',
            edit: false,
            newText: this.props.comment.text,
        };
    }
    // componentDidMount() {
    //     if (this.props.backToComment.length !== 0) {
    //         this.props.handler();
    //         this.goToComponentByRef();
    //     }
    // }
    // componentDidUpdate() {
    //     if (this.props.backToComment.length !== 0) {
    //         this.props.handler();
    //         this.goToComponentByRef();
    //     }
    // }

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
                databaseRef(parentType).child(parentId).update({
                    children: newParentChildren,
                });
            } else {
                commentRef.child(this.props.commentId).update({ children: null });
            }
            databaseRef(child.childType).child(filteredItem[0].serverKey).remove();
        });
    }

    removeComment() {
        const {
            parentId, commentId, parentType,
        } = this.props;
        const { children } = this.props.comment;
        let newChildren = null;

        // Remove all children

        if (children !== undefined) {
            this.removeChildren(children, null);
        }

        // Remove comment form the parent
        parentType.child(parentId).on('value', (snap) => {
            if (snap.val() === null) { return; }
            if (snap.val().children !== undefined) {
                newChildren = snap.val().children;
                newChildren = newChildren.filter(child => (child.childId !== commentId));
                parentType.child(parentId).update({ children: newChildren });

                // Remove comment form the database
                commentRef.child(commentId).remove();
            }
        });
    }

    addNewCom() {
        this.setState({
            newCom: true,
        });
    }

    editComment() {
        this.setState({
            edit: !this.state.edit,
        });
    }

    updateComment() {
        const { commentId } = this.props;
        const { newText } = this.state;
        const editedAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        commentRef.child(commentId).update({ text: newText, editedAt });
    }

    // goToComponentByRef() {
    //     for (const ref in this.refs) {
    //         if (ref === this.props.backToComment) {
    //             scrollToComponent(
    //                 this.refs[ref],
    //                 {
    //                     offset: 0, align: 'top', duration: 500, ease: 'inCirc',
    //                 },
    //             );
    //         }
    //         this.props.addBackToComment('');
    //     }
    // }

    render() {
        const { comment, commentId } = this.props;
        const newCommentId = commentId.replace('-', '');
        const { newCom, edit, newText } = this.state;
      
        //console.log(comment.codeText);

        
        return (
            <div  ref={commentId} >
                <Panel>
                    <Panel.Body className="comment-con">

                        {
                            (edit)
                                ?
                                    <div>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={newText}
                                            onChange={event => this.setState({
                                                newText: event.target.value,
                                            })}
                                        />
                                        <Confirm
                                            action={() => {
                                                this.updateComment();
                                                this.editComment();
                                            }}
                                            actionType="saveChanges"
                                        />
                                    </div>
                                :
                                    <div className="comment-unit">
                                        <div className="comment-text-con">
                                            <p className="comment-text">{comment.text} </p>
                                            {
                                                
                                                (comment.codeText !== '') 
                                                ? <Highlight language="javascript">
                                                    {comment.codeText}
                                                  </Highlight>
                                                : ''
                                            }
                                            
                                            <img className="comment-img" src={comment.selectedFile} alt=""/> 
                                        </div>

                                        <div className="comment-author-con">
                                            <p>by <em>{comment.email}</em> <br />
                                                at {comment.dateStamp}
                                            </p>
                                            {(comment.editedAt !== undefined) ?
                                                <p>edited at {comment.editedAt}</p>
                                                : ''}

                                        </div>
                                    </div>
                        }

                        <Button bsStyle="link" bsSize="sm" onClick={() => this.addNewCom()}>
                            Reply
                        </Button>

                        {
                            newCom ?
                                <div className="new-comment">
                                    <AddComment
                                        parentType={commentRef}
                                        parentId={this.props.commentId}
                                        nested
                                    />
                                </div>

                                : ''
                        }

                        {

                            (this.props.user.email === comment.email)
                                ?
                                    <span>
                                        <Confirm
                                            action={() => { this.removeComment(); }}
                                            actionType="removeComp"
                                        />

                                        <Button bsStyle="link" bsSize="sm" onClick={() => this.editComment()}>
                                        Edit
                                        </Button>
                                    </span>
                                : ''
                        }


                        <strong>{this.state.error}</strong>
                        <ConvertToToDo
                            text={comment.text}
                            parentId={this.props.commentId}
                            parentType={commentRef}
                        />
                        <div className="nested-children">
                            <MapChildren
                                parentId={this.props.commentId}
                                parentType={commentRef}
                                children={comment.children}
                            />
                        </div>
                    </Panel.Body>
                </Panel>


            </div>
        );
    }
}
function mapStateToProps(state) {
    const {
        user, comments, todos, params, backToComment,
    } = state;
    return {
        user, comments, todos, params, backToComment,
    };
}

CommentItem.propTypes = {
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
    // backToComment: PropTypes.string,
    // handler: PropTypes.func.isRequired,
    comment: PropTypes.shape({
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
    }).isRequired,
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
    parentId: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    parentType: PropTypes.object.isRequired,
    // addBackToComment: PropTypes.func.isRequired,
    user: PropTypes.shape({
        email: PropTypes.string.isRequired,
    }).isRequired,
};

CommentItem.defaultProps = {
    comments: [],
    todos: [],
};

export default connect(mapStateToProps, { addBackToComment })(CommentItem);


