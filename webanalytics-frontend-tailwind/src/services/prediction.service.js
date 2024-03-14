import axios  from "axios";

const BASE_API_URL = 'http://127.0.0.1:8000/'

export const addNewTrainingModel = async (newTrainingModel, accessToken) => {
    console.log(newTrainingModel);
    const response = await axios.post(`${BASE_API_URL}mlmodel/`, {
        ...newTrainingModel      
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const deleteTrainingModel = async (model_id, accessToken) => {
    const response = await axios.delete(`${BASE_API_URL}mlmodel/${model_id}/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const trainingModel = async (trainModel, accessToken) => {
    const response = await axios.post(`${BASE_API_URL}mlmodel/train/`, {
        ...trainModel
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const getTrainingModels = async (dataset_id, accessToken) => {
    const response = await axios.get(`${BASE_API_URL}mlmodel/dataset/${dataset_id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const updateModel = async (model_id, data, accessToken) => {
    const response = await axios.patch(`${BASE_API_URL}mlmodel/${model_id}/update/`, {
        ...data
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }   
    });
    return response;
}

export const predict = async (model_id, data, accessToken) => {
    const response = await axios.post(`${BASE_API_URL}mlmodel/${model_id}/predict/`, {
        data
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}