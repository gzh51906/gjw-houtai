<template>
  <div class="login">
    <div class="header">
      <span>账号登录</span>
    </div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm">
      <el-form-item prop="phone" class="inputs">
        <el-input type="text" v-model="ruleForm.phone" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" class="inputs">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码"></el-input>
      </el-form-item>
      <div class="mont">
        <el-checkbox v-model="checked">
          <span>忘记密码</span>
        </el-checkbox>
      </div>
      <el-form-item>
        <el-button @click="goto" class="btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);
import "element-ui/lib/theme-chalk/index.css";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.loginForm.validateField("checkPass");
        }
        callback();
      }
    };

    return {
      checked: true,
      ruleForm: {
        phone: "",
        password: ""
      },
      rules: {
        password: [
          { required: true, message: "必须添加密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        phone: [
          { required: true, message: "必须填写手机号码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    goto() {
      this.$router.push("/itemlist");
    },
    gotohome() {
      this.$refs["loginForm"].validate(async valid => {
        if (valid) {
          // hard code
          let { data } = await this.$axios.post(
            "http://localhost:1906/user/login",
            {
              phone: this.ruleForm.phone,
              password: this.ruleForm.password
            }
          );
          if (data.code === 1) {
            let targetUrl = this.$route.query.targetUrl || "/mine";
            this.$router.push(targetUrl);

            // 保存token到本地
            this.$store.commit("login", data.data.authorization);
          } else {
            alert("用户名或密码错误");
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  width: 640px;
  margin: 70px auto;
  height: 370px;
  border-radius: 10px;
}
.header {
  height: 46px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  margin-bottom: 50px;
}
.header i {
  font-size: 18px;
  margin-left: 10px;
  color: #ccc;
}
.header span {
  margin: auto;
}
.inputs {
  width: 80%;
  margin: auto;
  margin-bottom: 22px;
}
.mont {
  height: 40px;
  display: flex;
  align-content: center;
  justify-content: space-between;
  color: #999;
  width: 80%;
  margin: auto;
}
.btn {
  width: 80%;
  margin-left: 65px;

  font-size: 18px;
  color: #fff;
  background-color: #409eff;
}
</style>