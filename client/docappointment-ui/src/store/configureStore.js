import {createStore, combineReducers, applyMiddleware} from 'redux';
import { setLoggedInUserReducer, setLoggedInStatusReducer } from '../reducers/userReducer';
import specializationsReducer from '../reducers/specializationsReducer';
import doctorReducer from '../reducers/doctorReducer';

import thunk from 'redux-thunk';

const configureStore = () => {
    const store = createStore(combineReducers({
        user: setLoggedInUserReducer,
        isLoggedIn: setLoggedInStatusReducer,
        specializations: specializationsReducer,
        selectedDoctor: doctorReducer
    }), applyMiddleware(thunk))
    return store;
} 

export default configureStore;