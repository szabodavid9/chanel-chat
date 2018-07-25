import { ADD_TOPIC } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
    case ADD_TOPIC: {
        const { topics } = action;
        return topics;
    }
    default:
        return state;
    }
};
