import React from "react";
import { CircularProgress } from "@material-ui/core";

export default function Progress() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        flex: 1,
        zIndex: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.05)"
      }}
    >
      <CircularProgress></CircularProgress>
    </div>
  );
}
