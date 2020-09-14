import React, { useState, useEffect } from "react";
import { Button, Typography, Paper } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import api from "../../shared/customAxios";
import { apiUrl } from "../../shared/vars";
import { observer } from "mobx-react";
import { appStore } from "../../store/appStore";
import Icon from "@mdi/react";
import { mdiTwitter } from "@mdi/js";

import TextField from '@material-ui/core/TextField';

const login = async () => {
  const res = await api.post(`${apiUrl}/api/auth/twitter/reverse`);
  console.log(res.data.oauth_token);
  if (res.data && res.data.oauth_token) {
    window.location.href =
      "https://api.twitter.com/oauth/authenticate?oauth_token=" +
      res.data.oauth_token;
  } else {
    window.alert("ERROR : " + res.message);
  }
};

function LoginPage(props) {
  const [isLoading, setLoading] = useState(false);

  const verify = async (query, props) => {
    setLoading(true);
    let res = await api.post(
      `${apiUrl}/api/auth/twitter`,
      JSON.stringify({ ...query })
    );
    if (res.status === 200 && res.data && res.data.token) {
      appStore.changeLoginState(true, null, res.data.token);
      props.history.push("/dashboard");
    } else {
      window.alert("Please try again later");
      appStore.changeLoginState(false, null, "");
      return;
    }
  };

  useEffect(() => {
    var search = window.location.search.substring(1);
    if (search) {
      const query = JSON.parse(
        '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
      );
      if (query && Object.keys(query).length > 0) {
        verify(query, props);
      }
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F7F7"
      }}
    >
      <Paper
        elevation={3}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "25px",
          width: '25%'
        }}
      >
        <Typography variant="h5" style={{ color: "#4a4b54" }} gutterBottom>
          Twitter Help Desk
        </Typography>
        <h3 style={{ margin: 0 }}>Already a member?</h3>
        <h5>Sign in to access your member benefits</h5>
        {/* <small>Enter your email and password.</small> */}

        <TextField
          id="outlined-full-width"
          label="Email"
          style={{ margin: 8 }}
          placeholder="Enter Your Email"
          helperText=""
          type="email"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
            type: 'email',
            required: true
          }}
          variant="outlined"
        />

        <TextField
          id="outlined-full-width"
          label="Password"
          style={{ margin: 8 }}
          placeholder="Enter Your Password"
          type="password"
          helperText=""
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
            type: 'password',
            required: true
          }}
          variant="outlined"
        />

        <Button
          disabled={isLoading}
          variant="contained"
          size="large"
          color="primary"
          aria-label="add"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          Sign in
        </Button>

        <Button
          disabled={isLoading}
          variant="contained"
          size="large"
          color="primary"
          aria-label="add"
          style={{ marginTop: "20px", marginBottom: "20px" }}
          startIcon={<Icon path={mdiTwitter} color="white" size={1} />}
          onClick={() => {
            setLoading(true);
            login();
          }}
        >
          Login with Twitter
        </Button>
        <span style={{ color: "#747880" }}>OR SignUp below</span>
        <Button
          disabled={isLoading}
          size="small"
          color="primary"
          aria-label="add"
          style={{ marginTop: "20px" }}
          onClick={() => {
            setLoading(true);
            login();
          }}
        >
          Connect Twitter Account
        </Button>
      </Paper>
    </div>
  );
}

export default observer(withRouter(LoginPage));
