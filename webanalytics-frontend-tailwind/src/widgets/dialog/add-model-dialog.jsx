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
import { addNewTrainingModel } from "@/services/prediction.service";
import { useMaterialTailwindController } from "@/context";
import { EyeIcon, EyeSlashIcon, ChevronDoubleDownIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert, Backdrop } from "@mui/material";
import Select from 'react-select';
import { set } from "date-fns";

export function AddModelDialog({ open, onClose, selectedDataset }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken } = controller;

    const [newModel, setNewModel] = React.useState({
        dataset: selectedDataset?.value?.id,
        output_shape: 1,
    });    

    const [loading, setLoading] = React.useState(false);    
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [advanceOptions, setAdvanceOptions] = React.useState(false);
    

    const handleSubmitModel = async () => {
        try {
            setLoading(true);
            const res = await addNewTrainingModel(newModel, accessToken);
            if (res.status === 200 || res.status === 201) {
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
        console.log(newModel);
    }
    , [newModel]);

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
        <Dialog size="sm" open={open} onClose={onClose} className="p-4 max-w-screen max-h-screen overflow-auto">
        <DialogHeader onClose={onClose} className="justify-center">
            <Typography                
                className="font-semibold text-xl"
            >{`Add new deep learning model for ${selectedDataset?.value?.name}`}
            </Typography>
        </DialogHeader>
        <DialogBody className="overflow-auto">
            {/* Create input with menu */}
            <form onSubmit={handleSubmitModel}>  
                <div className="overflow-auto no-scrollbar flex flex-col gap-6 w-full pt-2">                                                                                                                                   
                    <Input
                        onChange={(e) => {                            
                            setNewModel(prevState => ({...prevState, name: e.target.value}))
                        }}
                        label="Model name"                        
                        required                                          
                    />                      
                    <div>
                        <Select
                            onChange={(e) => setNewModel(prevState => ({...prevState, algorithm: e.value}))}
                            className="w-full border rounded text-sm font-normal text-blue-gray-500"
                            placeholder="Algorithm"
                            required    
                            options={
                                [
                                    { value: 'RANDOM_FOREST', label: 'Random Forest' },
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
                    <div>
                        <Select
                            onChange={(e) => setNewModel(prevState => ({...prevState, task: e.value}))}
                            className="w-full border rounded text-sm font-normal text-blue-gray-500"
                            placeholder="Task"
                            required    
                            options={
                                [
                                    { value: 'Binary', label: 'Binary Classification' },
                                    { value: 'Classification', label: 'Multiclass Classification' },
                                    { value: 'Regression', label: 'Regression' },
                                    { value: 'Anomaly Detection', label: 'Anomaly Detection' },
                                ]                                
                            }                                                                                                           
                        />    
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            Choose the task for the model
                        </Typography>
                    </div>                    
                    <div>
                        <Input
                            onChange={(e) => {
                                setNewModel(prevState => ({...prevState, input_shape: e.target.value}))
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
                    </div> 
                    <div>
                        <Input
                            onChange={(e) => {
                                setNewModel(prevState => ({...prevState, output_shape: e.target.value}))
                            }}
                            {...newModel.algorithm === 'RANDOM_FOREST' && {value: 1}}
                            {...newModel.algorithm === 'RANDOM_FOREST' && {disabled: true}}
                            label="Output shape"     
                            type="number"                                                                         
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            {...newModel.algorithm === 'RANDOM_FOREST' ? "Random Forest only supports one target" : "This would be the number of target for the model. Default is 1"}
                        </Typography>
                    </div>
                    <div className="mx-2"> 
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
                    </div>   
                    {advanceOptions && newModel.algorithm == "RANDOM_FOREST" &&
                    <>
                    <div>
                        <Input
                            onChange={(e) => {
                                setNewModel(prevState => ({...prevState, max_depth: e.target.value}))
                            }}
                            label="Maximum depth"                                                                                   
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            The maximum depth of the tree. 
                        </Typography>
                    </div>
                    <div>
                        <Input
                            onChange={(e) => {
                                setNewModel(prevState => ({...prevState, num_tree: e.target.value}))
                            }}
                            label="Maximum tree"                                                                                
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            The maximum number of trees in the forest.
                        </Typography>
                    </div>
                    </>}
                    {advanceOptions &&  newModel.algorithm != "RANDOM_FOREST" &&     
                    <div>
                        <Input
                            onChange={(e) => {
                                setNewModel(prevState => ({...prevState, hidden_layers: e.target.value}))
                            }}
                            label="Hidden layers"                                                                               
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            Enter the number of hidden layers for the model separated by comma. Eg. 128, 64, 32
                        </Typography>
                    </div>    
                    }
                    {advanceOptions && <>
                        <Input
                            onChange={(e) => {
                                setNewModel(prevState => ({...prevState, epochs: e.target.value}))
                            }}
                            label="Epochs"
                            type="number"                        
                        />                       
                        <div className="flex flex-row gap-4 w-full">                                     
                            <Input
                                onChange={(e) => {
                                    setNewModel(prevState => ({...prevState, batch_size: e.target.value}))
                                }}
                                label="Batch size"
                                type="number" 
                            />
                            {
                                newModel?.algorithm === 'LSTM' &&
                                <Input
                                    onChange={(e) => {
                                        setNewModel(prevState => ({...prevState, timesteps: e.target.value}))
                                    }}
                                    label="Time steps"
                                    type="number"
                                />
                            }
                        </div>
                    </>
                    }
                    {advanceOptions &&  newModel.algorithm != "RANDOM_FOREST" &&
                    <>
                    <div className="flex flex-row gap-4">                                    
                        <div className="w-full">
                            <Select
                                onChange={(e) => {
                                    setNewModel(prevState => ({...prevState, activation: e.value}))
                                }}
                                className="w-full border rounded text-xs font-normal text-blue-gray-500"
                                placeholder="Activation function"                              
                                options={
                                    [
                                        { value: 'relu', label: 'ReLU' },
                                        { value: 'tanh', label: 'Tanh' },
                                        { value: 'sigmoid', label: 'Sigmoid' },
                                        { value: 'softmax', label: 'Softmax' },
                                        { value: 'linear', label: 'Linear' },
                                    ]                           
                                }                                                                                                           
                            />
                            <Typography
                                variant="small"                            
                                className="mt-2 flex  gap-1 font-normal text-xs"
                            >
                                <InformationCircleIcon className="h-4 w-4" />
                                Hidden layers activation function. 
                            </Typography>
                        </div> 
                        <div className="w-full">
                            <Select
                                onChange={(e) => {
                                    setNewModel(prevState => ({...prevState, optimizer: e.value}))
                                }}
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
                                className="mt-2 flex gap-1 font-normal text-xs"
                            >
                                <InformationCircleIcon className="h-4 w-4" />
                                Optimizer when training the model
                            </Typography>
                        </div>
                    </div>  
                    </> }                                                                                                                                                                              
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