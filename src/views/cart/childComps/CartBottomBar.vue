<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :isChecked="isSellectAll" @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="count">合计¥:{{ totalPrice }}</div>
    <div class="calc">去计算({{ checkLength }})</div>
  </div>
</template>

<script>
import CheckButton from "@/components/content/checkButton/CheckButton";
import {mapGetters} from "vuex"

export default {
  name: "CartBottomBar",
  components:{
      CheckButton
  },
  computed:{
      ...mapGetters(['cartList']),
      totalPrice(){
          return this.cartList.filter(item => {
              return item.checked
          }).reduce((preValue,item)=>{
              return preValue + item.price * item.count
          },0).toFixed(2)
      },
      checkLength(){
          return this.cartList.filter(item => item.checked).length;
      },
      isSellectAll(){
        // return !(this.cartList.filter(item => !item.checked).length)
        if (this.cartList.length === 0 ) {
          return false;
        }
        return !this.cartList.find(item => !item.checked)
      }  
  },
  methods:{
    checkClick(){
      if (this.isSellectAll) {
        this.cartList.forEach(item => item.checked = false)
      } else {
        this.cartList.forEach(item => item.checked = true)
      }
    }
  }

};
</script>

<style scoped>
.bottom-bar {
  background-color: #dbe5ec;
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
}
.check-content {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-left: 10px;
  width: 60px;
}
.count {
  color: #ff5777;
  padding-left: 50px;
  flex: 1;
  font-size: 13px;
}
.calc {
  width: 90px;
  color: white;
  text-align: center;
  background-color: #ff8198;
  font-size: 14px;
}
</style>