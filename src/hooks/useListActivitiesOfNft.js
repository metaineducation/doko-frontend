/*
  修改导出方法名字段  MethodName
  修改请求参数
*/

import { ref } from "vue";
import api from "../api";
import { useTimeAgo } from "@vueuse/core";
export function useListActivitiesOfNft(extendParams = {}) {
  let searchResult = ref([]);
  let totalCount = ref(0);
  const CONTRACT_DOAMIN = import.meta.env.VITE_CONTRACT_DOAMIN;
  let searchParams = ref(
    Object.assign(
      {
        nftId: 0,
        limit: 20,
        offset: 0,
      },
      extendParams
    )
  );

  let hasMore = ref(true);

  async function search() {
    let params = {
      nftId: searchParams.value.nftId,
      limit: searchParams.value.limit,
      offset: searchParams.value.offset,
    };

    console.log("nftActivity.listActivitiesOfNft", params);

    let res = await api.nftActivity.listActivitiesOfNft(params);

    api.r(res, () => {
      res.data.data.forEach((a) => {
        a.timeAgo = useTimeAgo(a.timestamp);

        a.hashUrl = a.transactionHash
          ? CONTRACT_DOAMIN + "tx/" + a.transactionHash
          : "";
      });

      searchResult.value.push(...res.data.data);
      totalCount.value = res.data.totalCount;
      hasMore.value = res.data.offset + params.limit < res.data.totalCount;
    });
  }

  function searchFirstPage() {
    searchParams.value.offset = 0;
    searchResult.value = [];
    totalCount.value = 0;
    hasMore.value = true;
    search();
  }

  function loadMore() {
    if (searchResult.value.length == 0) {
      return;
    }
    if (hasMore.value) {
      searchParams.value.offset =
        searchParams.value.offset + searchParams.value.limit;
      search();
    } else {
      console.log("hasMore", hasMore.value);
    }
  }
  /*  commend + D 批量替换 test 为你想要导出的名字*/
  return {
    // testSearch: search,
    activitiesSearchParams: searchParams,
    activitiesSearchFirstPage: searchFirstPage,
    activitiesSearchResult: searchResult,
    activitiesTotalCount: totalCount,
    activitiesLoadMore: loadMore,
    activitiesHasMore: hasMore,
  };
}
