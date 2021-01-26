<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <detail-swiper :topImages="topImages"> </detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imgLoad="imgLoad"></detail-goods-info>
      <detail-param-info :paramInfo="paramInfo" ref="params"></detail-param-info>
      <detail-comment :commentInfo="commentInfo" ref="comment"></detail-comment>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import { getDetail, Goods, Shop, GoodsParam, getRecommend } from "../../network/detail";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailComment from "./childComps/DetailComment.vue";
import GoodsList from "../../components/content/goods/GoodsList.vue";
import { itemListenerMixin } from "../../common/mixin";
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailComment,
    GoodsList,
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      itemImgListener: null,
      themeTopy: [],
    };
  },
  mixins: [itemListenerMixin],
  created() {
    this.iid = this.$route.params.iid;

    getDetail(this.iid).then((res) => {
      const result = res.data.result;

      // 获取顶部轮播图
      this.topImages = result.itemInfo.topImages;

      // 获取商品信息
      this.goods = new Goods(result.itemInfo, result.columns, result.shopInfo.services);

      // 创建店铺信息
      this.shop = new Shop(result.shopInfo);

      this.detailInfo = result.detailInfo;

      this.paramInfo = new GoodsParam(result.itemParams.info, result.itemParams.rule);

      if (result.rate.cRate !== 0) {
        this.commentInfo = result.rate.list[0];
      }
    });

    getRecommend().then((res) => {
      this.recommends = res.data.data.list;
      console.log(res);
    });

    this.$nextTick(() => {});
  },
  methods: {
    imgLoad() {
      this.$refs.scroll.refresh();
      this.themeTopy = [];
      this.themeTopy.push(0);
      this.themeTopy.push(this.$refs.params.$el.offsetTop);
      this.themeTopy.push(this.$refs.comment.$el.offsetTop);
      this.themeTopy.push(this.$refs.recommend.$el.offsetTop);
      console.log(this.themeTopy);
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopy[index], 200);
    },
    contentScroll(position) {
      const positionY = -position.y;
      let length = this.themeTopy.length;
      for (let i = 0; i < length; i++) {
        if (this.currentIndex !== i &&
          ((i < length - 1 &&
            positionY > this.themeTopy[i] &&
            positionY < this.themeTopy[i + 1]) ||
          (i === length - 1 && positionY > this.themeTopy[i]))
        ) {
          this.currentIndex = i;
          console.log(i);
        }
      }
    },
  },
  mounted() {},
  updated() {},
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 60px;
  left: 0;
  right: 0;
  overflow: hidden;
}
</style>
