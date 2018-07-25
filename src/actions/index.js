import {
    SIGNED_IN, ADD_TOPIC, ADD_COMMENT, ADD_TODO,
    ADD_CHILDREN, ADD_ACTIVE_TAB, ADD_HISTORY, ADD_BACK_TO_COMMENT,
} from '../constants';


export function logUser(email) {
    const action = {
        type: SIGNED_IN,
        email,
    };
    return action;
}

export function addTopics(topics) {
    const action = {
        type: ADD_TOPIC,
        topics,
    };
    return action;
}

export function addTodos(todos) {
    const action = {
        type: ADD_TODO,
        todos,
    };
    return action;
}

export function addChildren(childrenFromDb) {
    const action = {
        type: ADD_CHILDREN,
        childrenFromDb,
    };
    return action;
}


export function addComments(comments) {
    const action = {
        type: ADD_COMMENT,
        comments,
    };
    return action;
}

export function addActiveTab(activeTab) {
    const action = {
        type: ADD_ACTIVE_TAB,
        activeTab,
    };
    return action;
}

export function addHistory(history) {
    const action = {
        type: ADD_HISTORY,
        history,
    };
    return action;
}

export function addBackToComment(backToComment) {
    const action = {
        type: ADD_BACK_TO_COMMENT,
        backToComment,
    };
    return action;
}
