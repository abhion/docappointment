import axios from '../utility-functions/axiosConfig';

const instance = axios.create({
   
    baseURL: 'https://book-adoc.herokuapp.com/'
});

export default instance;