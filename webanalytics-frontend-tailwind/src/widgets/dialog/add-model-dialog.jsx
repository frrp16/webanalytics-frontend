import React, { useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Menu, MenuItem, MenuButton, MenuHandler, MenuList,
    Input,
    Checkbox,
    Typography,
  } from "@material-tailwind/react";

import { getUserInfo } from "@/services/auth.service";
import { createDataset, updateDataset } from "@/services/dataset.service";
import { useMaterialTailwindController } from "@/context";
import { EyeIcon, EyeSlashIcon, ChevronDoubleDownIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert, Backdrop } from "@mui/material";
import Select from 'react-select';

export function AddModelDialog({ open, onClose, selectedDataset }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken } = controller;

    const [newModel, setNewModel] = React.useState({});    

    const [loading, setLoading] = React.useState(false);    
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    

    const handleSubmitModel = async (e) => {}

    return (
    <>
        <Snackbar
            sx={{ zIndex: 10000 }}
            open={showSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={5000}
            onClose={() => setShowSnackbar(false)}
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
                Model Created Successfully!
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
        <Dialog size="sm" open={open} onClose={onClose} className="p-4 max-w-screen overflow-auto">
        <DialogHeader onClose={onClose} className="justify-center">
            {`Add new deep learning model for ${selectedDataset.value.name}`}</DialogHeader>
        <DialogBody className="overflow-auto">
            {/* Create input with menu */}
            <form onSubmit={handleSubmitModel}>  
                <div className="overflow-auto no-scrollbar flex flex-col gap-6 w-full pt-2">                    
                    <div>
                        <Select
                            onChange={(e) => setNewModel(prevState => ({...prevState, algorithm: e.value}))}
                            className="w-full border rounded text-sm font-normal text-blue-gray-500"
                            placeholder="Algorithm"
                            required    
                            options={
                                [
                                    { value: 'MLP', label: 'Multilayer Perceptron' },
                                    { value: 'LSTM', label: 'Long Short-Term Memory' },
                                    { value: 'CNN', label: 'Convolutional Neural Network' },                                    
                                ]                                
                            }                                                                                                           
                        />    
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            Choose the algorithm for the model
                        </Typography>
                    </div>                                                                                                                
                    <Input
                        onChange={(e) => {
                        }}
                        label="Model name"                        
                        required                                          
                    />                     
                    <div>
                        <Input
                            onChange={(e) => {
                            }}
                            label="Input shape"
                            required                                                                                    
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            This would be the number of features that the model would take as input
                        </Typography>
                    </div>  
                    <div>
                        <Input
                            onChange={(e) => {
                            }}
                            label="Output shape"
                            required                                                                                    
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            This would be the number of target that the model would predict
                        </Typography>
                    </div>  
                    <Input
                        onChange={(e) => {
                        }}
                        label="Model name"                        
                        required    
                        
                    />                                     
                    <div className="flex flex-row gap-4">
                        <Input
                            onChange={(e) => {
                            }}
                            label="Epochs"
                            type="number"                        
                        />               
                        <Input
                            onChange={(e) => {
                            }}
                            label="Batch size"
                            type="number" 
                        />
                    </div>
                    <div className="flex flex-row gap-6 justify-between">                                    
                        <div className="w-full">
                            <Select
                                onChange={(e) => {}}
                                className="w-full border rounded text-sm font-normal text-blue-gray-500"
                                placeholder="Loss function"                              
                                options={
                                    [
                                        { value: 'mean_squared_error', label: 'Mean Squared Error' },
                                        { value: 'mean_absolute_error', label: 'Mean Absolute Error' },
                                        { value: 'categorical_crossentropy', label: 'Categorical Crossentropy' },
                                        { value: 'binary_crossentropy', label: 'Binary Crossentropy' },
                                    ]                            
                                }                                                                                                           
                            />
                            <Typography
                                variant="small"                            
                                className="mt-2 flex items-center gap-1 font-normal text-xs"
                            >
                                <InformationCircleIcon className="h-4 w-4" />
                                Choose the loss function for the model. 
                            </Typography>
                        </div> 
                        <div className="w-full">
                            <Select
                                onChange={(e) => {}}
                                className="text-sm font-normal text-blue-gray-500"
                                placeholder="Optimizer"                              
                                options={
                                    [
                                        { value: 'adam', label: 'Adam' },
                                        { value: 'sgd', label: 'Stochastic Gradient Descent' },
                                        { value: 'rmsprop', label: 'RMSprop' },
                                    ]                               
                                }                                                                                                           
                            />   
                            <Typography
                                variant="small"                            
                                className="mt-2 flex items-center gap-1 font-normal text-xs"
                            >
                                <InformationCircleIcon className="h-4 w-4" />
                                Choose the optimizer for the model.
                            </Typography>
                        </div>
                    </div>                                                                                                                                                            
                </div>   
            </form>                  
        </DialogBody>
        <DialogFooter className="flex gap-4">
            <Button                                            
                color="red"                
                onClick={onClose}     
                disabled={loading}     
            >
                {loading ? "Loading..." : "Cancel" }          
            </Button>
            <Button 
                type="submit"   
                onClick={handleSubmitModel}
                ripple="light"
                disabled={loading}     
                >
                    {loading ? "Loading..." : "Save" }  
            </Button>
        </DialogFooter>
        </Dialog>
    </>
    );
}

export default AddModelDialog;