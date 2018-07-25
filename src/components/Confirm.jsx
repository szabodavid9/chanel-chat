import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Glyphicon, Button, Modal } from 'react-bootstrap';

class Confirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleAction() {
        this.props.action();
        this.handleClose();
    }

    render() {
        const { actionType } = this.props;
        let actionButton = null;
        switch (actionType) {
        case 'removeTopic':
            actionButton = (
                <Button bsStyle="danger" bsSize="small" onClick={this.handleShow}>
                    <Glyphicon glyph="remove" />
                </Button>);
            break;
        case 'saveChanges':
            actionButton = (
                <Button bsStyle="success" bsSize="small" onClick={this.handleShow}>
                                    Save changes
                </Button>);
            break;
        case 'removeComp':
            actionButton = (
                <Button bsStyle="link" bsSize="sm" onClick={this.handleShow}>
                                    Remove
                </Button>);
            break;

        default:
            break;
        }
        return (
            <div className="vas">
                {actionButton}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm your action </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure, you wanna continue this action???
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        <Button onClick={() => this.handleAction()}>Yes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Confirm;

Confirm.propTypes = {
    action: PropTypes.func.isRequired,
    actionType: PropTypes.string.isRequired,
};


