import { ref } from "vue";
import api from "../api";
import { mergeDeep } from "../utils";

export function useFavoritedList(extendParams = {}) {
  let searchResult = ref([]);
  let totalCount = ref(0);

  let searchParams = ref(
    mergeDeep(
      {
        /*

      根据商品的销售状态进行过滤
      OFF_SHELF 下架状态，具体包括商品尚未审核通过、商品被手工下架、商品的挂单价格已失效这三种情况,
      ON_SHELF 上架状态，并且挂单价格有效、未过期，处于此状态的商品可以直接购买,
      SOLD_OUT 商品已售出，或者商品中包含的NFT已转移到其他账号，无法再进行交易

      */
        keyword: "",
        customerId: 0,
        saleStatus: "ON_SHELF",
        limit: 20,
        offset: 0,
      },
      extendParams
    )
  );

  let hasMore = ref(true);

  async function search() {
    let params = {
      keyword: searchParams.value.keyword,
      customerId: searchParams.value.customerId,
      saleStatus: searchParams.value.saleStatus,
      limit: searchParams.value.limit,
      offset: searchParams.value.offset,
    };

    console.log("productFavorite.searchInCustomerProductFavorite", params);

    let res = await api.productFavorite.searchInCustomerProductFavorite(params);

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
    favoritedSearch: search,
    favoritedSearchParams: searchParams,
    favoritedSearchFirstPage: searchFirstPage,
    favoritedSearchResult: searchResult,
    favoritedTotalCount: totalCount,
    favoritedLoadMore: loadMore,
    favoritedHasMore: hasMore,
  };
}
