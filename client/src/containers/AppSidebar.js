import "../index.css";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AppMain } from "./AppMain";

export const AppSidebar = () => {
  return (
    <Router>
      <AppMain />
    </Router>
  );
};
