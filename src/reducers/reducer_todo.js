import { ADD_TODO } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
    case ADD_TODO: {
        const { todos } = action;
        return todos;
    }
    default:
        return state;
    }
};
