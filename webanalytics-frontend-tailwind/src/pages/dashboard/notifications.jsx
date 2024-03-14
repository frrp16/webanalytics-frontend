import React from "react";
import { format, parseISO, set } from 'date-fns';
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { getUserInfo } from "@/services/auth.service";
import { getNotifications } from "@/services/notification.service";
import { InformationCircleIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useMaterialTailwindController, setUserInfo } from "@/context";
import { Alert, AlertTitle } from "@mui/material";

export function Notifications() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { accessToken, userInfo } = controller;
  // const [showAlerts, setShowAlerts] = React.useState({
  //   blue: true,
  //   green: true,
  //   orange: true,
  //   red: true,
  // });
  // const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
  //   blue: true,
  //   green: true,
  //   orange: true,
  //   red: true,
  // });
  // const alerts = ["gray", "green", "orange", "red"];
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications(accessToken);
        if (res.status === 200) {
          setNotifications(res.data);

        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }
  , []);

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Notifications
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-8 max-h-[400px] overflow-auto">
          {
            notifications.map((notification) => (
              <Alert
                key={notification.id}
                open={true}
                color={
                  notification.type.toLowerCase() == "error"
                    ? "error"
                    : notification.type.toLowerCase() == "warning"
                    ? "warning"
                    : notification.type.toLowerCase() == "info"
                    ? "info"
                    : "success"
                }
                icon={
                  notification.type.toLowerCase() === "error"
                    ? <XCircleIcon strokeWidth={2} className="h-6 w-6" />
                    : notification.type.toLowerCase() === "warning"
                    ? <ExclamationCircleIcon strokeWidth={2} className="h-6 w-6" />
                    : notification.type.toLowerCase() === "info"
                    ? <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
                    : <CheckCircleIcon strokeWidth={2} className="h-6 w-6" />

                }
                onClose={() => {}}
              >
                <AlertTitle>{notification.title}</AlertTitle>
                <Typography variant="small" color="blue-gray" className="text-sm font-normal">
                  {notification.message}
                </Typography>
                <Typography variant="small" color="blue-gray" className="text-xs">
                {/* {format(parseISO(notification.created_at), 'dd-MM-yyyy HH:mm:ss')} */}
                {new Date(notification.created_at).toLocaleString()}
                </Typography>
              </Alert>
            ))
          }
          {/* {alerts.map((color) => (
            <Alert
              key={color}
              open={showAlerts[color]}
              color={color}
              onClose={() => setShowAlerts((current) => ({ ...current, [color]: false }))}
            >
              A simple {color} alert with an <a href="#">example link</a>. Give
              it a click if you like.
            </Alert>
          ))} */}
        </CardBody>
        <CardFooter
          color="transparent"
          className="flex justify-center p-4"
        >
          {/* <Typography variant="small" color="blue-gray">
            View all
          </Typography> */}
        </CardFooter>        
      </Card>
      {/* <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Alerts with Icon
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {alerts.map((color) => (
            <Alert
              key={color}
              open={showAlertsWithIcon[color]}
              color={color}
              icon={
                <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
              }
              onClose={() => setShowAlertsWithIcon((current) => ({
                ...current,
                [color]: false,
              }))}
            >
              A simple {color} alert with an <a href="#">example link</a>. Give
              it a click if you like.
            </Alert>
          ))}
        </CardBody>
      </Card> */}
    </div>
  );
}

export default Notifications;
