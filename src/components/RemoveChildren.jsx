import React, { Component } from 'react';
import { topicRef, commentRef, todoRef, databaseRef } from '../firebase';
import { connect } from 'react-redux';

class RemoveChildren extends Component {

    removeChildren(children, parent) {
        const {parentServerkey, reference} = this.props; 
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
                reference.child(serverKey).update({ children: null });
            }
            databaseRef(child.childType).child(filteredItem[0].serverKey).remove();
        });
    }


    render(){
        const {children} = this.props;
        this.removeChildren(children, null);
        return(
            ''
        );
    }
}


function mapStateToProps(state) {
    const {
        topics,comments, todos,
    } = state;

    return {
        topics, todos, comments,
    };
}

export default connect(mapStateToProps, null)( RemoveChildren );