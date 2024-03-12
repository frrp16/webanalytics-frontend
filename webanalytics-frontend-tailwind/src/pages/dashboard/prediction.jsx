import React from "react";
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
import { AddModelDialog, TrainModelDialog, InfoModelDialog } from "@/widgets/dialog";
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
    const [openTrainModelDialog, setOpenTrainModelDialog] = React.useState(false);
    const [openInfoModelDialog, setOpenInfoModelDialog] = React.useState(false);

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
      <div className="mt-8 mb-8 flex flex-col gap-12">
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
            <table className="table-auto text-left w-full">
              <tbody>
                <tr>
                  <td className=" font-bold border-blue-gray-100 px-4 py-2 items-start">                              
                    <Typography variant="small" className="font-semibold text-blue-gray-700 uppercase">
                      Current default model
                    </Typography>                          
                  </td>
                  <td className="border-blue-gray-100 px-4 py-2">
                    {datasetModel.current.filter((model) => model.default_model)
                    .map((model, key) => (
                      <div key={key} className="flex flex-row gap-4 items-center">
                        <IconButton
                          size="sm"
                          onClick={() => {
                            // setSelectedModel({
                            //   label: row.name,
                            //   value: row                                  
                            // });     
                            // setOpenInfoModelDialog(true);
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
                    ))}
                  </td>
                </tr>
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
  
  export default Prediction;
  