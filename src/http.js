//axios拦截
import axios from "axios";
import qs from "qs";

//进度条
import NProgress from "nprogress";
import "@/styles/nprogress.css";

import config from "@/config";

import useUserStore from "@/stores/userStore";
import useSystemStore from "@/stores/system";

import { useToast } from "vue-toastification";

// console.log(JSON.stringify({ VITE_APP_URL: import.meta.env.VITE_APP_URL }));

axios.defaults.baseURL = import.meta.env.VITE_APP_URL;

// 默认 post 请求，使用 application/json 形式

axios.defaults.headers.common["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.withCredentials = true;
axios.defaults.responseType = "json";

let needLoadingCount = 0;

axios.interceptors.request.use((request) => {
  if (needLoadingCount > 0) NProgress.start();

  //token
  let userStore = useUserStore();
  let token = userStore.getToken();
  if (token) {
    request.headers._tk = token;
  }

  //  qs全局解析一下请求数据
  if (request.method === "post") request.data = qs.stringify(request.data);
  return request;
});

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use(
  (response) => {
    if (needLoadingCount > 0) NProgress.done();

    // 格式化正常返回de数据
    var code = response.data.stat.code;
    let newUserToken = response.data.stat.newUserToken;
    const userStore = useUserStore();
    // 重新设置token
    if (newUserToken) {
      userStore.setToken(newUserToken, response.data.stat.newUserTokenExpire);
    }
    // update diff time
    const systime = response.data.stat.systime;
    if (systime) useSystemStore().updateDiffTime(systime);
    switch (code) {
      case 0:
        return formatResponseData(response.data);
      case -300:
      case -180:
      case -160:
      case -360:
      case -361:
      case -181:
      case -182:
        useToast.error("Please log in again");
        setTimeout(() => {
          userStore.loginOut();
          location.href = "/";
        }, 1000);
        break;
      case -400:
        useToast.error("Insufficient permissions");
        break;
      default:
        useToast.error(`${code}`);
        break;
    }
    return response.data;
  },
  (err) => {
    if (needLoadingCount > 0) NProgress.done();
    useToast.error(err.response.status);
    return Promise.reject(err);
  }
);

export default axios;

export function get(url, data) {
  let getParams = {
    params: {
      ts: new Date().getTime(),
    },
  };
  data = data || {};

  Object.assign(getParams.params, data);
  return axios.get(url, getParams);
}

// post请求
export function post(url, data) {
  data = data || {};
  return axios.post(url, data);
}
// put请求
export function put(url, data) {
  return axios.put(url, data);
}
// delete 请求
export function del(url, data) {
  return axios.delete(url, data);
}
// upload 请求
export function uploader(url, file) {
  let params = new FormData();
  params.append("file", file);
  return axios.post(url, params);
}

let requestQueue = [];

/*
  single 参数表示，是不是开启请求防重，一般用于表单提交
  使用：
  export function getMyAccountInfo() {
  return ajaxGateway({
    mt: "user.getMyAccountInfo",
    single:true
  });
}
*/
export function ajaxGateway(params) {
  const data = formatRequestParams(params);
  const flag = JSON.stringify(params);
  if (params.single) {
    if (requestQueue.includes(flag)) {
      console.warn(`Duplicate request blocked ${flag}`);
      return false;
    }
    requestQueue.push(flag);
  }
  if (!params.hideLoading) needLoadingCount++;
  return axios({
    method: "post",
    url: config.apiUrl,
    data: data,
  })
    .then((result) => {
      removeQueue(flag);
      if (!params.hideLoading) needLoadingCount--;
      return result;
    })
    .catch((error) => {
      removeQueue(flag);
      if (!params.hideLoading) needLoadingCount--;
      return error;
    });
}

function removeQueue(flag) {
  const index = requestQueue.indexOf(flag);
  if (index > -1) {
    requestQueue.splice(index, 1);
  }
}

function formatRequestParams(params) {
  const { mt, data = {} } = params;
  const _aid = config.appId;
  const _ts = Number(new Date());
  const isArray = Array.isArray(mt);
  const _mt = isArray ? mt.join(",") : mt;
  const checkData = isArray ? data : [data];
  // 删除undefined业务参数
  checkData.forEach((item) => {
    for (let key in item) {
      if (item[key] === undefined) {
        delete item[key];
      }
    }
  });

  // 组装参数对象
  let result = { _aid, _mt, _ts };
  const formatReqData = {};
  if (isArray) {
    checkData.forEach((item, i) => {
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          formatReqData[i + "_" + key] = item[key];
        }
      }
    });
    result = Object.assign({}, result, formatReqData);
  } else {
    result = Object.assign({}, result, data);
  }

  return result;
}

/**
 * 格式化返回响应数据
 * @param { Object } data 正常返回的数据
 * @return { Object } result 格式化后的数据
 */
export const formatResponseData = (data) => {
  const result = [];
  const { content, stat } = data;
  const stateArr = stat.stateList;

  stateArr.forEach((item, i) => {
    result[i] = {
      state: item,
      data: content[i],
    };
  });
  return result.length == 1 ? result[0] : result;
};
