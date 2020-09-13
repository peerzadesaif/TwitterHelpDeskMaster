const Twit = require("twit");
const keys = require("../config/keys");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
module.exports = (io, app) => {
  const createTwitClient = (key, secret) => {
    return new Twit({
      consumer_key: keys.TWITTER_CONSUMER_KEY,
      consumer_secret: keys.TWITTER_CONSUMER_SECRET,
      timeout_ms: 60 * 1000,
      access_token: key,
      access_token_secret: secret
    });
  };

  io.on("connection", socket => {
    socket.on("register_screen_name", data => {
      let { term: searchTerm, jwtToken } = data;
      let decoded = jwt.decode(jwtToken, keys.JWT_SECRET);
      if (decoded && decoded.user) {
        socket.join(searchTerm);
        stream(searchTerm, decoded.user);
      }
    });
  });

  const stream = (searchTerm, user) => {
    const twitter = createTwitClient(user.oauth_token, user.oauth_token_secret);
    console.log("Streaming for-", `@${searchTerm}`);
    let stream = twitter.stream("statuses/filter", {
      track: `@${searchTerm}`
    });
    stream.on("tweet", tweet => {
      console.log("New Tweet Recieved");
      sendMessage(tweet, searchTerm);
    });

    stream.on("error", error => {
      console.log(chalk.red("ERROR AT STREAMING - ", error));
    });
  };

  /**
   * Emits data from stream.
   * @param {String} msg
   */
  const sendMessage = (msg, searchTerm) => {
    if (msg.text.includes("RT")) {
      return;
    }
    io.to(searchTerm).emit("tweets", msg);
  };
};
