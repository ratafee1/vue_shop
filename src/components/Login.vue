<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/pikaqiu2.jpg" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form ref='refFormRef111' :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-users"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item  class="btns">
          <el-button type="primary" plain @click="login">登陆</el-button>
          <el-button type="info" plain @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { async } from 'q';
export default {
  data() {
    return {

      // 登陆表单的数据绑定对象
      loginForm: {
        username: "",
        password: ""
      },
      loginFormRules: {
        //  验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        //  验证密码是否合法

        password: [
            { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods:{
      //点击重置按钮，重置登陆表单
      resetLoginForm(){
          this.$refs.refFormRef111.resetFields();
          
      },
      login(){
          this.$refs.refFormRef111.validate(async (valid) =>{
             if(!valid) return;
             const {data:res} = await this.$http.post("login", this.loginForm)
             if(res.meta.status !== 200) return this.$message.error('登录失败！')
             this.$message.success('登录成功')

             window.sessionStorage.setItem("token",res.data.token);
             this.$router.push('/home')
          });
      }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 20px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
