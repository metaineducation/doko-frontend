/*
  主要用于 列表，翻页
  1, 先把名字改了   templateMethodName
  2, 再改搜索条件
  3，再把最后 return 的前缀test ， command+D  改掉
*/

import { ref } from "vue";
import api from "../api";

export function templateMethodName(extendParams = {}) {
  let searchResult = ref([]);
  let totalCount = ref(0);

  let searchParams = ref(
    Object.assign(
      {
        customerId: 0,
        limit: 20,
        offset: 0,
      },
      extendParams
    )
  );

  let hasMore = ref(true);

  async function search() {
    let params = {
      customerId: searchParams.value.customerId,
      limit: searchParams.value.limit,
      offset: searchParams.value.offset,
    };

    console.log("nftWallet.listNftInWallet", params);

    let res = await api.nftWallet.listNftInWallet(params);

    api.r(res, () => {
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
    testSearchParams: searchParams,
    testSearchFirstPage: searchFirstPage,
    testSearchResult: searchResult,
    testTotalCount: totalCount,
    testLoadMore: loadMore,
    // testHasMore: hasMore,
  };
}
