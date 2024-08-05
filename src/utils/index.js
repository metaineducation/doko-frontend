import useSystemStore from "../stores/system";
import UrlParser from "url-parse";
import { default as dayjs } from "dayjs";
import { useToast } from "vue-toastification";

export function lsGet(key) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (error) {
    return value;
  }
}

export function lsSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function lsRemove(key) {
  window.localStorage.removeItem(key);
}

//运算
function add(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) + mul(b, e)) / e;
}
function sub(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) - mul(b, e)) / e;
}
function mul(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {
    console.error(f);
  }
  try {
    c += e.split(".")[1].length;
  } catch (f) {
    console.error(f);
  }
  return (
    (Number(d.replace(".", "")) * Number(e.replace(".", ""))) / Math.pow(10, c)
  );
}
function div(a, b) {
  var c,
    d,
    e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {
    console.error(f);
  }
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {
    console.error(f);
  }
  return (
    (c = Number(a.toString().replace(".", ""))),
    (d = Number(b.toString().replace(".", ""))),
    mul(c / d, Math.pow(10, f - e))
  );
}

export const ADD = add;
export const SUB = sub;
export const MUL = mul;
export const DIV = div;

export function formatDate(timeStamp, fmt) {
  let date = timeStamp instanceof Date ? timeStamp : new Date(timeStamp);
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      String(date.getFullYear()).substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ("00" + o[k]).substr(String(o[k]).length)
      );
    }
  }
  return fmt;
}

export function formatFromNowDateTime(timeStamp, fmt) {
  // get current systime
  const store = useSystemStore();
  const currentSysTime = store.getCurrentSysTime();
  const diffTime = Math.abs(currentSysTime - timeStamp);
  console.log("diffTime", diffTime);
  // more then 3 days show fmt
  if (diffTime > 3 * 24 * 60 * 60 * 1000) {
    return formatDate(timeStamp, fmt);
  }
  // more then 1 day show day
  if (diffTime > 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffTime / (24 * 60 * 60 * 1000))} days ago`;
  }
  // more then 1 hour show hour
  if (diffTime > 60 * 60 * 1000) {
    return `${Math.floor(diffTime / (60 * 60 * 1000))} hours ago`;
  }
  // others show minute
  return `${Math.floor(diffTime / (60 * 1000)) || 1} mins ago`;
}

export function handleApiResponse(result, fn) {
  let results = Array.isArray(result) ? result : [result];
  let resultWithError = results.find((v) => v.state.code !== 0);
  if (!resultWithError) {
    if (typeof fn === "function") fn.call(null, results);
    return;
  }
  alert(resultWithError.state.msg);
}

export function addDays(date, n) {
  let dateObject = date instanceof Date ? date : new Date(date);
  return new Date(dateObject.getTime() + n * 24 * 60 * 60 * 1000);
}

let unique = 0;

export function uuid(prefix) {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);

  unique++;

  return prefix + "_" + random + unique + String(time);
}

// 补齐小数位
function completeNumber(target = "", n = 1) {
  if (target.length >= n) return target.slice(0, n);
  while (target.length < n) {
    target += "0";
  }
  return target;
}

export function formatNumber2KOrM(n, digit = 1, needComplete = false) {
  // if not valid return ''
  if (isNaN(n)) return "";
  let isNegative = String(n).charAt(0) === "-";
  let target = String(Math.abs(n));
  let dotPosition =
    target.indexOf(".") > -1 ? target.indexOf(".") : target.length;
  let number = "";
  let dotNumber = "";
  let unit = "";
  // 1M = 1000000 ?
  if (Number(target) >= 1000000) {
    dotPosition = dotPosition - 6;
    number = target.slice(0, dotPosition);
    dotNumber = needComplete
      ? completeNumber(
          target.slice(dotPosition + 1, dotPosition + 1 + digit),
          digit
        )
      : target.slice(dotPosition + 1, dotPosition + 1 + digit);
    unit = "M";
  } else if (Number(target) >= 1000) {
    dotPosition = dotPosition - 3;
    number = target.slice(0, dotPosition);
    dotNumber = needComplete
      ? completeNumber(
          target.slice(dotPosition + 1, dotPosition + 1 + digit),
          digit
        )
      : target.slice(dotPosition + 1, dotPosition + 1 + digit);
    unit = "K";
  } else {
    number = target.slice(0, dotPosition);
    dotNumber = needComplete
      ? completeNumber(
          target.slice(dotPosition + 1, dotPosition + 1 + digit),
          digit
        )
      : target.slice(dotPosition + 1, dotPosition + 1 + digit);
  }
  return `${isNegative ? "-" : ""}${number}${
    dotNumber ? "." : ""
  }${dotNumber}${unit}`;
}

export function getUrlInfo(urlString = "") {
  urlString = urlString || location.href;
  return new UrlParser(urlString);
}

// 格式化 年月日时分秒
export function formatTime(Timestamp) {
  return dayjs(Timestamp).format("YYYY-MM-DD HH:mm:ss");
}

//格式化 gwei
export function formatGwei(gwei) {
  return window.Web3.utils.fromWei(gwei + "", "gwei");
}

//格式化   十进制转  gwei
export function parseGwei(gwei) {
  return window.Web3.utils.toWei(gwei + "", "gwei");
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export function mergeDeep(...objects) {
  const isObject = (obj) => obj && typeof obj === "object";

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

export function timeleft(timeStamp) {
  let diffTime = Math.abs(new Date(timeStamp.valueOf() - new Date().valueOf()));
  let days = diffTime / (24 * 60 * 60 * 1000);
  let hours = (days % 1) * 24;
  let minutes = (hours % 1) * 60;
  let secs = (minutes % 1) * 60;
  [days, hours, minutes, secs] = [
    Math.floor(days),
    Math.floor(hours),
    Math.floor(minutes),
    Math.floor(secs),
  ];
  return [days, hours, minutes, secs];
}

export function formatTimeleft(expiringAt) {
  let [days, hours, minutes] = timeleft(expiringAt);
  // console.log([days, hours, minutes, secs]);
  days = days > 0 ? `${days}d` : "";
  hours = hours > 0 ? `${hours}h` : "";
  minutes = minutes > 0 ? `${minutes}m` : "";

  return `${days} ${hours} ${minutes}`;
}

//url参数，无则添加，有则修改。 一次只能操作一个
//api.addOrChangeUrlParameter(url,'aa=bb');
export function addOrChangeUrlParameter(url, param) {
  url = url.replace(new RegExp(param.split("=")[0] + "=[^&]*"), param);
  return (
    url +
    (url.indexOf(param) >= 0 ? "" : (url.indexOf("?") >= 0 ? "&" : "?") + param)
  );
}

//验证文件大小
export function verificationPicSize(file, maxSize = 5) {
  var fileSize = 0;
  var fileMaxSize = maxSize * 1024; //默认5M
  let toast = useToast();
  fileSize = file.size;
  var size = fileSize / 1024;
  if (size > fileMaxSize) {
    toast.error("max size 5M");
    file.value = "";
    return false;
  } else if (size <= 0) {
    toast.error("file not empty");
    file.value = "";
    return false;
  }
  return true;
}

//验证图片宽高
export function verificationPicWH(f, w, h) {
  let toast = useToast();
  //读取图片数据
  return new Promise((resolve) => {
    var reader = new FileReader(); //通过FileReader类型读取文件中的数据（异步文件读取）
    reader.onload = function (e) {
      var data = e.target.result; //返回文件框内上传的对象
      //加载图片获取图片真实宽度和高度
      var image = new Image();
      image.onload = function () {
        var width = image.width;
        var height = image.height;
        console.log(
          "文件像素宽：" +
            width +
            "，文件像素高：" +
            height +
            "文件大小：" +
            f.size +
            "字节"
        );
        if ((width == w) & (height == h)) {
          resolve(true);
        } else {
          toast.error("Max size 200 x 200 px");
          resolve(false);
        }
      };
      image.src = data; //img.src 应该是放在 onload 方法后边的, 因为当image的src发生改变，浏览器就会跑去加载这个src里的资源,先告诉浏览器图片加载完要怎么处理，再让它去加载图片
    };
    reader.readAsDataURL(f); //读取文件并将文件数据以URL形式保存到result属性中。 读取图像常用
  });
}
