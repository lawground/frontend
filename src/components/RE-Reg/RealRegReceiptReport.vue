<template>
  <div class="print_body" ref="printBody" v-if="receiptreportfiltered.receipt && receiptreportfiltered.realreg">
    <h1>비용 계산서 (영수증)</h1>
    <table class="total_table">
      <tbody>
        <tr>
          <td class="col_head" style="text-align: right;border-style:hidden;width: 125px;">의뢰인 :</td>
          <td class="col_head" style="text-align: center;border-style:hidden;">{{ buyerInfo.names }}</td>
          <td class="col_head" style="text-align: right;border-style:hidden;width: 125px;">사건 접수일 :</td>
          <td class="col_head" style="text-align: center;border-style:hidden;">{{
            receiptreportfiltered.receipt.createdAt }}</td>
        </tr>
        <tr>
          <td class="col_head" style="text-align: right;border-style:hidden;width: 125px;">구분 :</td>
          <td class="col_head" style="text-align: center;border-style:hidden;width: 30%;">{{
            receiptreportfiltered.realreg.requester }}</td>
          <td class="col_head" style="text-align: right;border-style:hidden;width: 125px;">등기구분 :</td>
          <td class="col_head" style="text-align: center;border-style:hidden;">{{
            receiptreportfiltered.realreg.division }}</td>
        </tr>
        <tr>
          <td class="col_head" style="text-align: right;border-style:hidden;width: 125px;">사건번호 :</td>
          <td class="col_head" style="text-align: center;border-style:hidden;">{{ caseNum }}</td>
          <td class="col_head" style="text-align: right;border-style:hidden;width: 125px;">기초금액 :</td>
          <td class="col_head" style="text-align: center;border-style:hidden;">{{ formattedValue(receiptreportfiltered.realreg.sell_price) }}</td>
        </tr>
        <tr>
          <td class="col_head" style="text-align: right;border-style:hidden;width: 125px;">목적물 주소 :</td>
          <td colspan="3" class="col_head" style="text-align: center;border-style:hidden;">{{ receiptreportfiltered.realreg.transaction_address }}</td>
        </tr>
      </tbody>
    </table>


    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="text-align: center;">공과금</th>
            <th colspan="2" style="text-align: center;">금액 (원)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expensesLeft, idx) in receiptreportfiltered.receipt.expensesLeft" :key="idx">
            <td style="padding-left:15px;text-align: center;">{{ expensesLeft.name }}</td>
            <td style="text-align: right; width: 80px;">{{ formattedValue(expensesLeft.amount) }}</td>
            <td style="width: 10px; border-left-style: hidden;">원</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style="width: 10px; border-left-style: hidden;"></td>
          </tr>
          <tr style="background-color: #e2e2e2;">
            <td style="text-align: center;">공과금 소계 ①</td>
            <td style="text-align: right;">{{ formattedValue(receiptreportfiltered.receipt.LeftAmount) }}</td>
            <td style="width: 10px; border-left-style: hidden;">원</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th style="text-align: center;">보수료</th>
            <th colspan="2" style="text-align: center;">금액 (원)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expensesRight, idx) in receiptreportfiltered.receipt.expensesRight" :key="idx">
            <td style="padding-left:15px;text-align: center;">{{ expensesRight.name }}</td>
            <td style="text-align: right; width: 80px;"> {{ formattedValue(expensesRight.amount) }}</td>
            <td style="width: 10px; border-left-style: hidden;">원</td>
          </tr>
          <tr style="background-color: #e2e2e2;">
            <td style="text-align: center;">보수료 소계 ②</td>
            <td style="text-align: right;">{{ formattedValue(receiptreportfiltered.receipt.rightAmount) }}</td>
            <td style="width: 10px; border-left-style: hidden;">원</td>
          </tr>
          <tr style="background-color: #e2e2e2;">
            <td style="text-align: center;">부가가치세 ③</td>
            <td style="text-align: right;">{{ formattedValue(receiptreportfiltered.receipt.VAT) }}</td>
            <td style="width: 10px; border-left-style: hidden;">원</td>
          </tr>
        </tbody>
      </table>
    </div>
    <table class="total_table">
      <tbody>
        <tr style="background-color: #fffa9a;">
          <td style="border-right-style: none; width:50%;">
            <p class="total" style="text-align: center;">의뢰인 부담비용합계 (①+②+③) : </p>
          </td>
          <td style="border-left-style: none;">
            <p class="total" style="text-align: center;">{{ formattedValue(receiptreportfiltered.receipt.totalAmount) }}
            </p>
          </td>
          <td style="width: 10px; border-left-style: hidden;">
            <p class="total">원</p>
          </td>
        </tr>
      </tbody>
    </table>

    <table class="memo_table">
      <tbody>
        <tr v-if="receiptreportfiltered.receipt.notes">
          <td class="memo_sub"> 참고사항
          </td>
          <td class="memo_content" style="border-style:dotted;background-color: #f2f2f2;">
            {{ receiptreportfiltered.receipt.notes }}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: right; border-style: none;">위와 같이 청구(영수)합니다.</td>
        </tr>
      </tbody>
    </table>
    <p class="signature" style="text-align: center;">{{ currentDate }}</p>


    <p class="mainname">장윤진 법무사사무소</p>
    <p>경기도 안양시 동안구 시민대로327번길 7, 8층 810호(관양동, 대명 글로벌 비즈스퀘어)</p>
    <p>연락처 : Tel. 031-425-7533, Fax. 031-425-7530</p>
    <p class="total">계좌번호 : 하나은행 448-910491-38407 장윤진 (장윤진법무사사무소)</p>
    <img src="./signature.png" @load="imageLoaded">
  </div>

</template>

<script>
import axios from '@/axios';

export default {
  props: ['receipt_id'],
  data() {
    return {
      receiptreportfiltered: {
        receipt: null,
        realreg: null
      }
    };
  },
  created() {
    this.loadReceipt();
  },
  computed: {
    buyerInfo() {
            if (!this.receiptreportfiltered.realreg) return { names: '', numbers: '', addresses: '' };
            return {
                names: this.receiptreportfiltered.realreg.buyers.map(buyer => buyer.name).join(', '),
                numbers: this.receiptreportfiltered.realreg.buyers.map(buyer => buyer.number).join(', '),
                addresses: this.receiptreportfiltered.realreg.buyers.map(buyer => buyer.address).join(', ')
            };
        },
    currentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year} - ${month} - ${day}`;
    },
    caseNum() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const seconds = String(today.getSeconds()).padStart(2, '0');
      return `J${year}${month}${day}${hours}${minutes}${seconds}`;
    }
  },


  methods: {
    loadReceipt() {
      axios.get(`/api/realregs/receipts/reportpage/${this.receipt_id}`)
        .then(response => {
          this.receiptreportfiltered.receipt = response.data;
          return axios.get(`/api/realregs/${response.data.realreg_id}`);
        })
        .then(response => {
          this.receiptreportfiltered.realreg = response.data;
          this.$nextTick(() => {
          this.waitForImagesAndPrint();
        });
        })
        .catch(error => {
          console.error('영수증 정보를 불러오는 중에 오류가 발생했습니다:', error);
        });
    },
    formattedValue(value) {
      return value === null || value === undefined || value === 0 ? '' : new Intl.NumberFormat().format(value);
    },

    waitForImagesAndPrint() {
    const images = this.$refs.printBody.querySelectorAll('img');
    let loadedImagesCount = 0;

    images.forEach(img => {
      img.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          this.printReport();
        }
      };
    });
  },
  printReport() {
    window.print();
  }
  },
  mounted() {
  this.loadReceipt();
}
};
</script>

<style scoped>
.report_header {
  width: 210mm;
  margin: 0 auto;
  padding: 5mm;
}

.print_body {
  font-family: 'Malgun Gothic', sans-serif;
  line-height: 1.6;
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  padding: 15mm;
  box-sizing: border-box;
  border-style: solid;
}

h1 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 20px 0 40px 0;
}

p {
  font-size: 15px;
  margin: 5px 0;
  text-align: center;
}

.table-container {
  display: flex;
  justify-content: space-between;
}

table {
  width: 50%;
  border-collapse: collapse;
  margin-top: 15px;
}

.total_table {
  margin-top: 0px;
  width: 100%;
}

th,
td {
  border: 1px solid #000;
  padding: 3px;
  text-align: left;
  height: 32px;
  font-size: 15px;
}

.memo_table {
  width: 100%;
}

.memo_table .memo_sub {
  text-align: center;
  width: 40px;
  max-height: 180px;
  padding: 2px;
  font-weight: 700;
  background-color: #f2f2f2;
  border-style: dotted;
}

.memo_table .memo_content {
  text-align: left;
  max-height: 180px;
  padding: 2px 2px 2px 10px;
  background-color: #f2f2f2;
  border-style: dotted;
}

.col_head {
  height: fit-content;
}

th {
  background-color: #f2f2f2;
}

.total {
  font-weight: bold;
}

.mainname {
  font-weight: bold;
  font-size:20px;
}

.signature {
  margin: 30px;
}

img {
  width: 90px;
  transform: translate(550%, -200%);
}
</style>