import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Tooltip,
    Typography,
    Spinner,
    Button, IconButton,
    Menu, MenuList, MenuItem, MenuHandler, 
} from "@material-tailwind/react";
import { 
  ChevronDoubleDownIcon, 
  PlusIcon, 
  SparklesIcon, 
  TrashIcon,
  PencilIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { AddModelDialog, TrainModelDialog, InfoModelDialog, ConfirmDialog } from "@/widgets/dialog";
import { getTrainingModels, updateModel, deleteTrainingModel } from "@/services/prediction.service";
import { Snackbar, Alert } from "@mui/material";
import { useMaterialTailwindController, setSelectedDataset } from "@/context"; 
import { StarIcon } from "@heroicons/react/24/solid";

const MSnackbar = ({ open, onClose, message, severity }) => {
  return (
      <Snackbar
            sx={{ zIndex: 10000 }}
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={5000}
            onClose={onClose}
        >
            <Alert
                onClose={onClose}
                severity={severity}
            >
                {message}
            </Alert>
        </Snackbar>
  );
}

export function Models() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken, selectedDataset, userInfo } = controller;

    const datasetModel = React.useRef(null)

    const [selectedModel, setSelectedModel] = React.useState(null);

    const [loading, setLoading] = React.useState(false);
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [openAddModelDialog, setOpenAddModelDialog] = React.useState(false);
    const [openTrainModelDialog, setOpenTrainModelDialog] = React.useState(false);
    const [openInfoModelDialog, setOpenInfoModelDialog] = React.useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

    const [message, setMessage] = React.useState("");

    const fetchData = async () => {
      try {
        if (!selectedDataset) return;
        setLoading(true);
        const res = await getTrainingModels(selectedDataset.value.id, accessToken);
        if (res.status === 200) {
          datasetModel.current = res.data;
          setLoading(false);
        }
      } catch (error) {        
        setShowError(true);
        setMessage("Failed to Load Models!");
        setShowSnackbar(true);
        setLoading(false);
      }
    };

    const handleSetDefaultModel = async (model) => {
      try {
        const res = await updateModel(model.id, { default_model: !model.default_model }, accessToken);
        if (res.status === 200) {
          fetchData();
          setShowError(false);
          setMessage("Model Updated Successfully!");
          setShowSnackbar(true);
        }
      } catch (error) {
        setShowError(true);
        setMessage("Failed to Update Model!");
        setShowSnackbar(true);
      }
    }

    const handleDeleteModel = async (model) => {
      try {
        const res = await deleteTrainingModel(model.id, accessToken);
        if (res.status === 204 || res.status === 200) {
          fetchData();
          setShowError(false);
          setMessage("Model Deleted Successfully!");
          setShowSnackbar(true);
          setOpenConfirmDialog(false);
        }
      } catch (error) {
        setShowError(true);
        setMessage("Failed to Delete Model!");
        setShowSnackbar(true);
      }
    }


    React.useEffect(() => {    
      fetchData();
    }, [selectedDataset]);

    React.useEffect(() => {
      console.log(selectedModel);       
    }, [selectedModel]);

    return (
      <>
      <AddModelDialog
        open={openAddModelDialog}
        onClose={() => setOpenAddModelDialog(false)}
        selectedDataset={selectedDataset}
      />
      <TrainModelDialog
        open={openTrainModelDialog}
        onClose={() => setOpenTrainModelDialog(false)}
        selectedDataset={selectedDataset}
        selectedModel={selectedModel}
      />
      <InfoModelDialog
        open={openInfoModelDialog}
        onClose={() => setOpenInfoModelDialog(false)}
        selectedDataset={selectedDataset}
        selectedModel={selectedModel}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={() => handleDeleteModel(selectedModel.value)}
        title="Delete Model"        
      >
        <Typography variant="h6" color="blue-gray" className="font-normal text-center">
        {`Are you sure you want to delete ${selectedModel?.label} model?`}
        </Typography>
      </ConfirmDialog>

      <MSnackbar
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        message={message}
        severity={showError ? "error" : "success"}
      />
      
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-1 xl:grid-cols-1">
          <Card>
            <CardHeader variant="gradient" color="gray" className=" p-6">
              <Typography variant="h6" color="white">
                Select Dataset
              </Typography>
            </CardHeader>
            <CardBody className="px-6 pt-6 pb-4">
            <Menu placement="bottom-start">
              <MenuHandler>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  className="text-start flex justify-between items-center"                  
                >
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {selectedDataset ? selectedDataset.value.name : "Select Dataset"}
                  </Typography>
                  <ChevronDoubleDownIcon className="h-5 w-5" />	
                </Button>
              </MenuHandler>
              <MenuList className="max-h-72 w-fit">
                {userInfo?.datasets.map((dataset, key) => (
                  <MenuItem 
                    key={key}
                    onClick={() => {setSelectedDataset(dispatch, {
                      label: dataset.name,
                      value: dataset
                    });                    
                    console.log(datasetModel.current);
                  }}>
                    <Typography color="blue-gray">
                      {dataset.name}
                    </Typography>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            </CardBody> 
          </Card>
        </div>
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {loading ? 
              <div className="flex flex-row gap-4">
                <Spinner size="sm" color="white" className="mr-2" />
                Loading...
              </div> : 
              <div> 
                {
                    selectedDataset ? 
                    <div className="flex flex-row justify-between items-center">
                        <div>{selectedDataset.value.name} Models</div>
                        <Button         
                            size="sm"    
                            color="blue-gray" 
                            onClick={() => setOpenAddModelDialog(true)}                       
                            className="flex flex-row gap-4 items-center">
                            <PlusIcon                    
                                className={`w-5 h-5 text-white`}                    
                            />
                            Add Models
                            </Button>
                    </div> 
                    : "No dataset selected"
                }              
                </div>}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-scroll px-0 pt-0 pb-2 max-h-[500px]">            
            {datasetModel.current?.length > 0  ? ( 
            <table className="w-full min-w-[640px] table-auto">
              <thead className="sticky top-0 z-2 bg-white">
                <tr>
                  {Object.keys(datasetModel.current[0]).map((el) => (
                    // only takes name, status, created_at, algorithm, features, target, input_shape, output_shape
                    (el == "name" || el == "status" || el == "created_at" || 
                    el == "algorithm" || el == "features" || el == "target" ||
                     el == "input_shape" || el == "output_shape" || el == "sample_size") &&
                    <th
                      key={el}
                      className="border-b-4 border-r border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography                        
                        variant="small"
                        color="blue-gray"
                        className="text-xs font-semibold uppercase flex flex-row gap-2 items-center" 
                      >
                        {el}                        
                      </Typography>
                    </th>
                  ))}                  
                  <th className="border-b-4 border-r border-blue-gray-50 py-3 px-5 text-left">                
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="text-xs font-semibold uppercase flex flex-row gap-2 items-center"
                        >
                        Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {datasetModel?.current.map((row, key) => {
                  const className = `py-3 px-5 ${
                    key === datasetModel.current.length
                      ? ""
                      : "border-b border-r border-blue-gray-50 min-w-full"
                  }`;
                  return (
                    <tr key={key}>
                      {Object.keys(row).map((el) => ( 
                        (el == "name" || el == "status" || el == "created_at" || el == "algorithm" || el == "features" || el == "target" || el == "input_shape" || el == "output_shape") &&
                        <td className={className + ` ${row["default_model"] && 'bg-blue-gray-50'}`}>
                          <Typography
                            variant="small"
                            className="text-xs font-bold uppercase text-blue-gray-500"
                          >
                            { el == "features" || el == "target" ? JSON.stringify(row[el]) : 
                            el == "created_at" ? new Date(row[el]).toLocaleString() :
                            row[el]}
                          </Typography>
                        </td>
                      ))}
                        <td className={className + ` ${row["default_model"] && 'bg-blue-gray-50'}`}>
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-4">
                            <Tooltip content="Info">
                              <IconButton
                                onClick={() => {
                                  setSelectedModel({
                                    label: row.name,
                                    value: row                                  
                                  });     
                                  setOpenInfoModelDialog(true);
                                }}
                              >
                                <InformationCircleIcon
                                  strokeWidth={2}
                                  className="h-5 w-5"
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content={row.status == "training" ? "Training..." : "Train"}>
                              <IconButton
                                color="green"
                                // disabled={row.status == "training"} 
                                onClick={() => {
                                  setSelectedModel({
                                    label: row.name,
                                    value: row                                  
                                  });
                                  setOpenTrainModelDialog(true);                                
                                }}
                              >
                                {row.status == "training" ? 
                                <Spinner
                                  size="sm"
                                  color="white"
                                  
                                />: 
                                <SparklesIcon
                                  strokeWidth={2}
                                  className="h-5 w-5"
                                />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Edit">
                              <IconButton
                                color="indigo"
                                onClick={() => {                                                                      
                                }}
                              >
                                <PencilIcon
                                  strokeWidth={2}
                                  className="h-5 w-5"
                                />
                              </IconButton>
                            </Tooltip>
                            </div>
                            <div className="flex flex-row gap-4">
                            <Tooltip content="Delete">
                              <IconButton
                                color="red"
                                onClick={() => {
                                  setSelectedModel({
                                    label: row.name,
                                    value: row                                  
                                  });
                                  setOpenConfirmDialog(true);
                                }}
                              >
                                <TrashIcon
                                  strokeWidth={2}
                                  className="h-5 w-5"
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content={row.default_model ? "Cancel as default model" : "Set as default model"}>
                              <IconButton
                                color='white'
                                onClick={() => {
                                  setSelectedModel({
                                    label: row.name,
                                    value: row                                  
                                  });
                                  handleSetDefaultModel(row);
                                }}
                                className="border-2 border-blue-gray-200"
                              >
                                <StarIcon
                                  strokeWidth={2}     
                                  fill={row.default_model ? "currentColor" : "none"}    
                                  stroke="currentColor"                                                                                       
                                  className="h-5 w-5 text-yellow-600"
                                />
                              </IconButton>
                            </Tooltip>
                            </div>
                          </div>
                        </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : 
          (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col items-center justify-center gap-4">                
                <Typography variant="h6" color="blue-gray" className="font-normal">
                  No Model Found
                </Typography>
              </div>
            </div>
                
          )}              
            
          </CardBody>
          <CardFooter className="justify-center">
          </CardFooter>
        </Card>        
      </div>
      </>
    );
  }
  
  export default Models;
  