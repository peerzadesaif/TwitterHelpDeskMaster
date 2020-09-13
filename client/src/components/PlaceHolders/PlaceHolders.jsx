import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { Divider } from "@material-ui/core";

export function MentionsPlaceHolder() {
  return (
    <div className="placeholder-list">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 20
        }}
      >
        <Skeleton animation="wave" variant="circle" width={40} height={40} />
        <div
          style={{
            flexDirection: "column",
            flex: 0.8,
            marginLeft: 20
          }}
        >
          <Skeleton
            animation="wave"
            height={20}
            width="90%"
            style={{ marginBottom: 6 }}
          />
          <Skeleton animation="wave" height={20} width="40%" />
        </div>
      </div>
      <Divider />
    </div>
  );
}

export function ChatPlaceholder() {
  return (
    <div
      className="placeholder-chat"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px"
      }}
    >
      <Skeleton
        animation="wave"
        variant="rect"
        height={65}
        width="60%"
        style={{
          marginBottom: "10px",
          borderRadius: 50,
          position: "absolute",
          left: 10
        }}
      />
      <Skeleton
        animation="wave"
        variant="rect"
        height={65}
        width="60%"
        style={{
          marginBottom: 6,
          borderRadius: 50,
          position: "absolute",
          top: 100,
          right: 10
        }}
      />
      <Skeleton
        animation="wave"
        variant="rect"
        height={65}
        width="60%"
        style={{
          marginBottom: 6,
          borderRadius: 50,
          position: "absolute",
          top: 200,
          right: 10
        }}
      />
      <Skeleton
        animation="wave"
        variant="rect"
        height={65}
        width="60%"
        style={{
          marginBottom: 6,
          borderRadius: 50,
          position: "absolute",
          left: 10,
          top: 300
        }}
      />
      <Skeleton
        animation="wave"
        variant="rect"
        height={65}
        width="60%"
        style={{
          marginBottom: 6,
          borderRadius: 50,
          position: "absolute",
          right: 10,
          top: 400
        }}
      />
    </div>
  );
}
