import "../index.css";
import { Switch, Route } from "react-router-dom";

import { Marketplace } from "./Marketplace";
import { Dashboard } from "./Dashboard";
import { AppHeader } from "./AppHeader";
import { Welcome } from "./Welcome";

export const AppMain = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Welcome />
      </Route>
      <Route path="/marketplace">
        <div>
          <AppHeader title="Marketplace" />
          <div className="app-main">
            <Marketplace />
          </div>
        </div>
      </Route>
      <Route path="/dashboard">
        <div>
          <AppHeader title="Dashboard" />
          <div className="app-main">
            <Dashboard />
          </div>
        </div>
      </Route>
    </Switch>
  );
};
