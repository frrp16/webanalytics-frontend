import axios from "axios";

const BASE_API_URL = 'http://127.0.0.1:8000/'

export const createConnection = async (newDatabaseConnection, accessToken) => {
    const response = await axios.post(`${BASE_API_URL}connection/`, {
        database_type: newDatabaseConnection.database_type,
        host: newDatabaseConnection.host,
        database: newDatabaseConnection.database,
        port: newDatabaseConnection.port,
        username: newDatabaseConnection.username,
        password: newDatabaseConnection.password,
        ssl: newDatabaseConnection.ssl
    },    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}