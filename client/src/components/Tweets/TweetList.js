import React from "react";
import { Paper, List } from "@material-ui/core";
import { MentionsPlaceHolder } from "../PlaceHolders/PlaceHolders";
import TweetItem from "./TweetItem";

function TweetList(props) {
  let { isLoading, tweets, selectedIndex, handleReply, handleSelected } = props;


  return (
    <Paper elevation={0} style={{ height: "89vh", overflow: "scroll" }}>
      <List
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          padding: 0
        }}
      >
        {isLoading ? (
          Array(10)
            .fill(0, 0)
            .map((e, i) => <MentionsPlaceHolder key={i.toString()} />)
        ) : tweets.length > 0 ? (
          tweets.map((o, i) => (
            <TweetItem
              key={i.toString()}
              index={i}
              tweet={o}
              selectedIndex={selectedIndex}
              handleReply={s => handleReply(s)}
              handleSelected={(id_str, o) => handleSelected(id_str, o)}
            ></TweetItem>
          ))
        ) : (
              <span>No mentioned tweets found</span>
            )}
      </List>
    </Paper>
  );
}

export default TweetList;