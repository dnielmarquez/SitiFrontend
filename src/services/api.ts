// services/api.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://3.145.178.68/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;
