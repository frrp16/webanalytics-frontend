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
import { addNewTrainingModel, trainingModel, predict } from "@/services/prediction.service";
import { useMaterialTailwindController } from "@/context";
import { EyeIcon, EyeSlashIcon, ChevronDoubleDownIcon, InformationCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert, Backdrop } from "@mui/material";
import Select from 'react-select';

export function PredicModelDialog({ open, onClose, selectedDataset, selectedModel }) {
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
    const [dataFromNewData, setDataFromNewData] = React.useState(false);
    const [dataFromFile, setDataFromFile] = React.useState(false);

    const lastMonitorLog = selectedDataset ? selectedDataset.value.monitor_log.slice(-1) : [];
    // const features = selectedModel ? (selectedModel?.value?.features.replace(/'/g, '"').split(",")) : [];
    const [data, setData] = React.useState({});
    const [file, setFile] = React.useState(null);

    const handleSubmitPrediction = async () => {
        try {
            setLoading(true);
            const response = await predict(selectedModel?.value?.id, data, accessToken);
            if (response.status === 200) {
                setShowSnackbar(true);
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
        console.log(data)
    }
    , [data]);

    useEffect(() => {
        setData({})
    }
    , [selectedModel]);

    useEffect(() => {
        if (dataFromNewData) {
            setData(lastMonitorLog[0]?.changes?.added_rows)
        }
        else {
            setData({})
        }
    }
    , [dataFromNewData]);

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
                Prediction Data Success!
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
                Prediction Failed!
            </Alert>      
        </Snackbar>           
        <Dialog size="sm" open={open} onClose={onClose} className="p-4 max-w-screen max-h-screen overflow-auto">
        <DialogHeader onClose={onClose} className="justify-center">
            <Typography                
                className="font-semibold text-xl"
            >{`Predict model ${selectedModel?.label} on ${selectedDataset?.label}`}
            </Typography>
        </DialogHeader>
        <DialogBody className="overflow-auto">
            {/* Create input with menu */}
            <form onSubmit={handleSubmitPrediction}>  
                <div className="overflow-auto no-scrollbar flex flex-col gap-6 w-full pt-2">
                    <div className="mx-1"> 
                        <Switch
                            checked={dataFromNewData}
                            disabled={lastMonitorLog[0]?.changes?.added_rows?.length == 0}
                            onChange={(e) => {
                                setDataFromNewData(e.target.checked)
                            }}
                            label={
                                <Typography
                                    variant="small"                                    
                                    className="flex items-center justify-start font-medium"
                                >
                                    Use data from new data
                                </Typography>
                            }
                        />
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            {lastMonitorLog[0]?.changes?.added_rows?.length > 0 ? "New data available" : "No new data available"}
                        </Typography>
                    </div> 
                    <div className="mx-1"> 
                        <Switch
                            checked={dataFromFile}
                            onChange={(e) => setDataFromFile(e.target.checked)}
                            label={
                                <Typography
                                    variant="small"                                    
                                    className="flex items-center justify-start font-medium"
                                >
                                    Use data from file
                                </Typography>
                            }
                        />
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            Use data from a file to predict the model
                        </Typography>
                    </div>    
                    <div>
                        <div className="pb-2">
                            <Typography
                                variant="small"
                                className="font-semibold text-sm"
                            >
                                Features
                            </Typography>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {selectedModel && selectedModel?.value?.features.map((feature) => {
                                return (
                                    <div key={feature} className="w-full overflow-x-clip">
                                        <Input
                                            disabled={dataFromNewData || dataFromFile}
                                            onChange={(e) => {
                                                setData(prevState => ({...prevState, [feature]: e.target.value}));
                                            }}
                                            label={feature}
                                            required
                                                                                                                         
                                        />  
                                        <Typography
                                            variant="small"                            
                                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                                        >
                                            <InformationCircleIcon className="h-4 w-4" />
                                            {feature} value
                                        </Typography>
                                    </div> 
                                )
                            })
                            }                                            
                            {/* <div>
                                <Input
                                    onChange={(e) => {                            
                                        // setTrainModel(prevState => ({...prevState, sample_frac: e.target.value}));
                                        // setTrainModel(prevState => ({...prevState, model: selectedModel?.value?.id}));
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
                            </div>   */}
                        </div>
                    </div>
                    <div>
                        <div className="mb-2">
                            <Typography
                                variant="small"
                                className="font-semibold text-sm"
                            >
                                Target
                            </Typography>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {selectedModel && selectedModel?.value?.target.map((target) => {
                                return (
                                    <div key={target} className="w-full">
                                        <Input
                                            disabled={dataFromNewData || dataFromFile}
                                            onChange={(e) => { 
                                                setData(prevState => ({...prevState, [target]: e.target.value}));
                                            }}
                                            label={target}
                                            
                                        />
                                        <Typography
                                            variant="small"
                                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                                        >
                                            <InformationCircleIcon className="h-4 w-4" />
                                            {target} target value (optional).
                                        </Typography>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>

                    {/* <div className="w-full">
                            <Select
                                onChange={(e) => {
                                    // setTrainModel(prevState => ({...prevState, scaler: e.value}));
                                    // setTrainModel(prevState => ({...prevState, model: selectedModel?.value?.id}));
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
                        </div>                   */}
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
                            checked={dataFromNewData}
                            onChange={(e) => setDataFromNewData(e.target.checked)}
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
            {/* {(trainModel?.features?.length != selectedModel?.value?.input_shape || trainModel?.target?.length != selectedModel?.value?.output_shape) &&
                <Typography
                variant="small"                            
                className="mt-2 flex gap-1 w-full font-semibold text-xs text-start"
            >
                <ExclamationCircleIcon className="h-4 w-4 text-red-300" />
                Please select the required number of features and target to train the model
            </Typography>} */}
            <div className="flex gap-4">
                <Button                                            
                    color="red"                
                    onClick={onClose}     
                    disabled={loading}     
                >
                    {loading ? "Loading..." : "Cancel" }          
                </Button>
                <Button 
                    type="submit"   
                    onClick={handleSubmitPrediction}
                    ripple="light"
                    disabled={loading 
                        // || (trainModel?.features?.length != selectedModel?.value?.input_shape || trainModel?.target?.length != selectedModel?.value?.output_shape)
                    }     
                    >
                        {loading ? "Loading..." : "Predict" }  
                </Button>
            </div>
        </DialogFooter>
        </Dialog>
    </>
    );
}

export default PredicModelDialog;