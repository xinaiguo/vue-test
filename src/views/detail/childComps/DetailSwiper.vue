<template>
    <swiper class="detail-swiper" > 
      <swiper-item v-for="(item, index) in topImages" :key="index">
        <img :src="item" />
      </swiper-item>
    </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper/index";
export default {
  components: { Swiper, SwiperItem },
  name: "DetailSwiper",
  props: {
    topImages: {
      type: Array,
      default() {
        return null;
      },
    },
  },
};
</script>

<style scoped>
.detail-swiper{
    height: 300px;
    overflow: hidden;
}
</style>