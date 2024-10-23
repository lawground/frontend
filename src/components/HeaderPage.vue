<template>
  <div class="container">
    <header class="d-flex flex-wrap justify-content-between align-items-center py-3 mb-4 border-bottom">
      <a href="/home" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <img src="@/assets/logo.png" class="headLogo">
        <span class="logo-item">장윤진 법무사사무소</span>
      </a>

      <div class="d-flex align-items-center">
        <b-nav pills>
          <b-nav-item to="/home" exact class="menu-item">일정</b-nav-item>
          <b-nav-item to="/easyreceipt" class="menu-item">간편영수증</b-nav-item>
          <b-nav-item to="/coreg" class="menu-item">상업등기</b-nav-item>
          <b-nav-item to="/realreg" class="menu-item">부동산등기</b-nav-item>
          <b-nav-item to="/lawsuit" class="menu-item">소송</b-nav-item>
        </b-nav>
        <button @click="$emit('logout')" class="btn btn-outline-secondary ml-2">Logout</button>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  // HeaderPage component logic
};
</script>

<style scoped>
header {
  min-width:1000px;
}
button {
  margin-left: 15px;
  height: 40px;
}

.headLogo {
  margin-right: 15px;
  width: 60px;
}

.logo-item {
  font-size: 1.6rem !important; /* 글꼴 크기 강제 조정 */
  font-weight: 600 !important; /* 글꼴 굵기 강제 조정 */
}

.menu-item {
  font-size: 1.2rem; /* 글꼴 크기를 키움 */
  font-weight: 500;
  padding: 0.5rem 0.2rem; /* 패딩 조정 */
}
</style>
