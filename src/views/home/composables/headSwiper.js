import { onMounted, ref } from "vue";
import api from "../../../api";

export default function useHeaderSwiper() {
  let swiperRef = ref(null);
  function onAfterInit(swiper) {
    // debugger;
    //拿到实例
    //https://stackoverflow.com/questions/64872840/how-to-use-swiper-slideto-in-vue3-0
    swiperRef.value = swiper;
  }
  let swiperHeaderArr = ref([
    // {
    //   image: "sample01-2.jpg",
    //   title: "This month's best home recommendations",
    //   detail:
    //     "Painters, graphic designers, 3D modellers, digital artists and creators of all kinds are all in this virtual world. The content of their creations varies from simple black and white architecture to complex multimedia constructs.",
    //   link: "/collections?lid=1",
    // },
    // {
    //   image: "sample01-3.jpg",
    //   title: "Explore Sports",
    //   detail:
    //     "Sporting brands look after some of the most valuable intellectual property on the planet, and companies like Sorare are selling it in the form of digital trading cards right here on our marketplace. We've also got Formula 1 NFTs from Animoca Brands and anticipate a surge of interest from global sports teams looking to tokenize and distribute their collectibles over the coming years. Browse, buy, and sell non-fungible tokens from the worlds of golf, football, racing, and more.",
    //   link: "/collections?lid=2",
    // },
    // {
    //   image: "sample01-4.jpg",
    //   title: "Explore Art",
    //   detail:
    //     "4An online community of makers, developers, and traders is pushing the art world into new territory. It all started with CryptoPunks, a set of 10,000 randomly generated punks that proved demand for the digital ownership of non-physical items and collectibles in 2017, and the market has evolved rapidly ever since.",
    //   link: "/collections?lid=3",
    // },
  ]);
  let currentIndex = ref(0);
  function handleGameSwiperChange(swiper) {
    //只能通过 swiper 实例拿到当前第几页
    // console.log(swiper.realIndex);

    currentIndex.value = swiper.realIndex;
  }

  function changeHeaderSlider(index) {
    swiperRef.value.slideToLoop(index);
  }

  async function getHomeHeader() {
    let res = await api.frontendConfig.getHomeBannerPictures();
    swiperHeaderArr.value = res.data.value;
    setTimeout(() => {
      changeHeaderSlider(0);
    }, 0);
  }

  onMounted(() => {
    getHomeHeader();
  });

  return {
    currentIndex,
    swiperHeaderArr,
    handleGameSwiperChange,
    onAfterInit,
    changeHeaderSlider,
  };
}
