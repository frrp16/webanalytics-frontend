import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { ConfirmDialog } from "@/widgets/dialog";
import { logout } from "@/services/auth.service";



export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav, accessToken, userInfo } = controller;

  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",  
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <>
    <ConfirmDialog
      open={showLogoutDialog}
      onClose={() => setShowLogoutDialog(false)}
      title="Logout"
      onConfirm={() => {
        logout();
        setShowLogoutDialog(false);
        window.location.reload();
      }}
        
    >
      <Typography color="blue-gray" className="text-center">
        Are you sure you want to logout?
      </Typography>      
    </ConfirmDialog>
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div
        className={`relative`}
      >
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h4"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        <div className="flex flex-col ">
        {routes.map(({ layout, title, pages }, key) => ( 
          layout == "dashboard" && 
          <ul key={key} className="mb-4 flex flex-col gap-4">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}        
          <div className="mt-8">
          <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="text"
              color={
                "blue-gray"
              }
              className="flex items-center gap-4 px-4 capitalize"
              fullWidth
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <Typography
                color="inherit"
                className="font-bold capitalize"
              >
                Logout
              </Typography>
            </Button>
          </div>        
        </div>
      </div>
    </aside>
    </>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Webanalytics",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
