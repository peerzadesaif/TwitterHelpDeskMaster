import io from "socket.io-client";
import { apiUrl } from "./vars";
let socketClient = null;

class SocketClient {
  constructor(services) {
    this.services = services;
    this.endpoint = "http://127.0.0.1:5000";
    this.authenticate = this.authenticate.bind(this);
    this.connection = io(`http://localhost:5000`).connect();
    this.socketHandler = this.socketHandler.bind(this);
    this.socketHandler();
  }

  socketHandler() {
    this.connection.on("connect", () => {
      console.log("socket - connect");
      this.authenticate();
    });

    this.connection.on("disconnect", () => {
      console.log("socket - disconnect");
    });

    this.connection.on("newTweets", () => {
      this.services.getTweets();
      console.log("socket - newTweets");
    });

    this.connection.on("handshake", data => {
      console.log("handShake", data);
    });
  }

  authenticate = () => {
    const token = window.localStorage.getItem("rp_token");
    console.log("socket - authenticating", token);

    this.connection.emit("authenticate", { token }, () => {
      console.log("socket - authenticated");
    });
  };

  closeSocket = () => {
    this.connection.close();
  };
}

const createSocketClient = options => {
  console.log("options", options);
  if (!socketClient) {
    socketClient = new SocketClient(options);
  }

  return socketClient;
};

export const closeConnection = () => {
  if (socketClient) {
    socketClient.closeSocket();
    socketClient = null;
  }
};

export default createSocketClient;
