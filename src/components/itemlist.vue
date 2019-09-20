<template>
  <a-layout-content>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>商品管理</a-breadcrumb-item>
      <a-breadcrumb-item>商品列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '10px 18px', background: '#fff', minHeight: '360px' }">
      <a-button
        class="editable-add-btn"
        style="margin-right:10px"
        @click="goto('/additem')"
        type="primary"
      >
        <i class="el-icon-plus" style="margin-right:5px"></i>
        添加商品
      </a-button>
      <a-button class="editable-add-btn" @click="deleteall(val)" type="danger">
        <i class="el-icon-delete" style="margin-right:5px"></i>
        删除选中项
      </a-button>
      <div style="margin:10px">
        <a-select defaultValue="白酒" style="width: 120px" @change="handleProvinceChange">
          <a-select-option v-for="item in provinceData1" :key="item.PinYin">{{item.TypeName}}</a-select-option>
        </a-select>
        <a-select
          v-model="secondCity"
          style="width: 120px;margin-left:10px"
          @change="handlesecondProvinceChange"
        >
          <a-select-option
            v-for="city in cities "
            :key="city.PinYin"
            :value="city.PinYin"
          >{{city.Name}}</a-select-option>
        </a-select>
      </div>
      <a-table
        :columns="columns"
        :dataSource="data"
        bordered
        :rowSelection="rowSelection"
        rowKey="ID"
      >
        <template
          v-for="col in ['ProductName', 'ID', 'operation','BagExplain','Pic','APPPrice']"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.ID, val,col)"
            />
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => save(record.ID,val)">确定</a>
              <a @click="() => cancel(record.ID,val)">取消</a>
            </span>
            <span v-else>
              <a @click="() => edit(record,record.ID)">编辑</a>
              <a-popconfirm title="确定删除吗?" @confirm="() =>  deleteitem(record.ID,val)">
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
var inintval1 = "baijiu";
var inintval2 = "maotai";
const columns = [
  // {
  //   title: "#", //表头名字
  //   dataIndex: "num", //表内容
  //   width: "4%", //列宽
  //   scopedSlots: { customRender: "num" }
  // },
  {
    title: "商品名称",
    dataIndex: "ProductName",
    width: "25%",
    scopedSlots: { customRender: "ProductName" }
  },
  {
    title: "商品ID",
    dataIndex: "ID",
    width: "8%",
    scopedSlots: { customRender: "ID" }
  },
  {
    title: "商品价格",
    dataIndex: "APPPrice",
    width: "9%",
    scopedSlots: { customRender: "APPPrice" }
  },
  {
    title: "商品图片",
    dataIndex: "Pic",
    width: "25%",
    scopedSlots: { customRender: "Pic" }
  },
  {
    title: "活动说明",
    dataIndex: "BagExplain",
    width: "10%",
    scopedSlots: { customRender: "BagExplain" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "12%",
    scopedSlots: { customRender: "operation" }
  }
];
var provinceData = ["Zhejiang", "Jiangsu"];
var cityData = {
  Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou"],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"]
};
var indexinit;
export default {
  name: "itemlist",
  data() {
    this.cacheData;
    return {
      val: `${inintval1}-${inintval2}`,
      indexinit: "",
      provinceData1: [],
      provinceData,
      cityData,
      cities: [],
      secondCity: "",
      data: [],
      columns,
      selectedRowKeys: [],
      // itemlist: [],
      num: "",
      selector: [
        { key: "baijiu-maotai", val: "茅台" },
        { key: "putaojiu-lafeixilie", val: "拉菲" },
        { key: "baijiu-jiannanchun", val: "剑南春" },
        { key: "baijiu-fenjiu", val: "汾酒" }
      ]
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
              this.selectedRowKeys = [...Array(46).keys()];
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
  created() {
    this.handleProvinceChange();
    this.init();
  },
  methods: {
    init() {
      // 初始化data数据
      this.getdata(this.val);
    },
    async initgetdata(index) {
      // 初始化获取数据，设置联动显示
      this.secondCity = [];
      let {
        data: { data }
      } = await this.$axios.get("sort/");
      this.provinceData1 = data.length ? data[0].item_data : [];
      let arr = data[0].item_data;
      provinceData = [];
      cityData = {};
      arr.map(item => {
        cityData[item.PinYin] = item.TypeData;
        provinceData.push(item.PinYin);
        this.cities.push(item.TypeData);
      });
      if (cityData[provinceData[index]]) {
        //  cityData[provinceData[index]]  为对应的二级选择数组。
        // console.log("数组不为空", cityData[provinceData[index]]);
        this.secondCity = cityData[provinceData[index]][0].Name;
        // 二级选择数据
        this.cities = cityData[provinceData[index]];
      } else {
        this.secondCity = cityData[provinceData[0]][0].Name;
        this.cities = cityData[provinceData[0]];
        // console.log("数组为空", cityData[provinceData[0]]);
      }
    },
    async handleProvinceChange(value) {
      // 一级选择触发事件
      // console.log(value);
      if (value) {
        inintval1 = value;
      }

      provinceData.map((item, i) => {
        if (item === value) {
          indexinit = i;
        }
      });
      this.initgetdata(indexinit);
    },
    handlesecondProvinceChange(value) {
      // 二级选择触发事件
      // console.log(value);
      if (value) {
        inintval2 = value;
        this.val = `${inintval1}-${inintval2}`;
        this.getdata(this.val);
      }
    },
    async axiosGetAll() {
      // 封装请求(获取所有数据)
      let {
        data: { data }
      } = await this.$axios.get("itemlist/");
      return data;
    },
    async getdata(val) {
      this.val = val;
      // 获取数据库数据
      let data = await this.axiosGetAll();
      let arr = data.filter(item => item.name === val);
      this.data = arr.length ? arr[0].Prolist : [];
      this.cacheData = arr.length ? arr[0].Prolist : [];
    },
    async get2Data() {
      // 查询对应的数据
      let {
        data: { data }
      } = await this.$axios.get("itemlist/goods", {
        params: { name: this.val }
      });
      return data;
    },
    async handleChange(value, ID, name, column) {
      const newData = [...this.data];
      const target = newData.filter(item => ID === item.ID)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
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
    edit(record, ID) {
      const newData = [...this.data];
      const target = newData.filter(item => ID === item.ID)[0];
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
    async deleteall(name) {
      // 选中商品ID的数组
      this.selectedRowKeys = this.selectedRowKeys.map(Number);
      let data = await this.get2Data();
      let tempProlist = [];
      const newData = [...this.data];
      if (this.selectedRowKeys.length == 0) {
        this.info("商品");
      } else {
        tempProlist = newData.filter(
          (element, i) => !this.selectedRowKeys.includes(element.ID)
        );
        // tempProlist为要修改Prolist的新数组数据
        let datas = await this.$axios.post("itemlist/updata", {
          name,
          tempProlist
        });
        this.selectedRowKeys = [];
        this.openNotificationWithIcon("success", "删除");
      }
    },
    async deleteitem(ID, name) {
      let data = await this.get2Data();
      const newData = [...this.data];
      const tempProlist = newData.filter(item => ID !== item.ID);
      this.data = tempProlist;
      let datas = await this.$axios.post("itemlist/updata", {
        name,
        tempProlist
      });
    },
    async save(ID, name) {
      // (1)获取对应的数据，请求回来在前端进行判断，重组数组，再把重组的数组发给后端进行数据更新
      let data = await this.get2Data();
      let tempArr = data.length ? data[0].Prolist : [];
      let tempProlist = tempArr.filter(item => item.ID != ID); //删除ID一致的商品，组成新数组
      const newData = [...this.data];
      const target = newData.filter(item => ID === item.ID)[0];
      if (target) {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
      }
      tempProlist.unshift(target); //要被修改的数组。
      let datas = await this.$axios.post("itemlist/updata", {
        name,
        tempProlist
      });
    },
    cancel(ID) {
      const newData = [...this.data];
      const target = newData.filter(item => ID === item.ID)[0];
      if (target) {
        Object.assign(target, this.cacheData.filter(item => ID === item.ID)[0]);
        delete target.editable;
        this.data = newData;
      }
    },
    onSelectChange(selectedRowKeys) {
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
