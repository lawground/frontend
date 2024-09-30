<template>
    <h2 class="text-center" style="margin-bottom:30px;">상업등기 영수증 {{ isEdit ? '수정' : '작성' }}</h2>
    <div class="container mt-1 form-box">
        <div class="scale-down">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <th class="text-center">구분</th>
                            <td>
                                <select v-model="division1" class="form-control" :style="{ color: division1Color }"
                                    style="padding-bottom: 1px; padding-top: 1px;">
                                    <option value="상업등기">상업등기</option>
                                    <option value="부동산등기">부동산등기</option>
                                    <option value="소송사건">소송사건</option>
                                </select>
                            </td>
                            <th class="text-center">등기구분</th>
                            <td><input v-model="division2" class="form-control"
                                    style="padding-bottom: 1px; padding-top: 1px;" /></td>
                        </tr>
                        <tr>
                            <th class="text-center">의뢰인</th>
                            <td><input v-model="requester" class="form-control"
                                    style="padding-bottom: 1px; padding-top: 1px;" /></td>
                            <th class="text-center">기준금액</th>
                            <td><input :value="formattedValue(price)" @input="updatePrice($event)" class="form-control"
                                    style="padding-bottom: 1px; padding-top: 1px;" /></td>
                        </tr>
                        <tr>
                            <th class="text-center">등록일</th>
                            <td><input type="date" v-model="registration_date" class="form-control"
                                    style="padding-bottom: 1px; padding-top: 1px;" readonly /></td>

                            <th class="text-center">담당자</th>
                            <td><input v-model="manager" class="form-control"
                                    style="padding-bottom: 1px; padding-top: 1px;" /></td>
                        </tr>
                        <tr>
                            <th class="text-center">입금여부</th>
                            <td colspan="3">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" v-model="paymentStatus" id="unpaid"
                                        value="미입금">
                                    <label class="form-check-label"
                                        :style="{ color: paymentStatus === '미입금' ? 'red' : 'black' }"
                                        for="unpaid">미입금</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" v-model="paymentStatus" id="paid"
                                        value="입금완료">
                                    <label class="form-check-label"
                                        :style="{ color: paymentStatus === '입금완료' ? 'green' : 'black' }"
                                        for="paid">입금완료</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th class="text-center">세금계산서 발행여부</th>
                            <td colspan="3">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" v-model="taxInvoiceStatus"
                                        id="beforeIssue" value="발행전">
                                    <label class="form-check-label"
                                        :style="{ color: taxInvoiceStatus === '발행전' ? 'red' : 'black' }"
                                        for="beforeIssue">발행전</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" v-model="taxInvoiceStatus" id="issued"
                                        value="발행완료">
                                    <label class="form-check-label"
                                        :style="{ color: taxInvoiceStatus === '발행완료' ? 'green' : 'black' }"
                                        for="issued">발행완료</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" v-model="taxInvoiceStatus"
                                        id="notIssued" value="발행안함">
                                    <label class="form-check-label"
                                        :style="{ color: taxInvoiceStatus === '발행안함' ? 'darkgray' : 'black' }"
                                        for="notIssued">발행안함</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th class="text-center">참고사항</th>
                            <td colspan="3">
                                <textarea v-model="memo" class="form-control notes-textarea"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="text-center my-4">비용내역서</h3>
            <div class="table-responsive">
                <table class="table table-bordered fixed-width">
                    <thead>
                        <tr>
                            <th colspan="2" class="text-center">공과금</th>
                            <th colspan="2" class="text-center">보수료</th>
                            <th class="text-center delete-column"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th class="text-center">항목</th>
                            <th class="text-center">금액</th>
                            <th class="text-center">항목</th>
                            <th class="text-center">금액</th>
                            <th></th>
                        </tr>
                        <tr v-for="index in maxItems" :key="index">
                            <td><input v-model="getExpense(expensesLeft, index - 1).name"
                                    class="form-control input-fixed" /></td>
                            <td><input :value="formattedAmount(expensesLeft, index - 1)"
                                    @input="updateAmount($event, expensesLeft, index - 1)"
                                    class="form-control input-fixed" type="text" />
                            </td>
                            <td><input v-model="getExpense(expensesRight, index - 1).name"
                                    class="form-control input-fixed" /></td>
                            <td><input :value="formattedAmount(expensesRight, index - 1)"
                                    @input="updateAmount($event, expensesRight, index - 1)"
                                    class="form-control input-fixed" type="text" />
                            </td>
                            <td class="text-center">
                                <b-button class="btn-sm" variant="outline-danger" @click="removeExpenseItem(index - 1)"
                                    :disabled="disableRemoveButton">삭제</b-button>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2"></th>
                            <th class="text-center">부가세</th>
                            <th class="text-center">{{ formattedValue(VAT) }}원</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th class="text-center">공과금 소계</th>
                            <th class="text-center">{{ formattedValue(LeftAmount) }}원</th>
                            <th class="text-center">보수료 소계</th>
                            <th class="text-center">{{ formattedValue(rightAmount) }}원</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th colspan="2" class="text-center">합계</th>
                            <th colspan="2" class="text-center">{{ formattedValue(totalAmount + VAT) }}원</th>
                            <th></th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="text-center my-4">
                <b-button variant="outline-primary mx-1" @click="addExpenseItem">항목 추가</b-button>
                <b-button variant="outline-secondary mx-1" @click="resetForm">초기화</b-button>
                <b-button variant="outline-success mx-1" @click="saveReceipt">저장</b-button>
                <b-button variant="outline-danger mx-1" @click="goBack">닫기</b-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    props: ['easyreceipt_id'],
    data() {
        return {
            isEdit: false,
            division1: '',
            division2: '',
            requester: '',
            price: 0,
            registration_date: '',
            manager: '',
            memo: '',
            paymentStatus: '미입금',
            taxInvoiceStatus: '발행전',
            expensesLeft: [
                { name: '등록면허세 및 취득세', amount: 0 },
                { name: '교육세', amount: 0 },
                { name: '등기신청수수료', amount: 0 },
                { name: '우편 및 등제증명', amount: 0 },
                { name: '인감증명', amount: 0 },
                { name: '공증료', amount: 0 },
                { name: '', amount: 0 },
            ],
            expensesRight: [
                { name: '기본보수', amount: 0 },
                { name: '교통비', amount: 0 },
                { name: '서류작성비', amount: 0 },
                { name: '일당', amount: 0 },
                { name: '', amount: 0 },
                { name: '', amount: 0 },
            ],
            lastTotalAmount: '',
        };
    },
    created() {
        const today = new Date().toISOString().split('T')[0];
        this.registration_date = today;
        if (this.$route.params.isEdit) {
            this.isEdit = true;
            this.loadReceiptbyid(this.$route.params.easyreceipt_id); // ID로 불러와야함
        }
    },
    computed: {
        maxItems() {
            return Math.max(this.expensesLeft.length, this.expensesRight.length);
        },
        rightAmount() {
            const rightSum = this.expensesRight.reduce((sum, item) => sum + (item.amount || 0), 0);
            return rightSum;
        },
        VAT() {
            const rightSum = this.rightAmount;
            return Math.floor(rightSum * 0.1);
        },
        LeftAmount() {
            const leftSum = this.expensesLeft.reduce((sum, item) => sum + (item.amount || 0), 0);
            return leftSum;
        },
        totalAmount() {
            const leftSum = this.LeftAmount;
            const rightSum = this.rightAmount;
            return leftSum + rightSum;
        },
        disableRemoveButton() {
            return this.expensesLeft.length <= 6 && this.expensesRight.length <= 6;
        },
        division1Color() {
            switch (this.division1) {
                case '상업등기':
                    return 'blue';
                case '부동산등기':
                    return 'green';
                default:
                    return 'black';
            }
        },
    },
    methods: {
        async loadReceiptbyid(easyreceipt_id) {
            try {
                const response = await axios.get(`/api/easyreceipt/${easyreceipt_id}`);
                const data = response.data;
                this.division1 = data.division1;
                this.division2 = data.division2;
                this.requester = data.requester;
                this.price = data.price;
                this.registration_date = data.registration_date;
                this.manager = data.manager;
                this.memo = data.memo;
                this.paymentStatus = data.paymentStatus;
                this.taxInvoiceStatus = data.taxInvoiceStatus;
                this.expensesLeft = data.expensesLeft.map(expense => ({
                    name: expense.name,
                    amount: expense.amount === null ? 0 : expense.amount
                }));
                this.expensesRight = data.expensesRight.map(expense => ({
                    name: expense.name,
                    amount: expense.amount === null ? 0 : expense.amount
                }));
            } catch (error) {
                console.error('간편영수증정보를 불러오는 중 오류가 발생했습니다.', error);

            }
        },
        addExpenseItem() {
            this.expensesLeft.push({ name: '', amount: 0 });
            this.expensesRight.push({ name: '', amount: 0 });
        },
        removeExpenseItem(index) {
            if (this.expensesLeft.length > 6) {
                this.expensesLeft.splice(index, 1);
            }
            if (this.expensesRight.length > 6) {
                this.expensesRight.splice(index, 1);
            }
        },
        getExpense(array, index) {
            if (!array[index]) {
                array[index] = { name: '', amount: 0 };
            }
            return array[index];
        },
        formattedAmount(array, index) {
            const value = array[index] ? array[index].amount : 0;
            return new Intl.NumberFormat().format(value);
        },
        updateAmount(event, array, index) {
            const value = event.target.value.replace(/,/g, '');
            array[index].amount = parseInt(value, 10) || 0;
        },
        updatePrice(event) {
            const value = event.target.value.replace(/,/g, '');
            this.price = parseInt(value, 10) || 0;
        },
        formattedValue(value) {
            return new Intl.NumberFormat().format(value);
        },
        async saveReceipt() {
            const data = {
                division1: this.division1,
                division2: this.division2,
                requester: this.requester,
                price: this.price,
                registration_date: this.registration_date,
                manager: this.manager,
                memo: this.memo === '' ? null : this.memo, // 비어있으면 null로 저장
                paymentStatus: this.paymentStatus,
                taxInvoiceStatus: this.taxInvoiceStatus,
                expensesLeft: this.expensesLeft.map(expense => ({
                    ...expense,
                    amount: expense.amount === 0 ? null : expense.amount
                })),
                expensesRight: this.expensesRight.map(expense => ({
                    ...expense,
                    amount: expense.amount === 0 ? null : expense.amount
                })),
                VAT: this.VAT,
                LeftAmount: this.LeftAmount,
                rightAmount: this.rightAmount,
                totalAmount: this.totalAmount,
                lastTotalAmount: this.totalAmount + this.VAT,
            };

            try {
                let response;
                if (this.isEdit) {
                    // Update existing receipt
                    response = await axios.put(`/api/easyreceipt/${this.easyreceipt_id}`, data);
                    if (response.status === 200) {
                        alert('상업등기 영수증 수정 완료');
                    } else {
                        alert('상업등기 영수증 수정 실패');
                    }
                } else {
                    // Create new receipt
                    response = await axios.post('/api/easyreceipt/receipt/save', data);
                    if (response.status === 200) {
                        alert('상업등기 영수증 작성 완료');
                    } else {
                        alert('상업등기 영수증 작성 실패');
                    }
                }
                this.$router.go(-1);
            } catch (error) {
                console.error('상업등기 영수증 저장 중 오류가 발생했습니다:', error);
                alert('상업등기 영수증 저장 중 오류가 발생했습니다.');
            }
        },
        resetForm() {
            this.division1 = '',
                this.division2 = '',
                this.requester = '',
                this.price = ''
            this.manager = '',
                this.memo = '',
                this.expensesLeft = [
                    { name: '등록면허세 및 취득세', amount: 0 },
                    { name: '교육세', amount: 0 },
                    { name: '등기신청수수료', amount: 0 },
                    { name: '농특세', amount: 0 },
                    { name: '국민주택채권', amount: 0 },
                    { name: '인지세', amount: 0 },
                    { name: '우편 및 등제증명', amount: 0 },
                ];
            this.expensesRight = [
                { name: '기본보수', amount: 0 },
                { name: '교통비', amount: 0 },
                { name: '서류작성비', amount: 0 },
                { name: '일당', amount: 0 },
                { name: '', amount: 0 },
                { name: '', amount: 0 },
            ];
        },
        goBack() {
            this.$router.go(-1);
        }
    },
};
</script>

<style scoped>
.container{
  min-width: 1000px;
}
.form-box {
    padding: 0px 200px 0px 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    background-color: #fbfbfb;
    min-width: 1000px;
}

.table-responsive {
    margin-bottom: 20px;
}

.table th,
.table td {
    word-wrap: break-word;
    cursor: pointer;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    background: none;
}

.input-fixed {
    width: 100%;
}

.scale-down {
    transform: scale(0.9);
    transform-origin: center center;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
}

.delete-column {
    width: 120px;
    /* 원하는 너비로 설정 */
}


.notes-textarea {
    height: 50px;
    /* 참고사항 칸 높이 설정 */
}

/* Ellipsis styling */
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>