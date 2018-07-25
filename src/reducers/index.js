import { combineReducers } from 'redux';
import user from './reducer_user';
import topics from './reducer_topic';
import comments from './reducer_comment';
import todos from './reducer_todo';
import activeTab from './reducer_active_tab';
import history from './reducer_history';
import backToComment from './reducer_back_to_comment';

export default combineReducers({
    user,
    topics,
    comments,
    todos,
    activeTab,
    history,
    backToComment,
});

