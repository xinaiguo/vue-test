<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content" ref="scroll">
      <detail-swiper :topImages="topImages"> </detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detailInfo="detailInfo" @imgLoad="imgLoad"></detail-goods-info>
      <detail-param-info :paramInfo="paramInfo"></detail-param-info>
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import { getDetail, Goods, Shop ,GoodsParam} from "../../network/detail";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue';
import DetailParamInfo from './childComps/DetailParamInfo.vue';
export default {
  name: "Detail",
  components: { DetailNavBar, DetailSwiper, DetailBaseInfo, DetailShopInfo, Scroll, DetailGoodsInfo, DetailParamInfo },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo:{}
    };
  },
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

      this.paramInfo = new GoodsParam(result.itemParams.info,result.itemParams.rule);

      console.log(res.data.result);
    });
  },
  methods:{
    imgLoad(){
      this.$refs.scroll.refresh();
    }
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav{
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
