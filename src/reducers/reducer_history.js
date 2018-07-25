import { ADD_HISTORY } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
    case ADD_HISTORY: {
        const { history } = action;
        return history;
    }
    default:
        return state;
    }
};
