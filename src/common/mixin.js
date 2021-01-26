import {debounce} from "./util";
import BackTop from "../components/content/backTop/BackTop";

export const itemListenerMixin = {
    mounted() {
        let newRefresh = debounce(this.$refs.scroll.refresh, 100);

        this.itemImgListener = () => {
            newRefresh();
        };

        this.$bus.$on("itemImageLoad", this.itemImgListener);
    },
}

export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBackTop: false,
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0, 500);
        },
        listenShowBackTop(position) {
            this.isShowBackTop = (-position.y) > 1000
        }
    }
}