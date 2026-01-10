import axios from 'axios';

const api = axios.create({
    baseURL: 'https://admin.jeevanshaili.com/api',
});

export default api;
