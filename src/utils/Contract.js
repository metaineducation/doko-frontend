import nftAbi from "../abis/nft.json";
import exchangeAbi from "../abis/exchange.json";
import airDropAbi from "../abis/airdrop.json";
// import { useToast } from "vue-toastification";
import { checkChain } from "./metamaskUtil";
// const toast = useToast();

/*
 NFT({
    name:'mint'
    read:true,//是否只读
    params:[window.ethereum.selectedAddress, Date.now()+''],
    success:function(receipt){
      console.log("receipt");
      console.log(receipt);
    },
    error:(e)=>{
      console.error(e.message);
    },
    finally:()=>{
      //laoding.value = false;
    }
  },nftContract)
*/
export async function NFT(obj, nftContract) {
  await doContract(obj, nftContract, nftAbi);
}

/*
 Exchange({
    name:'mint'
    read:true,//是否只读
    params:[window.ethereum.selectedAddress, Date.now()+''],
    success:function(receipt){
      console.log("receipt");
      console.log(receipt);
    },
    error:(e)=>{
      console.error(e.message);
    },
    finally:()=>{
      //laoding.value = false;
    }
  },exchangeContract)
*/
export async function Exchange(obj, exchangeContract) {
  await doContract(obj, exchangeContract, exchangeAbi);
}

/*
  空投  airdrop
*/
export async function AirDrop(obj, airDropContract) {
  await doContract(obj, airDropContract, airDropAbi);
}

async function doContract(obj, contractName, abi) {
  //只读的模式 是 call
  //写的模式是  send

  let check = await checkChain();
  if (check == false) {
    return;
  }

  if (obj.read) {
    await doRead(obj, contractName, abi);
  } else {
    await doWrite(obj, contractName, abi);
  }
}

async function doWrite(obj, contractName, abi) {
  const web3 = new window.Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractName);
  const selectAddress = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  try {
    let res = await contract.methods[obj.name](...obj.params)
      .send(Object.assign({ from: selectAddress[0] }, obj.sendParams || {}))
      .on("receipt", (receipt) => {
        obj.success(receipt);
      });
    console.log(res);
  } catch (e) {
    console.error(e);
    obj.error && obj.error(e);
  } finally {
    obj.finally && obj.finally();
  }
}

async function doRead(obj, contractName, abi) {
  const web3 = new window.Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractName);
  try {
    console.log("doRead params", ...obj.params);
    await contract.methods[obj.name](...obj.params)
      .call({ from: window.ethereum.selectedAddress })
      .then(async (res) => {
        obj.success(res);
      });
  } catch (e) {
    obj.error && obj.error(e);
  } finally {
    obj.finally && obj.finally();
  }
}

export async function checkApprove(nftContract, exchangeContract) {
  console.log(nftContract, exchangeContract);
  return new Promise((resolve, reject) => {
    NFT(
      {
        name: "isApprovedForAll",
        read: true, //是否只读
        params: [window.ethereum.selectedAddress, exchangeContract],
        success: function (receipt) {
          console.log("isApprovedForAll receipt", receipt);
          if (receipt) {
            resolve(true);
          } else {
            //去授权
            NFT(
              {
                name: "setApprovalForAll",
                params: [exchangeContract, true],
                success: function (receipt) {
                  console.log("receipt");
                  console.log(receipt);
                  resolve(true);
                },
                error: (e) => {
                  reject(e.message);
                },
              },
              nftContract
            );
          }
        },
        error: (e) => {
          reject(e.message);
        },
      },
      nftContract
    );
  });
}