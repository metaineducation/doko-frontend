import { useRouteQuery } from "@vueuse/router";
import { ref, watch } from "vue";
import api from "../api";

export function useGetNftInfoInWallet() {
  let nftId = useRouteQuery("id");
  let nftInfo = ref({});
  let detials = ref([]);
  let isNotFound = ref(false);
  async function search() {
    let res = await api.nftInfo.getNftInfoInWallet({
      nftId: nftId.value,
    });
    api.r(res, () => {
      if (JSON.stringify(res.data) == "{}") {
        isNotFound.value = true;
        return;
      }
      nftInfo.value = res.data;
      detials.value.push({
        image: res.data.nft.image,
        name: res.data.nft.name,
        attributes: res.data.nft.attributes,
        externalUrl: res.data.nft.externalUrl,
        tokenId: res.data.nft.tokenId,
        collectionTokenStandard: res.data.collection.tokenStandard,
        collectionBlockchainName: res.data.collection.blockchainName,
        collectionContractAddress: res.data.collection.contractAddress,
      });
    });
  }

  watch(
    nftId,
    (val) => {
      console.log("watch", val);
      search();
    },
    {
      immediate: true,
      flush: "post",
    }
  );

  return {
    isNotFound,
    nftInfo,
    detials,
  };
}
