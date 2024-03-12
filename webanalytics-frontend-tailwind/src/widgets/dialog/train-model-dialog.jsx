import React, { useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Menu, MenuItem, MenuButton, MenuHandler, MenuList,
    Input,
    Checkbox, Switch,
    Typography,
  } from "@material-tailwind/react";

import { getUserInfo } from "@/services/auth.service";
import { addNewTrainingModel, trainingModel } from "@/services/prediction.service";
import { useMaterialTailwindController } from "@/context";
import { EyeIcon, EyeSlashIcon, ChevronDoubleDownIcon, InformationCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert, Backdrop } from "@mui/material";
import Select from 'react-select';

export function TrainModelDialog({ open, onClose, selectedDataset, selectedModel }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken } = controller;

    const [trainModel, setTrainModel] = React.useState({
        dataset: selectedDataset?.value?.id,
        scaler: null,
        sample_frac: 0.8,
        sample_size: null,
        
    });    

    const [loading, setLoading] = React.useState(false);    
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [advanceOptions, setAdvanceOptions] = React.useState(false);
    

    const handleSubmitTrainModel = async () => {
        try {
            setTrainModel(prevState => ({...prevState, model: selectedModel?.value?.id}));
            // if sample_frac == "", set to 0.8
            if (trainModel.sample_frac == "") {
                setTrainModel(prevState => ({...prevState, sample_frac: 0.8}));
            }
            setLoading(true);
            const res = await trainingModel(trainModel, accessToken);
            if (res.status == 201 || res.status == 200) {
                const resUserInfo = await getUserInfo(accessToken);  
                if (resUserInfo.status === 200){
                    setLoading(false);
                    setShowSnackbar(true);
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    window.location.reload();    
                }  
            }
        } catch (error) {
            console.error(error);   
            setShowError(true);         
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log(trainModel);
    }
    , [trainModel]);

    return (
    <>
        <Snackbar
            sx={{ zIndex: 10000 }}
            open={showSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={5000}
            onClose={() => {
                setShowSnackbar(false);
                window.location.reload();
            }}
        >
            {/* success alert */}
            <Alert
                onClose={() => {
                    setShowSnackbar(false);
                    window.location.reload();
                }}
                severity="success"
                variant="filled"
            >
                Sending model to train...
            </Alert>
        </Snackbar>   
        {/* Error Snackbar */}
        <Snackbar
            sx={{ zIndex: 10000 }}
            open={showError}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={5000}
            onClose={() =>{
                setShowError(false);             
            }}
            >      
            <Alert
                onClose={() =>{
                    setShowError(false);                
                }}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                Model Creation Failed!
            </Alert>      
        </Snackbar>           
        <Dialog size="sm" open={open} onClose={onClose} className="p-4 max-w-screen max-h-screen overflow-auto">
        <DialogHeader onClose={onClose} className="justify-center">
            <Typography                
                className="font-semibold text-xl"
            >{`Train model ${selectedModel?.label} on ${selectedDataset?.label}`}
            </Typography>
        </DialogHeader>
        <DialogBody className="overflow-auto">
            {/* Create input with menu */}
            <form onSubmit={handleSubmitTrainModel}>  
                <div className="overflow-auto no-scrollbar flex flex-col gap-6 w-full pt-2">   
                    <div>
                        <Select
                            onChange={(e) => {
                                const selectedFeatures = e.map((feature) => feature.value);
                                setTrainModel(prevState => ({...prevState, model: selectedModel?.value?.id}));
                                setTrainModel(prevState => ({...prevState, features: selectedFeatures}));
                            }}
                            className="w-full border rounded text-sm font-normal text-blue-gray-500"
                            placeholder="Features to use"
                            required    
                            isMulti                            
                            options={ 
                                trainModel?.features?.length >= selectedModel?.value?.input_shape ? [] :
                                selectedDataset?.value?.columns.map((col) => {
                                return {
                                    value: col,
                                    label: col.column
                                }
                                }
                            )}
                            noOptionsMessage={() => {
                                return trainModel?.features?.length >= selectedModel?.value?.output_shape ?
                                "Maximum columns selected" :
                                "No column available"
                            }}
                            
                        />    
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            Current model must have {selectedModel?.value?.input_shape} input features to train
                        </Typography>
                    </div>    
                    <div>
                        <Select
                            onChange={(e) => {
                                const selectedFeatures = e.map((feature) => feature.value);
                                setTrainModel(prevState => ({...prevState, target: selectedFeatures}));
                                setTrainModel(prevState => ({...prevState, model: selectedModel?.value?.id}));
                            }}
                            className="w-full max-h-[200px] border rounded text-sm font-normal text-blue-gray-500"
                            placeholder="Target to predict"
                            required    
                            isMulti                            
                            options={
                                trainModel?.target?.length >= selectedModel?.value?.output_shape ? [] :
                                selectedDataset?.value?.columns
                                    .filter(col => {
                                        if (selectedModel?.value?.task == "Regression") {
                                            return col.type == "float64" || col.type == "int64";
                                        } else if (selectedModel?.value?.task == "Classification" || selectedModel?.value?.task == "Binary") {
                                            return col.type == "object" || col.type == "bool";
                                        } else {
                                            return true;
                                        }
                                    })
                                    .map((col) => {                                  
                                        return {
                                            value: col,
                                            label: col.column
                                        }
                                })}
                            noOptionsMessage={() => {
                                return trainModel?.target?.length >= selectedModel?.value?.output_shape ?
                                "Maximum columns selected" :
                                "No column available"
                            }}
                        />    
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            Current model is {selectedModel?.value?.task} task, and must have {selectedModel?.value?.output_shape} target to train
                        </Typography>
                    </div>                                                                                                                             
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                onChange={(e) => {                            
                                    setTrainModel(prevState => ({...prevState, sample_size: e.target.value}));
                                    setTrainModel(prevState => ({...prevState, model: selectedModel?.value?.id}));
                                }}
                                label="Training data size. Ex: 1000"   
                                                 
                            />   
                            <Typography
                                variant="small"                            
                                className="mt-2 flex items-center gap-1 font-normal text-xs"
                            >
                                <InformationCircleIcon className="h-4 w-4" />
                                Leave empty to use sample fraction.
                                
                            </Typography>
                        </div>
                        <div>
                            <Input
                                onChange={(e) => {                            
                                    setTrainModel(prevState => ({...prevState, sample_frac: e.target.value}));
                                    setTrainModel(prevState => ({...prevState, model: selectedModel?.value?.id}));
                                }}
                                label="Training data fraction. Ex: 0.8"                           
                            />   
                            <Typography
                                variant="small"                            
                                className="mt-2 flex items-center gap-1 font-normal text-xs"
                            >
                                <InformationCircleIcon className="h-4 w-4" />
                                Leave empty to use 80% of the data.
                                
                            </Typography>
                        </div>  
                    </div>
                    <div className="w-full">
                            <Select
                                onChange={(e) => {
                                    setTrainModel(prevState => ({...prevState, scaler: e.value}));
                                    setTrainModel(prevState => ({...prevState, model: selectedModel?.value?.id}));
                                }}
                                className="text-sm font-normal text-blue-gray-500"
                                placeholder="Scaler"                              
                                options={
                                    [   
                                        { value: null, label: "-- None --" },
                                        { value: "StandardScaler", label: "Standard Scaler" },
                                        { value: "MinMaxScaler", label: "Min Max Scaler" },
                                    ]                               
                                }                                                                                                                                   
                            />   
                            <Typography
                                variant="small"                            
                                className="mt-2 flex gap-1 font-normal text-xs"
                            >
                                <InformationCircleIcon className="h-4 w-4" />
                                Scaler to use for the data. Leave empty to not use any scaler
                            </Typography>
                        </div>                  
                    {/* <div>
                        <Input
                            onChange={(e) => {
                                
                            }}
                            label="Input shape"
                            required   
                            type="number"                                                                                 
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            This would be the number of features that the model would take as input
                        </Typography>
                    </div>    */}

                    {/* <div className="mx-2"> 
                        <Switch
                            checked={advanceOptions}
                            onChange={(e) => setAdvanceOptions(e.target.checked)}
                            label={
                                <Typography
                                    variant="small"                                    
                                    className="flex items-center justify-start font-medium"
                                >
                                    Advance Options
                                </Typography>
                            }
                        />  
                    </div>                                                                                                                                                                             */}
                </div>   
            </form>                  
        </DialogBody>
        <DialogFooter className="flex gap-4">
            {(trainModel?.features?.length != selectedModel?.value?.input_shape || trainModel?.target?.length != selectedModel?.value?.output_shape) &&
                <Typography
                variant="small"                            
                className="mt-2 flex gap-1 w-full font-semibold text-xs text-start"
            >
                <ExclamationCircleIcon className="h-4 w-4 text-red-300" />
                Please select the required number of features and target to train the model
            </Typography>}
            <div  className="flex gap-4">
                <Button                                            
                    color="red"                
                    onClick={onClose}     
                    disabled={loading}     
                >
                    {loading ? "Loading..." : "Cancel" }          
                </Button>
                <Button 
                    type="submit"   
                    onClick={handleSubmitTrainModel}
                    ripple="light"
                    disabled={loading || 
                        (trainModel?.features?.length != selectedModel?.value?.input_shape || trainModel?.target?.length != selectedModel?.value?.output_shape)}     
                    >
                        {loading ? "Loading..." : "Save" }  
                </Button>
            </div>
        </DialogFooter>
        </Dialog>
    </>
    );
}

export default TrainModelDialog;