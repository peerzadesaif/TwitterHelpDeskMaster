const request = require("request");
const keys = require("../config/keys");
const sharedFunctions = require("../lib/sharedFunctions");
const CLIENT_HOME_PAGE_URL =
  keys.ENV === "production"
    ? "https://saif-twitter-helpdesk.herokuapp.com"
    : "http://localhost:3000";

module.exports = {
  getToken: async (req, res, next) => {
    try {
      const payload = {
        ...req.body
      };
      req.token = sharedFunctions.createToken(payload);
      console.log('x-auth-token', req.token)
      res.setHeader("x-auth-token", req.token);
      res.set("x-auth-token", req.token);
      return res.status(200).send({ token: req.token });
    } catch (error) {
      console.log("error", error);
      return next(error);
    }
  },

  authRequest: async (req, res, next) => {
    request.post(
      {
        url: "https://api.twitter.com/oauth/access_token",
        oauth: {
          consumer_key: keys.TWITTER_CONSUMER_KEY,
          consumer_secret: keys.TWITTER_CONSUMER_SECRET,
          oauth_token: req.body.oauth_token
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
          oauth_verifier: req.body.oauth_verifier,
          oauth_token: req.body.oauth_token
        }
      },
      (err, r, body) => {
        console.log('err', err)
        console.log('body', body)

        try {
          if (err) {
            return res.send(500, { message: err.message });
          }
          console.log('body', body)
          const parsedBody = sharedFunctions.makeJson(body);

          req.body.oauth_token = parsedBody.oauth_token;
          req.body.oauth_token_secret = parsedBody.oauth_token_secret;
          req.body.user_id = parsedBody.user_id;

          next();
          return true;
        } catch (error) {
          return next(error);
        }
      }
    );
  },

  reverse: async (req, res, next) => {
    console.log('CLIENT_HOME_PAGE_URL', CLIENT_HOME_PAGE_URL)
    console.log('keys.TWITTER_CONSUMER_SECRET', keys.TWITTER_CONSUMER_SECRET)
    request.post(
      {
        url: "https://api.twitter.com/oauth/request_token",
        oauth: {
          consumer_key: keys.TWITTER_CONSUMER_KEY,
          consumer_secret: keys.TWITTER_CONSUMER_SECRET
        },
        form: {
          oauth_callback: CLIENT_HOME_PAGE_URL
        }
      },
      (err, r, body) => {
        try {
          if (err) {
            return res.send(500, { message: err.message });
          } else {
            console.log('body', body)
            const jsonBody = sharedFunctions.makeJson(body);
            return res.send(jsonBody);
          }
        } catch (error) {
          console.log("error at twitter reverse controller - ", error);
          return next(error);
        }
      }
    );
  }
};
