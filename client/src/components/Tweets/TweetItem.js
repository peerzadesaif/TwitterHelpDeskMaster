import React from "react";
import { ListItem, Avatar, Divider, makeStyles } from "@material-ui/core";
import moment from "moment";
const useStyles = makeStyles(theme => ({
  root: {

  },
  marginGutter: {

    backgroundColor: 'transparent !important',
    border: '1px solid #e8e8e8',
    borderRadius: '2%'
  }
}));

function TweetItem(props) {
  let { tweet, handleReply, handleSelected, index } = props;
  console.log('props :>> ', props);
  const classes = useStyles();

  return (
    <>

      <ListItem
        className={classes.marginGutter}
        style={{ marginTop: index !== 0 ? '5px' : null, cursor: 'pointer' }}
        key={tweet.id.toString()}
        selected={props.selectedIndex !== tweet.id_str}
        onClick={() => {
          handleReply("@" + tweet.user.screen_name + " ");
          handleSelected(tweet.id_str, tweet);
        }}
      >
        <Avatar
          alt={tweet.user.name}
          src={tweet.user.profile_image_url}
        ></Avatar>
        <div style={{ marginLeft: "10px", maxWidth: "80%" }}>
          <b style={{ fontSize: "1em" }}>
            {tweet.user.name}{" "}
            <span
              style={{
                fontWeight: "normal",
                fontSize: "0.8em"
              }}
            >
              {moment(tweet.created_at).fromNow()}
            </span>
          </b>
          <p>
            <span style={{ fontSize: "0.8em" }}>{tweet.text}</span>
          </p>
        </div>
      </ListItem>
      {/* <Divider /> */}
    </>
  );
}

export default TweetItem