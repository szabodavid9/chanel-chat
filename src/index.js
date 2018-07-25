import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import RouterApp from './components/RouterApp';


const middleware = applyMiddleware(createLogger());
const store = createStore(reducer, middleware);

ReactDOM.render(
    <Provider store={store}>
        <RouterApp />
    </Provider>,
    document.getElementById('root'),
);
