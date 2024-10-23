<template>
  <div class="login-container">
    <div class="login-box">
      <img src="@/assets/logo.png" alt="User Avatar" class="avatar">
      <h1>장윤진 법무사사무소</h1>
      <form @submit.prevent="login">
        <div class="input-group">
          <i class="fas fa-user"></i>
          <input type="text" v-model="username" id="username" required autocomplete="username" placeholder="아이디">
        </div>
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" v-model="password" id="password" required autocomplete="current-password" placeholder="비밀번호">
        </div>
        <div class="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" class="login-button">LOGIN</button>
      </form>
      <div class="register-link">
        <router-link to="/register">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/api/login', {
          username: this.username,
          password: this.password
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/home');
      } catch (error) {
        alert('아이디 또는 패스워드를 다시 확인하여 시도해주시기 바랍니다.');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: #fff;
  padding: 40px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
  width: 350px;
}

.avatar {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.input-group i {
  margin-right: 10px;
  color: #ccc;
}

.input-group input {
  border: none;
  outline: none;
  width: 100%;
  padding: 10px;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: #888;
  text-decoration: none;
  font-size: 14px;
}

.login-button {
  background: #3064bf;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.login-button:hover {
  background: #002c69;
}

.register-link {
  margin-top: 20px;
}

.register-link a {
  color: #3064bf;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
