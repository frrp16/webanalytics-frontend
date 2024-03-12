import axios from "axios";
// import { Readable } from 'stream';

const BASE_API_URL = 'http://127.0.0.1:8000/'

export const getNotifications = async (accessToken) => {
    const response = await axios.get(`${BASE_API_URL}notification/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}
