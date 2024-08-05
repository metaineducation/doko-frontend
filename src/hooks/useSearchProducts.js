import { ref } from "vue";
import api from "../api";
import { mergeDeep, parseGwei } from "../utils";

/*
  在personal 页面， 针对主态 ，客态 搜索接口不同
  extendParams
  isMe = true 主态 调用  myProduct.searchProducts
              客态 调用  productSearch.searchProducts

*/
export function useSearchProduct(extendParams = {}) {
  let searchResult = ref([]);
  let totalCount = ref(0);
  let hasMore = ref(true);
  let attributeFilterMetas = ref([]);

  let isMe = extendParams.isMe;
  delete extendParams.isMe; //搜索条件还要用，所以删掉。
  let searchParamsTemplte = {
    criteria: {
      keyword: "",
      metaverseId: 0,
      collectionId: 0,
      minPrice: undefined,
      maxPrice: undefined,
      ownedBy: 0,

      nftAttributeFilters: {},
    },
    sortMethod: "BEST_MATCH_FIRST", //排序方式 BEST_MATCH_FIRST 最优匹配优先, EXPIRING_SOON_FIRST 最早过期的挂单优先, HIGH_PRICE_FIRST 最高价优先, LOW_PRICE_FIRST 最低价优先, RECENTLY_LISTED_FIRST 最近挂单优先
    limit: 20,
    offset: 0,
  };
  let searchParams = ref(
    mergeDeep(JSON.parse(JSON.stringify(searchParamsTemplte)), extendParams)
  );

  function initSearchParams() {
    searchParams.value = JSON.parse(JSON.stringify(searchParamsTemplte));
  }

  async function search() {
    let criteria = searchParams.value.criteria;
    let params = {
      criteria: JSON.stringify({
        keyword: criteria.keyword ? criteria.keyword : undefined,
        metaverseId: criteria.metaverseId ? criteria.metaverseId : undefined,
        collectionId: criteria.collectionId ? criteria.collectionId : undefined,
        minPrice: criteria.minPrice ? parseGwei(criteria.minPrice) : undefined,
        maxPrice: criteria.maxPrice ? parseGwei(criteria.maxPrice) : undefined,
        ownedBy: criteria.ownedBy ? criteria.ownedBy : undefined,
        labelId: criteria.labelId ? criteria.labelId : undefined,
        nftAttributeFilters: criteria.nftAttributeFilters,
      }),
      sortMethod: searchParams.value.sortMethod
        ? searchParams.value.sortMethod
        : "",
      limit: searchParams.value.limit,
      offset: searchParams.value.offset,
    };

    let res;

    if (isMe) {
      console.log("myProduct.searchProducts", params);
      res = await api.myProduct.searchProducts(params);
    } else {
      console.log("productSearch.searchProducts", params);

      res = await api.productSearch.searchProducts(params);
    }

    api.r(res, () => {
      searchResult.value.push(...res.data.data);
      totalCount.value = res.data.totalCount;
      hasMore.value = res.data.offset + params.limit < res.data.totalCount;
      attributeFilterMetas.value = res.data.attributeFilterMetas;
    });
  }

  function searchFirstPage() {
    searchParams.value.offset = 0;
    searchResult.value = [];
    totalCount.value = 0;
    hasMore.value = true;
    setTimeout(() => {
      search();
    }, 0);
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
    productInitSearchParams: initSearchParams,
    productSearch: search,
    productSearchParams: searchParams,
    productSearchFirstPage: searchFirstPage,
    productSearchResult: searchResult,
    productTotalCount: totalCount,
    productLoadMore: loadMore,
    productHasMore: hasMore,
    productAttributeFilterMetas: attributeFilterMetas,
  };
}
