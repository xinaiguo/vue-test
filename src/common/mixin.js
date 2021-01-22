import { debounce } from "./util";
export const itemListenerMixin = {
    mounted() {
        let newRefresh = debounce(this.$refs.scroll.refresh, 100);

        this.itemImgListener = () => {
            newRefresh();
        };

        this.$bus.$on("itemImageLoad", this.itemImgListener);
    },
}