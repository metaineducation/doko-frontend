import { useToast } from "vue-toastification";
import { ajaxGateway } from "./http";

const toast = useToast();
/*
语法糖
let res = api.userLogin.requestMetaMaskNonce();

api.r(res,()=>{
  请求成功的内容
  console.log(res);
})

http://52.76.38.14:9000/apigw/info.html

接口文档里面如果返回值是对象，那么 就是 res.data字段
如果是 数组，那么可能是  res.data.value  比如接口 transactionHistory.getTransactionStatistics


用proxy的特性， 劫持属性，  这样开发的时候， 直接从 api文档里面复制 方法名就能用了。

api.r 方法 主要是用来处理错误，然后显示用的。 这样请求接口的时候就不用 每次写 错误判断了。
是否使用api.r 方法取决于你想不想 用统一的拦截错误的方式。

你也可以不用api.r 自己去针对具体错误 ，做具体的业务。

*/
let api = {};
api = new Proxy(api, {
  get(target, group) {
    if (group == "r") {
      //处理报错
      return function r(res, cb) {
        if (res.state.code) {
          return toast.error(res.state.msg);
        }
        cb();
      };
    }
    return new Proxy(
      {},
      {
        get(target, methodName) {
          return function (params) {
            // console.log('请求' + group + '.' + methodName);
            // console.log('参数',params);
            params = params || {};
            return ajaxGateway({
              mt: group + "." + methodName,
              data: params,
            });
          };
        },
      }
    );
  },
});

export default api;
