<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <detail-swiper :topImages="topImages"> </detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imgLoad="imgLoad"
      ></detail-goods-info>
      <detail-param-info
        :paramInfo="paramInfo"
        ref="params"
      ></detail-param-info>
      <detail-comment :commentInfo="commentInfo" ref="comment"></detail-comment>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "../../network/detail";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailComment from "./childComps/DetailComment.vue";
import GoodsList from "../../components/content/goods/GoodsList.vue";
import { itemListenerMixin, backTopMixin } from "../../common/mixin";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";
import {mapActions} from "vuex"

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
    DetailBottomBar,
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
  mixins: [itemListenerMixin, backTopMixin],
  created() {
    this.iid = this.$route.params.iid;

    getDetail(this.iid).then((res) => {
      const result = res.data.result;

      // 获取顶部轮播图
      this.topImages = result.itemInfo.topImages;

      // 获取商品信息
      this.goods = new Goods(
        result.itemInfo,
        result.columns,
        result.shopInfo.services
      );

      // 创建店铺信息
      this.shop = new Shop(result.shopInfo);

      this.detailInfo = result.detailInfo;

      this.paramInfo = new GoodsParam(
        result.itemParams.info,
        result.itemParams.rule
      );

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
    ...mapActions(['addCart']),
    imgLoad() {
      this.$refs.scroll.refresh();
      this.themeTopy = [];
      this.themeTopy.push(0);
      this.themeTopy.push(this.$refs.params.$el.offsetTop);
      this.themeTopy.push(this.$refs.comment.$el.offsetTop);
      this.themeTopy.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopy.push(Number.MAX_VALUE);
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopy[index], 200);
    },
    contentScroll(position) {
      this.listenShowBackTop(position);
      const positionY = -position.y;
      let length = this.themeTopy.length;
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopy[i] &&
          positionY < this.themeTopy[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
    },

    addToCart(){
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        // this.$store.commit('addCart',product);

        this.addCart(product).then(res => {
          this.$toast.show(res,2000)
        })

        // this.$store.dispatch('addCart',product).then(res => {
        //   console.log(res);
        // })
    }
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
