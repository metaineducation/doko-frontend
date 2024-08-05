import { ref } from "vue";
import api from "../api";

export function useSearchNftInWallet(extendParams = {}) {
  let searchResult = ref([]);
  let totalCount = ref(0);

  let searchParams = ref(
    Object.assign(
      {
        keyword: "",
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
      criteria: JSON.stringify({
        ownerId: searchParams.value.customerId,
        keyword: searchParams.value.keyword,
      }),
      // keyword: searchParams.value.keyword,
      // customerId: searchParams.value.customerId,
      limit: searchParams.value.limit,
      offset: searchParams.value.offset,
    };

    console.log("nftWallet.searchNftInWallet", params);

    let res = await api.nftWallet.searchNftInWallet(params);

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

  return {
    nftSearch: search,
    nftSearchParams: searchParams,
    nftSearchFirstPage: searchFirstPage,
    nftSearchResult: searchResult,
    nftTotalCount: totalCount,
    nftLoadMore: loadMore,
    nftHasMore: hasMore,
  };
}
