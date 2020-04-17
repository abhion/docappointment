import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import {startGetSpecializations} from './actions/specializationsAction';

const store = configureStore();

store.dispatch(startGetSpecializations());

store.subscribe(_=>console.log(store.getState(), "SUBSC"))

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Route path="/" component={App} />
    </Provider>

  </BrowserRouter>,
  document.getElementById('root')
);
