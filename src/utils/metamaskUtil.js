const CHAIN_ID = import.meta.env.VITE_CHAIN_ID; //USDT chain_id
const CHAIN_NAME = import.meta.env.VITE_CHAIN_NAME; //网络名称
const CHAIN_RPC_URL = import.meta.env.VITE_CHSIN_RPC_URL; //RPC URL

import { useToast } from "vue-toastification";
import useUserStore from "../stores/userStore";
// import nftAbi from "../abis/abi.json";

const $message = useToast();

//检查当前链
export async function checkChain() {
  //todo:验证当前网络类型

  let chainId = await window.ethereum.request({ method: "eth_chainId" });

  // console.log(chainId);
  if (chainId == CHAIN_ID) {
    //验证 chainId
    return true;
  } else {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID }],
      });
    } catch (e) {
      $message.error(e.message);
      if (e.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: CHAIN_ID,
                chainName: CHAIN_NAME,
                nativeCurrency: {
                  decimals: 18,
                  name: "eth",
                  symbol: "ETH",
                },
                rpcUrls: [CHAIN_RPC_URL] /* ... */,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          $message.error(addError.message);
          return false;
        }
      }
      return false;
    } finally {
      // payLoaidng.value = false;
    }
  }
}

export function formatNumber(num, digits = 4) {
  num = (num + "").trim();
  let numArr = num.split(".");
  //小数位超过4位
  if (numArr.length == 2 && numArr[1].trim().length > digits) {
    num = numArr[0] + "." + numArr[1].slice(0, 4);
    return num;
  }
  return num;
}
export function formatNumberStr(str) {
  str = str.trim();
  if (str == "") {
    str = "";
    return "";
  }
  if (isNaN(str * 1)) {
    return "";
  }
  str = formatNumber(str);
  return str;
}

//检查当前的钱包用户是不是登录用户
export async function checkUserAddress() {
  let useUser = useUserStore();

  return new Promise((resolve, reject) => {
    (async function () {
      try {
        let address = await getUserAddress();
        resolve(
          useUser.userInfo.username.toLocaleLowerCase() ==
            address.toLocaleLowerCase()
        );
      } catch (error) {
        reject(error);
      }
    })();
  });
}

export async function getUserAddress() {
  return new Promise((resolve, reject) => {
    (async function () {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        resolve(accounts[0]);
      } catch (error) {
        reject(error);
      }
    })();
  });
}

export async function isConnect() {
  let accounts = await window.ethereum.request({
    method: "eth_accounts",
  });

  return !!accounts[0];
}
