import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";
import { Avatar } from "@material-ui/core";
import UseMediaQuery from "../../hooks/UseMediaQuery";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(2)
    }
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));
export default function InfoCard(props) {
  let { selectedTweet } = props;
  const isRowBased = UseMediaQuery("(min-width: 1000px)");
  const classes = useStyles();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "10px",
        height: '60vh'
      }}
    >
      <div className={classes.root} >
        <Avatar
          alt={selectedTweet.user.name}
          src={selectedTweet.user.profile_image_url}
          className={classes.large}
        ></Avatar>
      </div>

      <div style={styles.screen_name(isRowBased)}>
        <b style={{ margin: "6px" }}>{selectedTweet.user.name}</b>
      </div>
      <div style={{
        display: "flex", flexDirection: "row", margin: "10px", width: '90%',
        justifyContent: 'space-evenly'
      }}>
        <div >
          <img src="./img/search-solid.svg" height="12px" width="12px" alt="" />
          <span>Call</span>
        </div>
        <div >
          <img src="./img/search-solid.svg" height="12px" width="12px" alt="" />
          <span>Email</span>
        </div>
      </div>

      <div style={{
        display: "flex", flexDirection: "row", margin: "10px", width: '90%',
        justifyContent: 'space-between'
      }}>

        <span style={{ color: "#747880" }}>
          Followers
        </span>
        <span style={{ color: "#747880" }}>
          {selectedTweet.user.followers_count}{" "}
        </span>
      </div>

      <div style={{
        display: "flex", flexDirection: "row", margin: "10px", width: '90%',
        justifyContent: 'space-between'
      }}>

        <span style={{ color: "#747880" }}>
          Country
        </span>
        <span style={{ color: "#747880", textAlign: 'right' }}>
          {selectedTweet.user.location
            ? selectedTweet.user.location
            : "Unknown"}
        </span>
      </div>
    </div>
  );
}

const styles = {
  screen_name: isRowBased => ({
    width: "100%",
    margin: "6px",
    display: "flex",
    flexDirection: isRowBased ? "row" : "column",
    justifyContent: isRowBased ? "center" : "space-around",
    alignItems: "center"
  })
};
