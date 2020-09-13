import {
  observable,
  action,
  computed,
  configure,
  decorate,
  autorun,
  toJS
} from "mobx";
configure({ enforceActions: "observed" });

class AppStore {
  isLoggedIn = false;
  jwt = "";
  user = null;

  get jwtToken() {
    return this.jwt;
  }

  changeLoginState(boolean, user = null, jwt = "") {
    if (boolean) window.localStorage.setItem("rp_token", jwt);
    this.user = user;
    this.isLoggedIn = boolean;
    this.jwt = jwt;
  }

  updateUser(user) {
    this.user = user;
  }
}

decorate(AppStore, {
  isLoggedIn: observable,
  jwt: observable,
  jwtToken: computed,
  changeLoginState: action,
  updateUser: action
});

export const appStore = new AppStore();

autorun(() => {
  console.log("[MOBX]", toJS(appStore));
});
