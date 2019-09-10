<template>
  <div class="adduser">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>添加用户</a-breadcrumb-item>
    </a-breadcrumb>
    <a-form :layout="formLayout" class="ant-form-horizontal222">
      <a-radio-group default-value="horizontal" @change="handleFormLayoutChange"></a-radio-group>
      <a-form-item
        label="用户名"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item
        label="昵称"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input />
      </a-form-item>
      <a-form-item
        label="密码"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input />
      </a-form-item>
      <a-form-item
        label="确认密码"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input />
      </a-form-item>
      <a-form-item
        label="手机号"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input placeholder="*11位手机号" />
      </a-form-item>
      <a-form-item
        label="生日"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input placeholder="XX-MM-DD" />
      </a-form-item>
      <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
        <a-button type="primary">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formLayout: "horizontal"
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
    handleFormLayoutChange(e) {
      this.formLayout = e.target.value;
    }
  }
};
</script>
<style scoped>
.ant-form-horizontal222 {
  background-color: #fff;
}
</style>