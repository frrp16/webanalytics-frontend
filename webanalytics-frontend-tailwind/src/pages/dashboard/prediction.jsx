import React from "react";
import Select from 'react-select';
import { Link, useNavigate } from "react-router-dom";
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
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { AddModelDialog, TrainModelDialog, InfoModelDialog, PredicModelDialog } from "@/widgets/dialog";
import { getTrainingModels } from "@/services/prediction.service";
import { Snackbar, Alert } from "@mui/material";
import { useMaterialTailwindController, setSelectedDataset } from "@/context"; 
import { StarIcon } from "@heroicons/react/24/solid";

  export function Prediction() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken, selectedDataset, userInfo } = controller;

    const datasetModel = React.useRef(null)
    const navigate = useNavigate();

    const [selectedModel, setSelectedModel] = React.useState(null);

    const [loading, setLoading] = React.useState(false);
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [openAddModelDialog, setOpenAddModelDialog] = React.useState(false);
    const [openPredicModelDialog, setOpenPredicModelDialog] = React.useState(false);
    const [openInfoModelDialog, setOpenInfoModelDialog] = React.useState(false);

    const lastMonitorLog = selectedDataset ? selectedDataset.value.monitor_log.slice(-1) : null;

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
        setLoading(false);
      }
    };

    React.useEffect(() => {    
      fetchData();
      console.log(selectedDataset);
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
      <PredicModelDialog
        open={openPredicModelDialog}
        onClose={() => setOpenPredicModelDialog(false)}
        selectedDataset={selectedDataset}
        selectedModel={selectedModel}
      />
      <InfoModelDialog
        open={openInfoModelDialog}
        onClose={() => setOpenInfoModelDialog(false)}
        selectedDataset={selectedDataset}
        selectedModel={selectedModel}
      />

      {/* Error Snackbar */}
      <Snackbar
          sx={{ zIndex: 10000 }}
          open={showError}          
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
              Failed to Load Models!
          </Alert>      
      </Snackbar>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <div className="grid gap-y-10 gap-x-6 md:grid-cols-1 xl:grid-cols-1">
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
        {
          lastMonitorLog ? lastMonitorLog[0]?.changes?.added_rows?.length > 0 ? 
          <Alert 
            icon={<InformationCircleIcon className="w-5 h-5" />}
             severity="warning" className="items-center">                        
              <Typography variant="medium" className="font-normal">
                {`New ${lastMonitorLog[0]?.changes?.added_rows.length} data has been added to this dataset since the last logs.`} 
              </Typography>            
          </Alert> : <div className="mt-12"></div> : <div className="mt-12"></div>
        }
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
                        <div>{selectedDataset.value.name} Predictions</div>
                        <Button         
                            size="sm"    
                            color="blue-gray" 
                            onClick={() => {
                                navigate('/dashboard/models');
                            }}                       
                            className="flex flex-row gap-4 items-center">
                            <SparklesIcon                    
                                className={`w-5 h-5 text-white`}                    
                            />
                            Show Models
                            </Button>
                    </div> 
                    : "No dataset selected"
                }              
                </div>}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-scroll px-6 pt-0 pb-2 max-h-[500px]">            
            {datasetModel.current?.length > 0  ? ( 
          <div>
            <table className="table-auto text-left w-full">
              <tbody>
                <tr className="border-b">
                  <td className=" font-bold border-blue-gray-100 px-4 py-2 items-start">                              
                    <Typography variant="small" className="font-semibold text-blue-gray-700 uppercase">
                      Current default model :
                    </Typography>                          
                  </td>
                  <td className="border-blue-gray-100 px-4 py-2">
                    {datasetModel.current.filter((model) => model.default_model).length > 0 ? datasetModel.current.filter((model) => model.default_model)
                    .map((model, key) => (
                      <div key={key} className="flex flex-row gap-4 items-center">
                        <IconButton
                          size="sm"
                          onClick={() => {
                            setSelectedModel({
                              label: model.name,
                              value: model
                            });    
                            setOpenInfoModelDialog(true);
                          }}
                        >
                          <InformationCircleIcon
                            strokeWidth={2}
                            className="h-5 w-5"
                          />
                        </IconButton>
                        <Typography variant="small" className="font-normal">
                          {model.name}
                        </Typography>
                      </div>
                    )) : 
                    <Typography variant="small" className="font-normal">
                      No default model has been set
                    </Typography>}
                  </td>
                </tr>
                <tr>
                  <td className="border-blue-gray-100 pl-4 pr-10 py-2 items-start">                              
                    {/* <Select
                      placeholder="Select Model"
                      options={datasetModel.current.map((model) => ({
                        label: model.name,
                        value: model
                      }))}
                      onChange={(e) => {
                        setSelectedModel(e);
                      }}
                    />*/}
                    <Menu placement="bottom-start" className="mr-12">
                      <MenuHandler>
                        <Button 
                          variant="outlined" 
                          className="text-start w-full flex justify-between items-center"                  
                        >
                          <Typography variant="small" color="blue-gray" className="font-normal text-sm">
                            {selectedModel ? selectedModel.label : "Select Model"}
                          </Typography>
                          <ChevronDoubleDownIcon className="h-5 w-5" />	
                        </Button>
                      </MenuHandler>
                      <MenuList className="max-h-72 w-fit">
                        {datasetModel.current.map((model, key) => (
                          <MenuItem 
                            key={key}
                            onClick={() => {
                              setSelectedModel({
                                label: model.name,
                                value: model
                              });
                            }}>
                            <Typography color="blue-gray">
                              {model.name}
                            </Typography>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </td>
                </tr>
                {selectedModel ? 
                  <tr>
                  <td className="border-blue-gray-100 pl-4 pr-10 py-2 items-start">                              
                    <Button 
                      onClick={() => {
                        setOpenPredicModelDialog(true);
                      }}
                      color="blue-gray"
                      variant="filled"
                      size="sm"
                      className="flex flex-row gap-4 items-center">
                      <ChartBarIcon
                        className="w-5 h-5 text-white"
                      />
                      Predict Data Using Selected Model
                    </Button>
                  </td>
                  <td className="border-blue-gray-100 pl-4 pr-10 py-2 items-start">                              
                    <Button 
                      onClick={() => {
                        setOpenInfoModelDialog(true);
                      }}
                      color="blue-gray"
                      variant="filled"
                      size="sm"
                      className="flex flex-row gap-4 items-center">
                      <InformationCircleIcon                    
                          className={`w-5 h-5 text-white`}                    
                      />
                      Model Info
                    </Button>
                  </td>
                </tr> : null}
              </tbody>
            </table>
          </div>
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
          {
            selectedModel ? 
            <div className="flex flex-row justify-between items-center mt-8">
              {selectedModel?.value?.prediction?.length > 0 ? (
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                    {Object.keys(selectedModel?.value?.prediction[0]).map((el) => (
                    // only takes name, status, created_at, algorithm, features, target, input_shape, output_shape
                    (el == "created_at" || el == 'loss'
                    ) &&
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
                    {selectedModel?.value?.prediction?.map((prediction, key) => {
                      const className = `py-3 px-5 ${
                        key === selectedModel?.value?.prediction.length
                          ? ""
                          : "border-b border-r border-blue-gray-50 min-w-full"
                      }`;
                      return (
                        <tr key={key}>
                          {Object.keys(prediction).map((el) => ( 
                            (el == "created_at" || el == 'loss') &&
                            <td className={className + ` ${prediction["default_model"] && 'bg-blue-gray-50'}`}>
                              <Typography
                                variant="small"
                                className="text-xs font-bold uppercase text-blue-gray-500"
                              >
                                { el == "features" || el == "target" ? JSON.stringify(prediction[el]) : 
                                el == "created_at" ? new Date(prediction[el]).toLocaleString() :
                                prediction[el]}
                              </Typography>
                            </td>
                          ))}
                          <td className={className}>
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-row gap-4">
                              <Tooltip content="Delete">
                                <IconButton
                                  color="red"
                                  onClick={() => {
                                    console.log("Delete " + prediction.id + " model "+  selectedModel.value.id);
                                  }}
                                >
                                  <TrashIcon
                                    strokeWidth={2}
                                    className="h-5 w-5"
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
              ) : (
                <div className="items-center justify-center text-center p-4">
                  <Typography variant="h6" fullWidth color="blue-gray" className="font-normal">
                    No Prediction Found
                  </Typography>
                </div>
              )}
            </div> : null
          }
            
          </CardBody>
          <CardFooter className="justify-center">
          </CardFooter>
        </Card>        
      </div>
      </>
    );
  }
  
  export default Prediction;
  