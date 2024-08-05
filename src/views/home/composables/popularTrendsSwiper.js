import { onMounted, ref } from "vue";
import api from "../../../api";
export default function usePopularSwiper() {
  let swiperRef = ref(null);
  function onAfterInit(swiper) {
    // debugger;
    //拿到实例
    //https://stackoverflow.com/questions/64872840/how-to-use-swiper-slideto-in-vue3-0
    swiperRef.value = swiper;
  }
  let swiperHeaderArr = ref([]);
  let currentIndex = ref(0);

  async function getPopularTrends() {
    let res = await api.productSearch.getPopularTrends({
      limit: 12,
    });
    api.r(res, () => {
      swiperHeaderArr.value = res.data.value;
    });
  }

  onMounted(() => {
    getPopularTrends();
  });

  function handleGameSwiperChange(swiper) {
    //只能通过 swiper 实例拿到当前第几页
    // console.log(swiper.realIndex);
    currentIndex.value = swiper.realIndex;
  }

  function changeHeaderSlider(index) {
    swiperRef.value.slideToLoop(index);
  }

  function popularPrev() {
    swiperRef.value.slidePrev();
  }
  function popularNext() {
    swiperRef.value.slideNext();
  }

  return {
    pupularIndex: currentIndex,
    pupularSwiperHeaderArr: swiperHeaderArr,
    pupularHandleGameSwiperChange: handleGameSwiperChange,
    pupularOnAfterInit: onAfterInit,
    pupularChangeHeaderSlider: changeHeaderSlider,
    popularPrev,
    popularNext,
  };
}
