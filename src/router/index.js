import { createRouter, createWebHistory } from 'vue-router';
import jwtDecode from 'jwt-decode'; // jwt-decode 라이브러리 임포트


// 홈페이지
import HomePage from '@/components/HomePage.vue';
// 간편영수증
import EasyReceipt_Page from '@/components/EasyReceipt/EasyReceipt_Page.vue';
import EasyReceiptEdit from '@/components/EasyReceipt/EasyReceiptEdit.vue';
import EasyReceiptReport from '@/components/EasyReceipt/EasyReceiptReport.vue';
// 상업등기
import CoReg_Page from '@/components/Co-Reg/CoReg_Page.vue';
// 부동산등기
import RealReg_Page from '@/components/RE-Reg/RealReg_Page.vue';
import RealRegDetail from '@/components/RE-Reg/RealRegDetail.vue';
import RealRegEdit from '@/components/RE-Reg/RealRegEdit.vue';
import RealRegReceipt from '@/components/RE-Reg/RealRegReceipt.vue';
import RealRegReceiptReport from '@/components/RE-Reg/RealRegReceiptReport.vue';
//소송
import LawsuitPage from '@/components/Lawsuit/LawsuitPage.vue';
import LawsuitDocument from '@/components/Lawsuit/LawsuitDocument.vue';
import LawsuitReceipt from '@/components/Lawsuit/LawsuitReceipt.vue';
import LawsuitReceiptReport from '@/components/Lawsuit/LawsuitReceiptReport.vue';
//로그인
import LoginPage from '@/components/LoginPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/home', component: HomePage, meta: { requiresAuth: true } },
  // 간편영수증
  { path: '/easyreceipt', component: EasyReceipt_Page, meta: { requiresAuth: true } },
  { path: '/easyreceipt/edit/:easyreceipt_id?', component: EasyReceiptEdit, name: 'EasyReceiptEdit', props: true, meta: { requiresAuth: true } },
  { path: '/easyreceipt/receiptReport/:easyreceipt_id', name: 'EasyReceiptReport', component: EasyReceiptReport, props: true, meta: { requiresAuth: true } },
  // 상업등기
  { path: '/coreg', component: CoReg_Page, meta: { requiresAuth: true } },
  // 부동산등기
  { path: '/realreg', component: RealReg_Page, meta: { requiresAuth: true } },
  { path: '/realreg/:realreg_id', component: RealRegDetail, name: 'RealRegDetail', props: true, meta: { requiresAuth: true } },
  { path: '/realreg/edit/:realreg_id?', component: RealRegEdit, name: 'RealRegEdit', props: true, meta: { requiresAuth: true } },
  { path: '/realreg/receipt/:realreg_id', name: 'RealRegReceipt', component: RealRegReceipt, props: true, meta: { requiresAuth: true } },
  { path: '/realreg/receiptReport/:receipt_id', name: 'RealRegReceiptReport', component: RealRegReceiptReport, props: true, meta: { requiresAuth: true } },
  // 소송
  { path: '/lawsuit', component: LawsuitPage, meta: { requiresAuth: true } },
  { path: '/lawsuit/document/:index', name: 'LawsuitDocument', component: LawsuitDocument, props: true, meta: { requiresAuth: true } },
  { path: '/lawsuit/receipt/:index', name: 'LawsuitReceipt', component: LawsuitReceipt, props: true, meta: { requiresAuth: true } },
  { path: '/lawsuit/receiptReport/:receipt_id', name: 'LawsuitReceiptReport', component: LawsuitReceiptReport, props: true, meta: { requiresAuth: true } },
  // 회원가입
  { path: '/register', component: RegisterPage } // 추가된 부분
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        next('/');
        return;
      }
    } catch (e) {
      localStorage.removeItem('token');
      next('/');
      return;
    }
  }

  if (to.path === '/' && token) {
    next('/home');
  } else if (requiresAuth && !token) {
    next('/');
  } else {
    next();
  }
});

export default router;
