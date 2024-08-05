import { defineStore } from "pinia";
import { lsSet, lsGet } from "../utils";
import api from "../api";

// expiringAt: 1650868324511
// nickname: "0x3BB27FC8"
// userId: 2
// userToken: "utk_IQ7UPwPf/dCk+q8iLCeEBRX9eoKq1sR0B28NDfrSunQW7GjXCjDgqgVXuExehVApvAyhsfGTYHDIVoTFImXbV4uOWEPmyZ95gglQPjnzxKo="
// username: "0x3bb27fc83e530cfc18769167ec1fc2238ec15b71"

let userInfoTpl = {
  userToken: "",
  username: "",
  expiringAt: 0,
  nickname: "",
  userId: 0,
};
const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: JSON.parse(JSON.stringify(userInfoTpl)),
    };
  },
  // could also be defined as
  actions: {
    setUserInfo(userInfo) {
      // console.log(userInfo);
      this.userInfo = userInfo;
    },
    isLogin() {
      return !!this.getToken();
    },
    loginOut() {
      this.userInfo = JSON.parse(JSON.stringify(userInfoTpl));
    },
    setToken(token, expiringAt) {
      this.userInfo.userToken = token;
      this.userInfo.expiringAt = expiringAt;
    },
    getToken() {
      this.isExpiring();
      return this.userInfo.userToken;
    },
    isExpiring() {
      if (this.userInfo.userToken && this.userInfo.expiringAt) {
        if (new Date() > new Date(this.userInfo.expiringAt)) {
          // console.log('isExpiring');
          //过期
          this.loginOut();
        }
      }
    },
    async refreshUserInfo() {
      let res = await api.accountManage.getCustomerInfo({
        customerId: this.userInfo.userId,
      });
      console.log(res);
      this.userInfo.nickname = res.data.nickname;
      this.userInfo.avatar = res.data.avatar;
    },
  },
});

//要移出去，不然会报错，提示你未安装pinia
export const initUserStore = () => {
  //当你要调用 useUserStore 的时候， 必须要放在 main.js 里面  app.use(pinia) 之后才行，所以才需要移动出去
  const instance = useUserStore();

  //get  要放到 save前面， 不然会执行两次
  const old = lsGet("user");
  if (old) {
    instance.$state = old;
  }

  //save
  instance.$subscribe((_, stage) => {
    // console.log({ ...stage });
    lsSet("user", { ...stage });
  });
};

export default useUserStore;
