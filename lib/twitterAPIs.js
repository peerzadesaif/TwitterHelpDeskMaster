const Twit = require("twit");
const keys = require("../config/keys");

const twitterClient = function(token, secret) {
  const client = new Twit({
    consumer_key: keys.TWITTER_CONSUMER_KEY,
    consumer_secret: keys.TWITTER_CONSUMER_SECRET,
    timeout_ms: 60 * 1000,
    access_token: token,
    access_token_secret: secret
  });

  return {
    getUserDetails() {
      return client.get("/account/verify_credentials", {});
    },
    getTweets(query) {
      return client.get("/search/tweets", { q: query });
    },
    streamTweets(query) {
      return client.stream("statuses/filter", { track: query });
    },
    mentionedTweets() {
      return client.get("/statuses/mentions_timeline", { count: 100 });
    },
    userTimelineTweets() {
      return client.get("/statuses/user_timeline", { count: 100 });
    },
    homeTimelineTweets() {
      return client.get("/statuses/home_timeline");
    },
    postReplies(params) {
      return client.post("/statuses/update", params);
    }
  };
};

module.exports = twitterClient;
