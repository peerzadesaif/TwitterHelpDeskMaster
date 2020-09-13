import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles
} from "@material-ui/core";
import Icon from "@mdi/react";
import { mdiTwitter } from "@mdi/js";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  title: {
    flexGrow: 1,
    color: "#000000de"
  }
}));

export default function Header(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar color="transparent" elevation={0} position="static">
        <Toolbar>
          <Typography
            variant="h6"
            style={{ marginLeft: "5px" }}
            className={classes.title}
          >
            Updates
          </Typography>
          <Button color="inherit" onClick={props.logout} size={"medium"}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
