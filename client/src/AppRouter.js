import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import LoginPage from "./layouts/Login/LoginPage";
import DashBoard from "./layouts/DashBoard/DashBoard";
import { appStore } from "./store/appStore";
import { observer } from "mobx-react";

const AppRouter = () => {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Switch>
          {!appStore.isLoggedIn && <Redirect from="/dashboard" to="/" exact />}
          {appStore.isLoggedIn && <Redirect from="/" to="/dashboard" exact />}
          <Route exact path="/dashboard" component={DashBoard} />
          <Route exact path="/" component={LoginPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default observer(AppRouter);
