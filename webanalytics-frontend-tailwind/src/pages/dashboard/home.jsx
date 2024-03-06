import React from "react";
import { format, parseISO } from 'date-fns';
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Button
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon, PlusIcon
} from "@heroicons/react/24/outline";
import { 
  TableCellsIcon,
  PuzzlePieceIcon, DocumentChartBarIcon
} from "@heroicons/react/24/solid";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { AddConnectionDialog, AddDatasetDialog } from "@/widgets/dialog";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context";

export function Home() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, accessToken, userInfo } = controller;

  const [showAddConnection, setShowAddConnection] = React.useState(false);
  const [showAddDataset, setShowAddDataset] = React.useState(false);

  const connectionDetails = userInfo ? [
    { label: 'Engine', value: userInfo?.connection?.database_type},
    { label: 'Host', value: userInfo?.connection?.host },
    { label: 'Database', value: userInfo?.connection?.database },
    { label: 'Username', value: userInfo?.connection?.username },
  ] : [];  

  const modelsDetails = userInfo ? userInfo.datasets.flatMap(dataset => dataset.models) : [];

  return (
  <>
    <AddConnectionDialog
      open={showAddConnection}
      onClose={() => setShowAddConnection(false)}
    />
    <AddDatasetDialog
      open={showAddDataset}
      onClose={() => setShowAddDataset(false)}
    />

    <div className="mt-12">      
      <div className="mb-6 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <Typography variant="h4" className="text-blue-gray-700">
          {`Welcome, ${userInfo?.first_name} ${userInfo?.last_name}!`}
        </Typography>
      </div> 
                  
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
        <Card className=" border border-blue-gray-100 shadow-sm w-full">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between px-6 pt-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Connection
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                {userInfo?.connection ? 
                <>
                  <CheckCircleIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                  <strong className="text-green-500">Connected to database</strong>
                </> : 
                <>
                  <XCircleIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                  <strong className="text-red-500">Not connected to any database</strong>
                </>}
              </Typography>
              </div>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            {userInfo?.connection ?               
            <>  
              <div className="flex flex-col gap-4 py-3"> 
              <table className="table-auto text-left w-full">
                <tbody>
                {connectionDetails.map((detail, index) => {
                  return (                                                                 
                    <tr key={index}>
                      <td className=" font-bold border-blue-gray-100 px-4 py-2 items-start">                              
                          <Typography variant="small" className="font-semibold text-blue-gray-700">
                            {detail.label} 
                          </Typography>                          
                      </td>
                      <td className=' border-blue-gray-100 px-2 py-2 items-start'>                              
                          <Typography variant="small" className="font-normal text-blue-gray-600">
                            : 
                          </Typography>                             
                      </td>
                      <td className=' border-blue-gray-100 px-4 py-2 items-start'>                              
                          <Typography variant="small" className="font-normal text-blue-gray-600">
                            {detail.value} 
                          </Typography>                             
                      </td>
                    </tr>                                             
                  );
              
                })
                }
                </tbody>
              </table>
              </div>            
            </> : 
            <>
            <div className="flex items-center gap-4 py-3">                  
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium"
              >
                Start by connecting to a database
              </Typography>            
            </div>
            <Button                   
              className="flex flex-row gap-4 items-center" 
              fullWidth 
              onClick={() => setShowAddConnection(!showAddConnection)}>
              <PlusIcon                    
                className={`w-5 h-5 text-white 
                ${showAddConnection ? 'transform rotate-90 transition-transform' : 'transform rotate-0 transition-transform'}`}                    
              />
              Add Connection
            </Button> 
          </>
          }                         
          </CardBody>
        </Card>                             
      </div>        
         
      {/* card */}
      {userInfo?.connection && 
        <>
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-3 xl:grid-cols-7">
            <div className="col-span-3">
              <StatisticsCard 
                color="gray"
                title="Datasets"
                icon={React.createElement(DocumentChartBarIcon, {
                  className: "w-6 h-6 text-white",
                })
                }
                value={userInfo?.datasets?.length}
                footer={
                  <>
                    <Typography className="font-normal text-blue-gray-600 pb-2">
                    &nbsp;With <strong className="text-yellow-700">
                    {userInfo?.datasets?.filter(dataset => dataset.status === "CHANGED").length}
                    </strong>
                      &nbsp;datasets in changed status
                    </Typography>
                    <Button                   
                      className="flex flex-row gap-4 items-center" 
                      fullWidth 
                      onClick={() => setShowAddDataset(!showAddDataset)}>
                      <PlusIcon                    
                        className={`w-5 h-5 text-white 
                        ${showAddDataset ? 'transform rotate-90 transition-transform' : 'transform rotate-0 transition-transform'}`}                    
                      />
                      Add Dataset
                    </Button>
                  </>
                }
              />
            </div>
            <div className="col-span-2">
              <StatisticsCard 
                color="gray"
                title="Models"
                icon={React.createElement(PuzzlePieceIcon, {
                  className: "w-6 h-6 text-white",
                })
                }
                value={modelsDetails.length}
                footer={
                  <>
                    <Typography className="font-normal text-blue-gray-600 pb-2">
                    &nbsp;Models Trained<strong className="text-green-500"></strong>                      
                    </Typography>
                    <Button                   
                      className="flex flex-row gap-4 items-center" 
                      fullWidth
                      onClick={() => console.log("SHow Models")}>
                      
                      Show Models
                    </Button>
                  </>
                }
              />
            </div>
            <div className="col-span-2">
              <StatisticsCard 
                color="gray"
                title="New Data"
                icon={React.createElement(TableCellsIcon, {
                  className: "w-6 h-6 text-white",
                })
                }
                value={userInfo?.datasets?.length}
                footer={
                  <>
                    <Typography className="font-normal text-blue-gray-600 pb-2">
                    &nbsp;From <strong className="text-green-500">0</strong>&nbsp;Dataset(s)                      
                    </Typography>                    
                  </>
                }
              />
            </div>            
          </div>
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-1 xl:grid-cols-1">
            <Card className=" border border-blue-gray-100 shadow-sm w-full">
              <CardHeader variant="gradient" color="gray" className="mb-2 p-6">
                <Typography variant="h6" color="white">
                  Datasets
                </Typography>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <table className="w-full min-w-[640px] table-auto">
                  <thead >
                    <tr>
                      {["name", "created at", "status", "action"].map((el) => (
                        <th
                          key={el}
                          className="border-b border-blue-gray-50 py-3 px-5 text-left"
                        >
                          <Typography
                            variant="small"
                            className="text-sm font-bold uppercase text-blue-gray-600"
                          >
                            {el}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userInfo?.datasets.map(
                      ({ name, description, created_at, status }, key) => {
                        const className = `py-3 px-5 ${
                          key === userInfo?.datasets.length - 1
                            ? ""  
                            : "border-b border-blue-gray-50"
                        }`;
                        return (
                          <tr key={name}>
                            <td className={className}>
                              <div className="flex items-center gap-4">
                                <div>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-semibold"
                                  >
                                    {name}
                                  </Typography>
                                  <Typography className="text-xs font-normal text-blue-gray-500">
                                    {description ? description : "No description"}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className={className}>
                              <Typography className="text-xs font-semibold text-blue-gray-600">
                                {format(parseISO(created_at), 'dd-MM-yyyy HH:mm:ss')}
                              </Typography>
                            </td>
                            <td className={className}>
                              <div className="w-10/12">
                                <Typography
                                  variant="small"
                                  className="mb-1 block text-xs font-medium text-blue-gray-600"
                                >
                                  {status}
                                </Typography>
                              </div>
                            </td>
                            <td className={className}>
                              <div className="w-10/12">
                                <Typography
                                  variant="small"
                                  className="mb-1 block text-xs font-medium text-blue-gray-600"
                                >
                                  
                                </Typography>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        
      {/* <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div> */}
      </>
      }
      {/* chart */}
      {(userInfo?.connection && userInfo?.datasets) && <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>}
      {/* <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
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
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div> */}
    </div>
  </>
  );
}

export default Home;
