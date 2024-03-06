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
import { createConnection } from "@/services/connection.service";
import { useMaterialTailwindController, setUserInfo } from "@/context";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Snackbar, Alert } from "@mui/material";
import Select from 'react-select';

export function AddConnectionDialog({ open, onClose }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken, userInfo } = controller;

    const [newConnection, setNewConnection] = React.useState({
        database_type: '',
        host: '',
        database: '',
        port: '',
        username: '',
        password: '',
        ssl: false
    });  

    const [loading, setLoading] = React.useState(false);
    const [viewPassword, setViewPassword] = React.useState(false);
    const [showSnackbar, setShowSnackbar] = React.useState(false);

    const handleSubmitConnection = async () => {
        try {
            setLoading(true);
            const res = await createConnection(newConnection, accessToken );
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
            alert("Create Connection Failed!")
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    return (
    <>
        <Snackbar
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
                Connection Created Successfully!
            </Alert>
        </Snackbar>        
        <Dialog size="sm" open={open} onClose={onClose} className="p-4 max-w-screen">
        <DialogHeader onClose={onClose} className="justify-center">Add Database Connection</DialogHeader>
        <DialogBody className="overflow-auto">
            {/* Create input with menu */}
            <div className="overflow-auto no-scrollbar flex flex-col gap-6 w-full pt-2">               
                <Select
                    onChange={(e) => setNewConnection(prevState => ({...prevState, database_type: e.value}))}
                    className="w-full border rounded"
                    placeholder="Database Type"
                    required    
                    options={
                        [
                            { value: 'mysql', label: 'MySQL' },
                            { value: 'postgresql', label: 'PostgreSQL' },                                                                    
                            { value: 'oracle', label: 'Oracle' },
                            { value: 'mariadb', label: 'MariaDB' },                                                                                                
                        ]
                    }                                                                                                           
                />                                                                                       
                    <Input
                        onChange={(e) => setNewConnection(prevState => ({...prevState, host: e.target.value}))}
                        label="Host"
                        required
                    />                             
                    <Input
                        onChange={(e) => setNewConnection(prevState => ({...prevState, database: e.target.value}))}
                        label="Database"
                        required
                    />
                    <Input
                        onChange={(e) => setNewConnection(prevState => ({...prevState, port: e.target.value}))}
                        type="number"
                        label="Port"
                        required
                    />
                    <Input
                        onChange={(e) => setNewConnection(prevState => ({...prevState, username: e.target.value}))}
                        label="Username"
                        required
                    />
                    <Input
                        type={viewPassword ? "text" : "password"}
                        onChange={(e) => setNewConnection(prevState => ({...prevState, password: e.target.value}))}
                        label="Password"
                        required
                        icon={  
                            <div onClick={() => setViewPassword(!viewPassword)}>  {          
                              viewPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                              ) : (
                                <EyeIcon className="h-5 w-5" />
                              )   }
                            </div>           
                          }

                    />
                    <Checkbox
                        onChange={(e) => setNewConnection(prevState => ({...prevState, ssl: e.target.checked}))} 
                        label="Always use SSL"
                     />                                                       
            </div>                    
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
                onClick={handleSubmitConnection}
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