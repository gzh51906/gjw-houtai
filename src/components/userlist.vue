<template>
  <a-layout-content>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>用户列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <a-button
        class="editable-add-btn"
        style="margin-right:10px"
        @click="goto('/adduser')"
        type="primary"
      >
        <i class="el-icon-plus" style="margin-right:5px"></i>
        添加用户
      </a-button>
      <a-button class="editable-add-btn" @click="deleteall" type="danger">
        <i class="el-icon-delete" style="margin-right:5px"></i>
        删除选中项
      </a-button>
      <a-table :columns="columns" :dataSource="data" bordered :rowSelection="rowSelection">
        <template
          v-for="col in ['name', 'sign', 'regtime','operation']"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => save(record.key)">确定</a>
              <a-popconfirm title="确定取消吗?" @confirm="() => cancel(record.key)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="() => edit(record.key)">编辑</a>
              <a-popconfirm title="确定删除吗?" @confirm="() =>  deleteitem(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </a-layout-content>
</template>
<script>
import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.config.productionTip = false;
Vue.use(Antd);

const columns = [
  {
    title: "#", //表头名字
    dataIndex: "num", //表内容
    width: "1%", //列宽
    scopedSlots: { customRender: "num" }
  },
  {
    title: "用户名",
    dataIndex: "name",
    width: "40%",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "签名",
    dataIndex: "sign",
    width: "33%",
    scopedSlots: { customRender: "sign" }
  },
  {
    title: "注册时间",
    dataIndex: "regtime",
    width: "10%",
    scopedSlots: { customRender: "regtime" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "15%",
    scopedSlots: { customRender: "operation" }
  }
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    num: `${i}`,
    name: `user${i}`,
    sign: `敢买敢拼${i}`,
    regtime: `2019-9-${i}`
  });
}
export default {
  name: "itemlist",
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      selectedRowKeys: []
    };
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: "all-data",
            text: "选择全部数据",
            onSelect: () => {
              this.selectedRowKeys = [...Array(46).keys()]; // 0...45
            }
          },
          {
            key: "odd",
            text: "选择奇数行数据",
            onSelect: changableRowKeys => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                if (index % 2 !== 0) {
                  return false;
                }
                return true;
              });
              this.selectedRowKeys = newSelectedRowKeys;
            }
          },
          {
            key: "even",
            text: "选择偶数行数据",
            onSelect: changableRowKeys => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                if (index % 2 !== 0) {
                  return true;
                }
                return false;
              });
              this.selectedRowKeys = newSelectedRowKeys;
            }
          }
        ],
        onSelection: this.onSelection
      };
    }
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },

    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    openNotificationWithIcon(type, val) {
      this.$notification[type]({
        message: `${val}操作`,
        description: `您的${val}操作已成功`
      });
    },
    deleteall() {
      this.selectedRowKeys = this.selectedRowKeys.map(Number);
      const newData = [...this.data];
      if (this.selectedRowKeys.length == 0) {
        this.info("用户");
      } else {
        this.data = newData.filter(
          (element, i) => !this.selectedRowKeys.includes(i)
        );
        this.selectedRowKeys = [];
        this.openNotificationWithIcon("success", "删除");
      }
    },
    info(val) {
      const h = this.$createElement;
      this.$info({
        title: "提示",
        content: h("div", {}, [h("p", `没有选择任何${val}`)]),
        onOk() {}
      });
    },
    deleteitem(key) {
      console.log(key);
      const newData = [...this.data];
      const target = newData.filter(item => key !== item.key);
      this.data = target;
    },
    save(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
      }
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter(item => key === item.key)[0]
        );
        delete target.editable;
        this.data = newData;
      }
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
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
