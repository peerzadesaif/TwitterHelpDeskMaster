import React from "react";
import { List, Paper } from "@material-ui/core";
import { ChatPlaceholder } from "../PlaceHolders/PlaceHolders";
import ChatItem from "./ChatItem";

function ChatList(props) {
  let { isLoading, selectedTweet, replies } = props;
  return (
    <Paper elevation={0} style={{ height: "60vh", overflow: "scroll" }}>
      <List
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column"
        }}
      >
        {isLoading ? (
          <ChatPlaceholder></ChatPlaceholder>
        ) : selectedTweet ? (
          <ChatItem
            style={{
              marginLeft: "1%",
              backgroundColor: "#FBFBFB"
            }}
            item={selectedTweet}
          ></ChatItem>
        ) : (
              <span style={{ margin: "auto" }}>Select any Tweet to view!</span>
            )}
        {replies &&
          selectedTweet &&
          replies[selectedTweet.id] &&
          replies[selectedTweet.id].map((o, i) => (
            <ChatItem
              key={o.id_str + '___' + i}
              style={{
                marginLeft: "35%",
                backgroundColor: "#d8edb8"
              }}
              item={o}
            ></ChatItem>
          ))}
      </List>
    </Paper>
  );
}

export default ChatList