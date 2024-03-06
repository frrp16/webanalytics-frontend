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
import { createDataset } from "@/services/dataset.service";
import { useMaterialTailwindController, setUserInfo } from "@/context";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert, Backdrop } from "@mui/material";
import Select from 'react-select';

export function AddDatasetDialog({ open, onClose }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken, userInfo } = controller;

    const [newDataset, setnewDataset] = React.useState({
        name: '',
        description: '',
        table_name: ''
    });  

    const [loading, setLoading] = React.useState(false);    
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [showError, setShowError] = React.useState(false);

    const handleSubmitDataset = async () => {
        try {
            setLoading(true);
            const res = await createDataset(newDataset, accessToken );
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
            onClose={() => setShowSnackbar(false)}
        >
            {/* success alert */}
            <Alert
                onClose={() => {
                    setShowSnackbar(false);
                    window.location.reload();
                }}
                severity="success"
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
        <DialogHeader onClose={onClose} className="justify-center">Add New Dataset Table</DialogHeader>
        <DialogBody className="overflow-auto">
            {/* Create input with menu */}
            <form onSubmit={handleSubmitDataset}>  
                <div className="overflow-auto no-scrollbar flex flex-col gap-6 w-full pt-2">                                                                                                                         
                    <Input
                        onChange={(e) => setnewDataset(prevState => ({...prevState, name: e.target.value}))}
                        label="Dataset name"
                        required
                    />                             
                    <Input
                        onChange={(e) => setnewDataset(prevState => ({...prevState, description: e.target.value}))}
                        label="Dataset description"                        
                    />                    
                    <Input
                        onChange={(e) => setnewDataset(prevState => ({...prevState, table_name: e.target.value}))}
                        label="Dataset table name"
                        required
                    />                                                                                                              
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