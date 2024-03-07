import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Spinner,
    Button, IconButton,
    Menu, MenuList, MenuItem, MenuHandler, CardFooter,
} from "@material-tailwind/react";
import { ChevronDoubleDownIcon, ChevronDownIcon, ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Snackbar, Alert } from "@mui/material";
import { getDatasetData, getPreviosNextPage } from "@/services/dataset.service";
import { useMaterialTailwindController, setSelectedDataset } from "@/context";

  export function Datasets() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { accessToken, selectedDataset, userInfo } = controller;

    const datasetData = React.useRef(null)
    const [loading, setLoading] = React.useState(false);
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [showError, setShowError] = React.useState(false);

    const [activePage, setActivePage] = React.useState(1);
 
    const next = async () => {
      if (activePage === datasetData.current?.total_pages) return;
      
      try{
        setLoading(true);
        const res = await getPreviosNextPage(datasetData.current?.next, accessToken)
        if (res.status === 200) {
          datasetData.current = res.data;
          setLoading(false);
          setActivePage(activePage + 1);
        }
      }
      catch (error) {
        console.error(error);
        setShowError(true);
        setLoading(false);
      }      
    };
  
    const prev = async () => {
      if (activePage === 1) return;      
      try{
        setLoading(true);
        const res = await getPreviosNextPage(datasetData.current?.previous, accessToken)
        if (res.status === 200) {
          datasetData.current = res.data;
          setLoading(false);
          setActivePage(activePage - 1);
        }
      }
      catch (error) {
        console.error(error);
        setShowError(true);
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        if (!selectedDataset) return;
        setLoading(true);
        const res = await getDatasetData(selectedDataset.value.id, accessToken);
        if (res.status === 200) {
          datasetData.current = res.data;
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

    return (
      <>
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
              Failed to Load Dataset!
          </Alert>      
      </Snackbar>
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
                    console.log(datasetData.current);
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
              </div> : selectedDataset ? selectedDataset.value.name : "No dataset selected"}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-scroll px-0 pt-0 pb-2 max-h-[500px]">            
            {datasetData.current ? ( 
            <table className="w-full min-w-[640px] table-auto">
              <thead className="sticky top-0 z-1 bg-white">
                <tr>
                  {Object.keys(datasetData.current.results[0]).map((el) => (
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
                        <IconButton
                          size="sm"
                          variant="text"
                          color="blue-gray"
                          onClick={() => console.log("Sort by " + el)}
                        >
                          <ChevronDownIcon className="h-5 w-5" />
                        </IconButton>
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datasetData.current.results.map((row, key) => {
                  const className = `py-3 px-5 ${
                    key === datasetData.current.results.length
                      ? ""
                      : "border-b border-r border-blue-gray-50"
                  }`;
                  return (
                    <tr key={key}>
                      {Object.keys(row).map((el) => (
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-bold uppercase text-blue-gray-400"
                          >
                            {row[el]}
                          </Typography>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
              ) : null}              
            
          </CardBody>
          <CardFooter className="justify-center">
          {datasetData.current && 
          <div className="flex items-center justify-center gap-8">
            <IconButton
              size="sm"
              variant="outlined"
              onClick={prev}
              disabled={activePage === 1}
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
            <Typography color="gray" className="font-normal">
              Page <strong className="text-gray-900">{activePage}</strong> of{" "}
              <strong className="text-gray-900">{datasetData.current.total_pages}</strong>
            </Typography>
            <IconButton
              size="sm"
              variant="outlined"
              onClick={next}
              disabled={activePage === datasetData.current?.total_pages}
            >
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
          </div>}
          </CardFooter>
        </Card>
        {/* <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Projects Table
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion", ""].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
  
                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "gray"}
                              className="h-1"
                            />
                          </div>
                        </td>
                        <td className={className}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            <EllipsisVerticalIcon
                              strokeWidth={2}
                              className="h-5 w-5 text-inherit"
                            />
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card> */}
      </div>
      </>
    );
  }
  
  export default Datasets;
  