import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { todoRef } from '../firebase';

class ConvertToToDo extends Component {
    convert() {
        const { text, parentId, parentType } = this.props;
        const parentKey = parentType.key;
        const description = text;
        const { email } = this.props.user;
        const dateStamp = moment().format('MMMM Do YYYY, h:mm:ss a');
        const completed = false;
        const createdTodo = todoRef.push({
            description, email, parentId, parentType: parentKey, dateStamp, completed,
        });

        // add to-do as a child to parentType
        let newChildren = null;
        let newChild = null;

        parentType.child(parentId).on('value', (snap) => {
            newChild = { childId: createdTodo.key, childType: todoRef.key };
            // if its first child
            if (snap.val() !== null) { if ((snap.val().children === undefined) || (snap.val().children[0] === '')) { newChildren = [newChild]; } else { newChildren = [...snap.val().children, newChild]; } }
        });
        const children = newChildren;

        parentType.child(parentId).update({ children });
    }

    render() {
        return (
            <Button bsStyle="link" bsSize="sm" onClick={() => this.convert()}>
                Convert to to-do
            </Button>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return { user };
}

ConvertToToDo.propTypes = {
    user: PropTypes.object,
    parentId: PropTypes.string,
    parentType: PropTypes.object,
    text: PropTypes.string,
};

ConvertToToDo.defaultProps = {
    user: null,
    parentId: null,
    parentType: null,
    text: PropTypes.string,
};


export default connect(mapStateToProps, null)(ConvertToToDo);
