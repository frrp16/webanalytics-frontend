import React, { useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Menu, MenuItem, MenuButton, MenuHandler,
    Input,
    MenuList, Typography, Checkbox
  } from "@material-tailwind/react";

import { getUserInfo } from "@/services/auth.service";
import { createDataset, updateDataset } from "@/services/dataset.service";
import { useMaterialTailwindController } from "@/context";
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert, Backdrop } from "@mui/material";
import Select from 'react-select';

export function AddDatasetDialog({ open, onClose, edit, selectedEditDataset }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken } = controller;

    const [newDataset, setnewDataset] = React.useState({
        name: '',
        description: '',
        table_name: ''
    });  

    const [selectedDatasetUpdate, setSelectedDatasetUpdate] = React.useState({});

    const [loading, setLoading] = React.useState(false);    
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [showError, setShowError] = React.useState(false);

    const handleSubmitDataset = async () => {
        try {
            setLoading(true);
            let res
            if (edit) {
                res = await updateDataset(selectedEditDataset.value.id, selectedDatasetUpdate, accessToken);
            } else {
                res = await createDataset(newDataset, accessToken);
            }
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
                Dataset Created Successfully!
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
                Dataset Creation Failed!
            </Alert>      
        </Snackbar>           
        <Dialog size="sm" open={open} onClose={onClose} className="p-4 max-w-screen overflow-auto">
        <DialogHeader onClose={onClose} className="justify-center">{edit ? `Edit Dataset ${selectedEditDataset.label}` : 'Add New Dataset'}</DialogHeader>
        <DialogBody className="overflow-auto">
            {/* Create input with menu */}
            <form onSubmit={handleSubmitDataset}>  
                <div className="overflow-auto no-scrollbar flex flex-col gap-8 w-full pt-2">                                                                                                                         
                    <Input
                        onChange={(e) => {
                            !edit ? setnewDataset(prevState => ({...prevState, name: e.target.value})) 
                            : setSelectedDatasetUpdate(prevState => ({...prevState, name: e.target.value}))
                        }}
                        label="Dataset name"                        
                        required
                        defaultValue={edit ? selectedEditDataset?.value?.name : ''}                        
                    />                             
                    <Input
                        onChange={(e) => {
                            !edit ? setnewDataset(prevState => ({...prevState, description: e.target.value}))
                            : setSelectedDatasetUpdate(prevState => ({...prevState, description: e.target.value}))
                        }}
                        label="Dataset description"                            
                        defaultValue={edit ? selectedEditDataset?.value?.description : ''}                    
                    />                    
                    <div>
                    <Input
                        onChange={(e) => {
                            !edit ? setnewDataset(prevState => ({...prevState, table_name: e.target.value}))
                            : setSelectedDatasetUpdate(prevState => ({...prevState, table_name: e.target.value}))
                        }}
                        label="Dataset table name"                        
                        defaultValue={edit ? selectedEditDataset?.value?.table_name : ''}
                        required
                    />  
                    {edit && 
                    <Typography
                        variant="small"                            
                        className="mt-2 flex items-center gap-1 font-normal text-xs"
                    >
                        <ExclamationCircleIcon className="h-4 w-4" />
                        WARNING: Editing the table name will affect the data source connection.
                    </Typography>
                    }
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
                onClick={handleSubmitDataset}
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