// services/api.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://mputmblkchain.online/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;
