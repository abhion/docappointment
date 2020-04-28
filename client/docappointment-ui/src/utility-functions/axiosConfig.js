import axios from 'axios';

const instance = axios.create({
   
    // baseURL: 'http://localhost:3038/'
    baseURL: 'https://book-adoc.herokuapp.com/'
});

export default instance;