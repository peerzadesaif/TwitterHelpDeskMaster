module.exports = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "https://saif-twitter-helpdesk.herokuapp.com"
      : "http://localhost:5000"
};
