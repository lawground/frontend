<template>
  <div class="container">
    <h3 style="text-align:center;margin-top:30px;"> 상업등기</h3>
      <b-nav tabs style="min-width:1000px">
          <b-nav-item to="/coreg/companies" exact class="menu-item">관리법인</b-nav-item>
          <b-nav-item to="/coreg/period" class="menu-item">임기관리</b-nav-item>
          <b-nav-item to="/coreg/receipt" class="menu-item">영수증</b-nav-item>
          <b-nav-item to="/coreg/submit" class="menu-item">등기신청</b-nav-item>
        </b-nav>
    <div class="contents">
      <router-view />
    </div>
  </div>
</template>
<!-- <template>
    <div class="container">
  <div class="CoReg_submit-container">
    <h3>상업등기 신청 페이지 제작중</h3>
    <p>상업등기 신청 페이지는 제작중 입니다.</p>
  </div>
</div>
</template> -->

<script>
export default {
  name: 'CoReg_Page'
}
</script>

<style scoped>
</style>