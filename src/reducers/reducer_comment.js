import { ADD_COMMENT } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
    case ADD_COMMENT: {
        const { comments } = action;
        return comments;
    }
    default:
        return state;
    }
};
