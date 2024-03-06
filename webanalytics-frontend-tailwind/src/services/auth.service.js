import axios from "axios";
import Cookies from "js-cookie";

const BASE_API_URL = "http://127.0.0.1:8000/";

export const login = async (username, password) => {         
    try {           
        const response = await axios.post(`${BASE_API_URL}login/`, {
            username,
            password
        });

        if (response.status === 200){
            Cookies.set(
                'accessToken', JSON.stringify(response.data.access),
                { expires: 1/2, secure: false, sameSite: 'lax'}
            )        
        }
        return response
    } catch (error) {
        console.error(error);
    }
};

export const register = async (first_name, last_name, username, email, password) => {
    try {                       
        const response = await axios.post(`${BASE_API_URL}register/`,{
            first_name, last_name, username, email, password
        })
        if (response.status === 200){
            Cookies.set(
                'accessToken', JSON.stringify(response.data.access),
                { expires: 1/2, secure: false, sameSite: 'lax'}
            )            
        }
        return response
    } catch (err){
        console.log(err)
    }
}

export const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userInfo');
    sessionStorage.clear()
};


export const getUserInfo = async (accessToken) => {
    try {
        const response = await axios.get(`${BASE_API_URL}users/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.status === 200){
            localStorage.setItem('userInfo', JSON.stringify(response.data))
        }
        return response;
    } catch (error) {
        console.error(error);
    }
}