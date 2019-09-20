<template>
  <div class="home">
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
      <a-layout-sider collapsible v-model="collapsed" style="position:fixed;height:580px">
        <div class="logo">
          <a-icon type="slack" class="a-icon-crown" />后台管理系统
        </div>
        <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="shopping-cart" />
              <span>商品管理</span>
            </span>
            <a-menu-item key="1" @click="goto('/itemlist')">商品列表</a-menu-item>
            <a-menu-item key="3" @click="goto('/additem')">添加商品</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="user" />
              <span>用户管理</span>
            </span>
            <a-menu-item key="4" @click="goto('/userlist')">用户列表</a-menu-item>
            <a-menu-item key="5" @click="goto('/adduser')">添加用户</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout class="laygout-content-ct" style="margin-left:220px">
        <a-layout-header style="background: #fff;" class="httitle">购酒网后台管理系统</a-layout-header>
        <itemlist v-if="$route.path=='/itemlist'"></itemlist>
        <additem v-if="$route.path=='/additem'"></additem>
        <adduser v-if="$route.path=='/adduser'"></adduser>
        <userlist v-if="$route.path=='/userlist'"></userlist>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import itemlist from "./itemlist";
import additem from "./additem";
import adduser from "./adduser";
import userlist from "./userlist";

Vue.config.productionTip = false;
Vue.use(Antd);

export default {
  components: {
    itemlist,
    additem,
    userlist,
    adduser
  },
  data() {
    return {
      collapsed: false
    };
  },
  computed: {},
  methods: {
    goto(val) {
      this.$router.push(val);
    }
  }
};
</script>
<style lang="scss" scoped>
html,
body,
.home,
.homepage {
  height: 100%;
  #components-layout-demo-side {
    .logo {
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
      color: #fff;
      text-align: center;
      line-height: 32px;
      .a-icon-crown {
        margin-right: 8px;
        font-size: 22px;
      }
    }
    .editable-row-operations a {
      margin-right: 8px;
    }
    .httitle {
      font-size: 30px;
      font-weight: 900;
      padding-left: 20px;
    }
  }
  .editable-add-btn {
    margin-bottom: 8px;
  }
}
</style>
