import axios from "axios";
// import { Readable } from 'stream';

const BASE_API_URL = 'http://127.0.0.1:8000/'

export const createDataset = async (newDataset, accessToken) => {
    const response = await axios.post(`${BASE_API_URL}dataset/`, {
        name: newDataset.name,
        description: newDataset.description,
        table_name: newDataset.table_name
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const updateDataset = async (datasetId, dataset, accessToken) => {
    const response = await axios.patch(`${BASE_API_URL}dataset/${datasetId}/`, {
        ...dataset
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const getDatasetColumns = async (datasetId, accessToken) => {
    const response = await axios.get(`${BASE_API_URL}dataset/${datasetId}/columns/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const getDatasetColumnsType = async (datasetId, accessToken) =>{
    const response = await axios.get(`${BASE_API_URL}dataset/${datasetId}/columns_type/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;

}

export const getDatasetData = async (datasetId, accessToken, page = 1, page_size = 50, order = false, asc = false, columns = []) => {
    console.log('getDatasetData', datasetId, page, page_size, order, asc, columns);
    const response = await axios.get(`${BASE_API_URL}dataset/${datasetId}/data/`, {        
        params: {
            'page': page, 
            'page_size': page_size, 
            'order': order, 
            'asc': asc.toString(),
            'column': columns
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const getPreviosNextPage = async (url, accessToken) => {
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}


export const refreshDataset = async (datasetId, accessToken) => {
    const response = await axios.get(`${BASE_API_URL}dataset/${datasetId}/refresh/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}