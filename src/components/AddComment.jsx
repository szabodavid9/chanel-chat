import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { commentRef } from '../firebase';
// import * from 'blob-util';
import { canvasToBlob, arrayBufferToBlob } from 'blob-util';
import {imgSrcToBlob } from 'blob-util';
import {Button} from 'react-bootstrap';

class Addcomment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            codeText: '',
            selectedFile: null,
            code: false
        };
    }

    createComment() {
       
        const { text,codeText,selectedFile, code } = this.state;
        const { email } = this.props.user;
        const { parentId, parentType } = this.props;
        const parentKey = parentType.key;
        const dateStamp = moment().format('MMMM Do YYYY, h:mm:ss a');
        let children = [];
        //console.log(selectedFile);
        const createdComment = commentRef.push({
            codeText,text, email, parentId, parentType: parentKey, dateStamp, children, selectedFile
        });

        // Add the new comment to the parent
        let newChildren = null;
        let newChild = null;


        parentType.child(parentId).on('value', (snap) => {
            if (snap.val() === null) { return; }
            newChild = { childId: createdComment.key, childType: commentRef.key };
            // if its first child
            if ((snap.val().children === undefined) || snap.val().children[0] === '') { newChildren = [newChild]; } else { newChildren = [...snap.val().children, newChild]; }
        });
        children = newChildren;

        parentType.child(parentId).update({ children });

        this.myNewComment.value = '';
        if (code){
        this.codeArea.value = '';
        }
        this.imgUpload.value = "";
        this.setState({
            selectedFile : null
        })
    }

    fileChangedHandler = (event) => {
        
        var file = event.target.files[0];
        var FR= new FileReader();
        
        FR.addEventListener("load", (e) => {
            this.setState({selectedFile: e.target.result });
        }); 
        
        if (file !== undefined){
            FR.readAsDataURL( file );
        }
    }
      
    
    onChange = (event) => {
        //console.log('juhe', event.target.checked);
        this.setState({ code: event.target.checked });
    }

    render() {
        const { code } = this.state;
        console.log('code',code);
        return (
            <div>
                <input
                    className="form-control"
                    type="text"
                    placeholder="Leave some comment here..."
                    onChange={event => this.setState({ text: event.target.value })}
                    onKeyPress={(event) => {
                            if (!code){
                                if ( event.key === 'Enter') {
                                    this.createComment();
                                }
                            }
                    }}
                    ref={(ref) => { this.myNewComment = ref; }}
                />
                {
                    code 
                        ? 
                            <div>
                                <textarea 
                                    className="form-control" 
                                    id="" 
                                    cols="30" 
                                    rows="7"
                                    placeholder="Leave some code here..."
                                    onChange={event => this.setState({ codeText: event.target.value })}
                                    ref={(ref) => { this.codeArea = ref; }}
                                >
                                </textarea>
                                <Button bsStyle="success" bsSize="small" onClick={() =>{this.createComment()}}>
                                    Save 
                                </Button>
                            </div>
                        : ''
                }

                <input ref={(ref) => { this.imgUpload = ref; }} className="img-upload" type="file" onChange={this.fileChangedHandler}/>
                <input id="code" type="checkbox"  onChange={this.onChange} />
                {/* <input type="checkbox" /> */}
                <label htmlFor="code"> Wanna add some code, to highlight? </label>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return { user };
}


Addcomment.propTypes = {
    parentId: PropTypes.string,
    parentType: PropTypes.object,
    user: PropTypes.object,
};

Addcomment.defaultProps = {
    parentId: null,
    parentType: null,
    user: null,
};

export default connect(mapStateToProps, null)(Addcomment);
