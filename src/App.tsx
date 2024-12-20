import React, { useState, useEffect } from "react";
import { Link, useRoutes } from "react-router-dom";
import { routes } from "./router/index";
import RouterBefore from "./router/RouterBefore";

function App() {
  const route = useRoutes(routes);
  console.log(route);
  
  // return <RouterBefore>{route}</RouterBefore>;
  return <>{route}</>;
}

export default App;
