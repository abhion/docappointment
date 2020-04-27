import {createStore, combineReducers, applyMiddleware} from 'redux';
import { setLoggedInUserReducer, setLoggedInStatusReducer } from '../reducers/userReducer';
import specializationsReducer from '../reducers/specializationsReducer';
import doctorReducer, { doctorChatReducer } from '../reducers/doctorReducer';

import thunk from 'redux-thunk';
import { chatWidgetReducer } from '../reducers/chatReducer';

const configureStore = () => {
    const store = createStore(combineReducers({
        user: setLoggedInUserReducer,
        isLoggedIn: setLoggedInStatusReducer,
        specializations: specializationsReducer,
        selectedDoctor: doctorReducer,
        // searchResultDoctors: searchReducer,
        selectedDoctorForChat: doctorChatReducer,
        chatWidgetStatus: chatWidgetReducer
    }), applyMiddleware(thunk))
    return store;
} 

export default configureStore;