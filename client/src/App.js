import AppRouter from "./AppRouter";
import React, { Component } from "react";
import { observer } from "mobx-react";
import { appStore } from "./store/appStore";
import api from "./shared/customAxios";
import { apiUrl } from "./shared/vars";
import Progress from "./components/Progress/Progress";
import "./App.css"
class App extends Component {
  state = {
    loading: false
  };
  componentDidMount() {
    this.setState({ loading: true });
    this.init();
  }
  init = async () => {
    console.log("APP - INIT");
    //get jwt token
    const token = window.localStorage.getItem("rp_token");
    if (token) {
      //get user from jwt token
      console.log("Found Token , fetching user");
      const user = await api.get(`${apiUrl}/api/twitter/self`);
      //change mobx store
      appStore.changeLoginState(true, user, token);
    } else appStore.changeLoginState(false, null, "");
    this.setState({ loading: false });
  };
  render() {
    return this.state.loading ? <Progress /> : <AppRouter />;
  }
}

export default observer(App);
