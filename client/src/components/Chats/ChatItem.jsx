import React from "react";
import { observer } from "mobx-react";
import { appStore } from "../../store/appStore";
import { ListItem, Avatar } from "@material-ui/core";
import moment from "moment";

function ChatItem(props) {
  let { style, item } = props;
  const isUser = appStore.user.screen_name === item.user.screen_name;
  return (
    <div
      style={{
        // marginLeft: isUser ? "35%" : "1%",
        display: "flex",
        padding: '1%',
        flexDirection: "row"
      }}
    >
      <Avatar alt={item.user.name} src={item.user.profile_image_url} />
      <ListItem
        style={{
          marginLeft: "1%",
          marginBottom: "2%",
          width: "90%",
          borderWidth: "1px",
          // borderStyle: "solid",
          // borderColor: "#d3d3d3",
          // borderRadius: "20px",
          // borderTopLeftRadius: 0,
          // backgroundColor: isUser ? "#d8edb8" : "#FBFBFB"
        }}
      >
        <span style={{ width: '100%' }}>
          <b className="user-name">{item.user.name}</b> <br />
          <p
            style={{
              fontSize: "1em",
              marginRight: "5px"
            }}
            className="user-tweet"
          >
            {item.text}
          </p>
          <p className="created-at" style={{ fontSize: "0.8em", textAlign: 'right' }}>
            {/* {moment(item.created_at).fromNow()} */}
            {moment(moment(item.created_at).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD')) ? `${moment(item.created_at).format('HH:mm')} (Reaction: ${moment(item.created_at).fromNow()})` : moment(item.created_at).fromNow()}
          </p>
        </span>
      </ListItem>
    </div>
  );
}

export default observer(ChatItem);
