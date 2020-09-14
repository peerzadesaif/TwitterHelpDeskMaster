import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import api from "../../shared/customAxios";
import { apiUrl } from "../../shared/vars";
import { Grid, Paper } from "@material-ui/core";
import { observer } from "mobx-react";
import { appStore } from "../../store/appStore";
import Header from "../../components/Header/Header";
import { withRouter } from "react-router-dom";
import ReplyBox from "../../components/ReplyBox/ReplyBox";
import TweetList from "../../components/Tweets/TweetList";
import ChatList from "../../components/Chats/ChatList";
import InfoColumn from "../../components/Information/InfoColumn";
import * as helpers from "../../helpers";


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: {},
      tweets: [],
      userTweets: [],
      selectedTweet: null,
      selectedIndex: null,
      replies: {},
      replyButtonDisabled: false,
      reply: ""
    };
  }

  getTweets = async () => {
    return await api.get(`${apiUrl}/api/twitter/tweets`);
  };

  getUserReplies = async () => {
    return await api.get(`${apiUrl}/api/twitter/user/tweets`);
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    this.init();
  }

  getUniqueReplies = (replies) => {
    let _replies = {}
    Object.keys(replies).map((x) => {
      _replies[x] = [...new Set(replies[x].map(x => x['id']))].map((id) => replies[x].find(a => a.id === id))
    })
    return _replies
  }

  init = async () => {
    const user = appStore.user
      ? appStore.user
      : await api.get(`${apiUrl}/api/twitter/self`);
    appStore.updateUser(user);
    const allTweets = await this.getTweets();
    const [pass, fail] = allTweets.reduce(
      ([p, f], e) =>
        e.in_reply_to_status_id === null ? [[...p, e], f] : [p, [...f, e]],
      [[], []]
    );
    let replies = {};
    pass.forEach(e => (replies[e.id] = []));

    const userReplies = await this.getUserReplies();

    replies = await this.createTweetsThread(fail, userReplies, replies);
    // Object.keys(replies).map((x) => {
    //   replies[x] = [...new Set(replies[x].map(x => x['id']))].map((id) => replies[x].find(a => a.id === id))
    // })
    replies = this.getUniqueReplies(replies);


    this.setState(
      {
        isLoading: false,
        user,
        tweets: pass,
        replies
      },
      () => this.initSockets()
    );
  };

  initSockets = async () => {
    const { user } = this.state;
    const socket = socketIOClient(apiUrl);
    socket.on("connect", async () => {
      console.log("Socket Connected! , Emitting screen Name", user.screen_name);
      socket.emit("register_screen_name", {
        term: user.screen_name,
        jwtToken: appStore.jwtToken
      });
      socket.on("tweets", tweet => {
        if (tweet.in_reply_to_status_id !== null) {
          this.handleIncomingReply(tweet);
        } else if (!this.state.tweets.some(o => o.id === tweet.id))
          this.setState({ tweets: [tweet].concat(this.state.tweets) });
      });
    });
    socket.on("disconnect", () => {
      socket.off("tweets");
      socket.removeAllListeners("tweets");
    });
  };

  createTweetsThread = async (tweets, userReplies, replies) => {
    let combined = [...tweets, ...userReplies].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    for (let tweet of combined) {
      if (replies[tweet.in_reply_to_status_id])
        replies[tweet.in_reply_to_status_id].push(tweet);
      else {
        for (const replyArrId of Object.keys(replies)) {
          if (
            replies[replyArrId].some(
              reply => reply.id === tweet.in_reply_to_status_id
            )
          ) {
            replies[replyArrId].push(tweet);
            break;
          }
        }
      }
    }
    return replies;
  };

  handleIncomingReply = tweet => {
    let { replies } = this.state;
    if (replies[tweet.in_reply_to_status_id])
      replies[tweet.in_reply_to_status_id].push(tweet);
    else {
      for (const replyArrId of Object.keys(replies)) {
        if (
          replies[replyArrId].some(
            reply => reply.id === tweet.in_reply_to_status_id
          )
        ) {
          if (replies[replyArrId].some(reply => reply.id === tweet.id)) return;
          replies[replyArrId].push(tweet);
          break;
        }
      }
    };

    replies = this.getUniqueReplies(replies);

    this.setState({ replies });
  };

  handleSelected = (index, tweet) => {
    this.setState({
      selectedIndex: index,
      selectedTweet: tweet
    });
  };

  handleReply = str => {
    this.setState({
      reply: str
    });
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  postReplies = async query => {
    if (this.state.selectedTweet === null) {
      window.alert("Please select a tweet to reply");
      return;
    }
    this.setState({ replyButtonDisabled: true });
    const { data } = await api.post(
      `${apiUrl}/api/twitter/postReplies`,
      JSON.stringify({
        inReplyToStatusId: query.selectedTweet.id_str,
        status: query.reply
      })
    );
    const replies = { ...query.replies };

    if (!replies[query.selectedTweet.id]) {
      replies[query.selectedTweet.id] = [];
    }
    replies[query.selectedTweet.id].push(data);

    replies = this.getUniqueReplies(replies);

    this.setState({
      reply: "@" + query.selectedTweet.user.screen_name + " ",
      replies,
      replyButtonDisabled: false
    });
  };

  logout = async () => {
    window.localStorage.clear();
    appStore.changeLoginState(false, null, "");
    setTimeout(() => {
      this.props.history.push("/");
    }, 100);
  };

  render() {
    let {
      replies,
      selectedIndex,
      selectedTweet,
      reply,
      tweets,
      isLoading,
      replyButtonDisabled
    } = this.state;
    // process.env.NODE_ENV === 'development' ? tweets = helpers.TweetList : [];
    // console.log('tweets :>> ', tweets);

    return (
      <Grid container spacing={0} style={{ height: '130vh' }}>
        <Grid style={{ backgroundColor: '#f7f6f2', maxWidth: '5.5%' }} item xs={1}>
          <List style={{ marginTop: "30vh" }}>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text} style={{ textAlign: 'center', marginTop: "20%" }}>
                <ListItemIcon style={{ margin: '0 auto', minWidth: '28px' }}>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                {/* <ListItemText primary={text} /> */}
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={11}>
          <Grid container spacing={1}>
            <Header logout={this.logout} />
            <Grid style={{ maxWidth: '6%' }} item xs={1}>
            </Grid>
            <Grid item xs={11}>
              <div style={{ height: "14%" }}>
                <div style={{
                  display: "flex", flexDirection: "row", margin: "10px", width: '90%',
                  textAlign: 'center'
                }}>
                  <h1>Conversation</h1>
                  <div className="search-box" style={{
                    margin: '30px', border: '1px solid #e7e6e2',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    padding: '0.2rem 0.4rem'
                  }}>
                    <img src="./img/search-solid.svg" height="12px" width="12px" alt="" />
                    <input style={{
                      border: 'none',
                      background: 'transparent'
                    }} placeholder="Quick search" type="text" />
                  </div>
                  <div>
                    <div style={{
                      margin: '30px', border: '1px solid #e7e6e2',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                      padding: '0.2rem 1.4rem',
                      paddingRight: '1.8rem',
                      cursor: 'pointer'
                    }}>
                      <img src="./img/search-solid.svg" height="12px" width="12px" alt="" />
                      <span >Filter</span>
                    </div>
                  </div>
                </div>
              </div>
              <Grid container spacing={0} >
                <Grid item xs={3} style={{ marginRight: '2%', marginLeft: '-2%' }}>
                  <TweetList
                    isLoading={isLoading}
                    tweets={tweets}
                    selectedIndex={selectedIndex}
                    handleReply={this.handleReply}
                    handleSelected={this.handleSelected}
                  ></TweetList>
                </Grid>
                <Grid style={{ backgroundColor: "#FFFFFF", border: '1px solid #e8e8e8' }} item xs={9}>
                  <Grid container spacing={0}>
                    <Grid style={{ backgroundColor: "#FFFFFF" }} item xs={8}>
                      <Paper
                        elevation={0}
                        style={{
                          height: "60vh",
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "#EBEBEB"
                        }}
                      >
                        <Grid item xs={12}>
                          <ChatList
                            isLoading={isLoading}
                            selectedTweet={selectedTweet}
                            replies={replies}
                          ></ChatList>
                        </Grid>

                        <Grid style={{ backgroundColor: "#FFFFFF", textAlign: 'center' }} item xs={12}>
                          <ReplyBox
                            reply={reply}
                            replyButtonDisabled={replyButtonDisabled}
                            handleInputChange={this.handleInputChange}
                            postReplies={() => {
                              this.postReplies({ reply, selectedTweet, replies });
                            }}
                          ></ReplyBox>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid style={{ backgroundColor: "#FFFFFF", border: '1px solid #e8e8e8' }} item xs={4}>
                      <InfoColumn selectedTweet={selectedTweet} />
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid >
    );
  }
}

export default observer(withRouter(DashBoard));
