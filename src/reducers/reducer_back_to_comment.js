import { ADD_BACK_TO_COMMENT } from '../constants';

export default (state = '', action) => {
    switch (action.type) {
    case ADD_BACK_TO_COMMENT: {
        const { backToComment } = action;
        return backToComment;
    }
    default:
        return state;
    }
};
