<template>
  <div class="additem">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>商品管理</a-breadcrumb-item>
      <a-breadcrumb-item>添加商品</a-breadcrumb-item>
    </a-breadcrumb>
    <a-form :layout="formLayout" class="ant-form-horizontal222">
      <a-form-item
        label="商品名称"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input placeholder="请输入(50字以内)" v-model.lazy="inputval1" @blur="onSearch('ProductName')" />
      </a-form-item>
      <a-form-item
        label="商品图片路径"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input placeholder="请输入(图片路径)" v-model.lazy="inputval2" @blur="onSearch('Pic')" />
      </a-form-item>
      <a-form-item
        label="商品价格"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input v-model.lazy="inputval3" @blur="onSearch('APPPrice')" />
      </a-form-item>
      <a-form-item
        label="活动说明"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input v-model.lazy="inputval4" @blur="onSearch('BagExplain')" />
      </a-form-item>
      <a-form-item :wrapper-col="buttonItemLayout.wrapperCol" style="text-align:center">
        <a-button type="primary" @click="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputval1: "",
      inputval2: "",
      inputval3: "",
      inputval4: "",
      formLayout: "horizontal",
      obj: {}
    };
  },
  computed: {
    formItemLayout() {
      const { formLayout } = this;
      return formLayout === "horizontal"
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
          }
        : {};
    },
    buttonItemLayout() {
      const { formLayout } = this;
      return formLayout === "horizontal"
        ? {
            wrapperCol: { span: 14, offset: 4 }
          }
        : {};
    }
  },
  methods: {
    onSearch(type) {
      if (type === "ProductName") {
        this.obj[type] = this.inputval1;
      } else if (type === "Pic") {
        this.obj[type] = this.inputval2;
      } else if (type === "APPPrice") {
        this.obj[type] = this.inputval3;
      } else if (type === "BagExplain") {
        this.obj[type] = this.inputval4;
      }
    },
    async submit() {
      let APPPrice = this.obj.APPPrice;
      let BagExplain = this.obj.BagExplain;
      let Pic = this.obj.Pic;
      let ProductName = this.obj.ProductName;
      let { data } = await this.$axios.post(
        "http://localhost:19066/itemlist/item",
        {
          APPPrice,
          BagExplain,
          Pic,
          ProductName
        }
      );
      if (data.code) {
        this.success();
        this.init();
      }
    },
    init() {
      this.inputval1 = "";
      this.inputval2 = "";
      this.inputval3 = "";
      this.inputval4 = "";
    },
    success() {
      this.$message.success("插入成功");
    },
    handleFormLayoutChange(e) {
      console.log("ant-upload", e.target.value);

      this.formLayout = e.target.value;
    },
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
    }
  }
};
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 20px;
}
.ant-form-horizontal222 {
  padding-top: 60px;
  height: 500px;
  background-color: #fff;
}
</style>