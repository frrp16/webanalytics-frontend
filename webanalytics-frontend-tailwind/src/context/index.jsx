import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import Cookies from "js-cookie";

import { getUserInfo } from "@/services/auth.service";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "SET_ACCESS_TOKEN": {
      return { ...state, accessToken: action.value };
    }
    case "SET_USER_INFO": {
      return { ...state, userInfo: action.value };
    }
    case "SET_SOCKET":{
      return { ...state, socket: action.value };
    }
    case "SET_SOCKET_URL":{
      return { ...state, socketURL: action.value };
    }
    case "SET_NOTIFICATION_MESSAGE": {
      console.log("SET_NOTIFICATION_MESSAGE", action.value);
      return { ...state, notificationMessage: action.value };
    }
    case "SET_SELECTED_DATASET": {
      return { ...state, selectedDataset: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  const accessTokenCookie = Cookies.get("accessToken");
  // const userInfoCookie = Cookies.get("userInfo");  
  const location = useLocation();
  
  const initialState = {
    // style context
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    // user context
    accessToken: accessTokenCookie ? JSON.parse(accessTokenCookie) : null,
    userInfo:  JSON.parse(localStorage.getItem('userInfo')) || null,
    socket: null,
    socketURL:  null,
    notificationMessage: null,
    // dataset context
    selectedDataset: null,
    
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);

    // Initialize WebSocket connection
    // useEffect(() => {
    //   if (controller.socketURL && controller.userInfo) {
    //     console.log(controller.socketURL);
    //     const ws = new WebSocket(controller.socketURL);
    //     setSocket(dispatch, ws);
    //     console.log("WebSocket connection initialized");
    //     return () => {
    //       ws.close();
    //     };
    //   }
    // }, [controller.socketURL]);

  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  React.useEffect(() => {
    if (controller.accessToken) {
      getUserInfo(controller.accessToken).then((res) => {
        if (res.status === 200) {
          setUserInfo(dispatch, res.data);
        }
      });
    }
  }
  , [location]);

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController() {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
export const setAccessToken = (dispatch, value) =>
  dispatch({ type: "SET_ACCESS_TOKEN", value });
export const setUserInfo = (dispatch, value) =>
  dispatch({ type: "SET_USER_INFO", value });
export const setSocket = (dispatch, value) =>
  dispatch({ type: "SET_SOCKET", value });
export const setSocketURL = (dispatch, value) =>
  dispatch({ type: "SET_SOCKET_URL", value });
export const setNotificationMessage = (dispatch, value) =>
  dispatch({ type: "SET_NOTIFICATION_MESSAGE", value });
export const setSelectedDataset = (dispatch, value) =>
  dispatch({ type: "SET_SELECTED_DATASET", value });
