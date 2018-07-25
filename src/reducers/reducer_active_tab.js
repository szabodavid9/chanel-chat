import { ADD_ACTIVE_TAB } from '../constants';

export default (state = [], action) => {
    switch (action.type) {
    case ADD_ACTIVE_TAB: {
        const { activeTab } = action;
        return activeTab;
    }
    default:
        return state;
    }
};
