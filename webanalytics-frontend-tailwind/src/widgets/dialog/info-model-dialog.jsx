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
import { EyeIcon, EyeSlashIcon, ChevronDoubleDownIcon, InformationCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert, Backdrop } from "@mui/material";
import Select from 'react-select';

export function InfoModelDialog({ open, onClose, selectedDataset, selectedModel }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken } = controller;

    const [loading, setLoading] = React.useState(false);    
    
    useEffect(() => {
        console.log(selectedModel);
    }
    , [selectedModel]);

    return (
    <>                  
        <Dialog size="md" open={open} onClose={onClose} className="p-4 my-2 max-w-screen max-h-screen overflow-auto">
        <DialogHeader onClose={onClose} className="justify-center">
            <Typography                
                className="font-semibold text-xl"
            >{`Model ${selectedModel?.label} on ${selectedDataset?.label} Info`}
            </Typography>
        </DialogHeader>
        <DialogBody className="overflow-auto">
            {/* Model information HERE */}
            <div className="overflow-auto no-scrollbar flex flex-col gap-6 w-full pt-2">
                <div>
                    <Typography
                        color="black"
                        variant="small"
                        className="font-normal text-xs"
                    >
                        Model name
                    </Typography>
                    <Input 
                        className="col-span-2 w-full"
                        onChange={(e) => {                            
                            
                        }}
                        disabled
                        label="Model name"                        
                        value={selectedModel?.value?.name}                                        
                    />  
                </div>  
                <div className="grid grid-cols-2 gap-4 items-center">                                
                    <div>
                        <Typography
                            color="black"
                            variant="small"
                            className="font-normal text-xs"
                        >
                            Algorithm
                        </Typography>
                        <Select
                            onChange={(e) => {
                                
                            }}
                            isDisabled={true}
                            className="w-full border rounded text-sm font-normal text-blue-gray-500"
                            placeholder="Algorithm"
                            options={
                                [
                                    { value: 'RANDOM_FOREST', label: 'Random Forest' },
                                    { value: 'MLP', label: 'Multilayer Perceptron' },
                                    { value: 'LSTM', label: 'Long Short-Term Memory' },
                                    { value: 'CNN', label: 'Convolutional Neural Network' },                                    
                                ]                                
                            }
                            value={{value: selectedModel?.value?.algorithm, label: selectedModel?.value?.algorithm}}
                        />    
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            The algorithm for the model
                        </Typography>
                    </div>
                    <div>
                        <Typography
                            color="black"
                            variant="small"
                            className="font-normal text-xs"
                        >
                            Task
                        </Typography>
                        <Select
                            onChange={(e) => {}}
                            className="w-full border rounded text-sm font-normal text-blue-gray-500"
                            placeholder="Task"
                            isDisabled={true}
                            options={
                                [
                                    { value: 'Classification', label: 'Classification' },
                                    { value: 'Regression', label: 'Regression' },
                                    { value: 'Anomaly Detection', label: 'Anomaly Detection' },
                                ]                                
                            }    
                            value={{value: selectedModel?.value?.task, label: selectedModel?.value?.task}}                                                                                                       
                        />    
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            The task for the model
                        </Typography>
                    </div>
                </div> 
                <div className="grid grid-cols-2 items-start gap-4">
                    <div>
                        <Typography
                            color="black"
                            variant="small"
                            className="font-normal text-xs"
                        >
                            Input Shape
                        </Typography>
                        <Input
                            onChange={(e) => {
                                
                            }}
                            disabled
                            label="Input shape"
                            value={selectedModel?.value?.input_shape}
                            type="number"                                                                                 
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            The number of features of the model
                        </Typography>
                    </div> 
                    <div>
                        <Typography
                            color="black"
                            variant="small"
                            className="font-normal text-xs"
                        >
                            Output Shape
                        </Typography>
                        <Input
                            onChange={(e) => {
                              
                            }}
                            disabled
                            label="Output shape"
                            value={selectedModel?.value?.output_shape}     
                            type="number"                                                                         
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex items-center gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            The number of target for the model.
                        </Typography>
                    </div>
                </div>
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
                    </div>    */}
                    {selectedModel?.value?.algorithm == "RANDOM_FOREST" &&
                    <>
                    <div>
                        <Typography
                            color="black"
                            variant="small"
                            className="font-normal text-xs"
                        >
                            Maximum depth
                        </Typography>
                        <Input
                            onChange={(e) => {
                                
                            }}
                            disabled
                            label="Maximum depth"     
                            value={selectedModel?.value?.max_depth}                                                                              
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
                        <Typography
                            color="black"
                            variant="small"
                            className="font-normal text-xs"
                        >
                            Maximum tree
                        </Typography>
                        <Input
                            onChange={(e) => {
                                
                            }}
                            disabled
                            label="Maximum tree"   
                            value={selectedModel?.value?.num_trees}                                                                             
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                            The maximum number of trees in the random forest.
                        </Typography>
                    </div>
                    </>}
                    {selectedModel?.value?.algorithm != "RANDOM_FOREST" &&     
                    <div>
                        <Typography
                            color="black"
                            variant="small"
                            className="font-normal text-xs"
                        >
                            Hidden Layers
                        </Typography>
                        <Input
                            onChange={(e) => {
                                
                            }}
                            disabled
                            label="Hidden layers"
                            value={selectedModel?.value?.hidden_layers}
                        />  
                        <Typography
                            variant="small"                            
                            className="mt-2 flex gap-1 font-normal text-xs"
                        >
                            <InformationCircleIcon className="h-4 w-4" />
                           The number of hidden layers of the model
                        </Typography>
                    </div>    
                    }
                 
                    <div>
                        <Typography
                            color="black"
                            variant="small"
                            className="font-normal text-xs"
                        >
                            Epochs
                        </Typography>
                        <Input
                            onChange={(e) => {
                                
                            }}
                            label="Epochs"
                            type="number" 
                            disabled
                            value={selectedModel?.value?.epochs}                       
                        />  
                    </div>                     
                    <div className="flex flex-row gap-4 w-full">  
                        <div className="w-full">
                            <Typography
                                color="black"
                                variant="small"
                                className="font-normal text-xs"
                            >
                                Batch size
                            </Typography>
                            <Input
                                onChange={(e) => {
                                
                                }}
                                label="Batch size"
                                type="number" 
                                disabled
                                value={selectedModel?.value?.batch_size}
                            />
                        </div>
                        {
                            selectedModel?.value?.algorithm === 'LSTM' &&
                            <div className="w-full">
                                <Typography
                                    color="black"
                                    variant="small"
                                    className="font-normal text-xs"
                                >
                                    Time Steps
                                </Typography>
                                <Input
                                    onChange={(e) => {
                                        
                                    }}
                                    label="Time steps"
                                    type="number"
                                    disabled
                                    value={selectedModel.value?.timesteps}
                                />
                            </div>
                        }
                    </div>
                    {selectedModel?.value?.algorithm != "RANDOM_FOREST" &&
                    <>
                    <div className="flex flex-row gap-4">                                    
                        <div className="w-full">
                            <Typography
                                color="black"
                                variant="small"
                                className="font-normal text-xs"
                            >
                                Activation function
                            </Typography>
                            <Select
                                onChange={(e) => {
                                    
                                }}
                                className="w-full border rounded text-sm font-normal text-blue-gray-500"
                                placeholder="Activation function"  
                                isDisabled={true}
                                value={{value: selectedModel?.value?.activation, label: selectedModel?.value?.activation}}                        
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
                            <Typography
                                color="black"
                                variant="small"
                                className="font-normal text-xs"
                            >
                                Optimizers
                            </Typography>
                            <Select
                                onChange={(e) => {
                                    
                                }}
                                className="text-sm font-normal text-blue-gray-500"
                                placeholder="Optimizer" 
                                isDisabled={true}
                                value={{value: selectedModel?.value?.optimizer, label: selectedModel?.value?.optimizer}}                             
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
        </DialogBody>
        <DialogFooter className="flex gap-4 justify-center">
            <div className="flex gap-4">
                <Button
                    onClick={onClose}     
                    disabled={loading}     
                >
                    {loading ? "Loading..." : "Close" }          
                </Button>
            </div>
        </DialogFooter>
        </Dialog>
    </>
    );
}

export default InfoModelDialog;