<template>
    <div class="container mt-5 small-text-table-container">
        <div class="row justify-content-between mb-3">
            <h2 class="mb-4">간편영수증</h2>
            <div class="col-auto">
                <b-input-group>
                    <b-form-input v-model="searchQuery" @input="onSearch" placeholder="검색어를 입력하세요"></b-form-input>
                </b-input-group>
            </div>
            <div class="col-auto">
                <b-button variant="outline-primary" class="mx-1" @click="createEasyReceipt">간편영수증 작성</b-button>
            </div>
        </div>

        <b-table :items="filteredEasyReceipts" :fields="fields" v-model:sortBy="sortBy" v-model:sortDesc.sync="sortDesc"
            sort-icon-left @row-clicked="viewEasyReceipt" hover responsive="sm" class="small-text-table">
            <template #cell(division1)="data">
        <span :style="{ color: getDivisionColor(data.item.division1) }">{{ data.item.division1 }}</span>
    </template>
            <template #cell(price)="data">
                {{ formattedValue(data.item.price) }}
            </template>
            <template #cell(rightAmount)="data">
                {{ formattedValue(data.item.rightAmount) }}
            </template>
            <template #cell(lastTotalAmount)="data">
                {{ formattedValue(data.item.lastTotalAmount) }}
            </template>
            <template #cell(paymentStatus)="data">
                <span :style="{ color: data.item.paymentStatus === '미입금' ? 'red' : 'green' }">{{ data.item.paymentStatus
                    }}</span>
            </template>
            <template #cell(taxInvoiceStatus)="data">
                <span
                    :style="{ color: data.item.taxInvoiceStatus === '발행전' ? 'red' : data.item.taxInvoiceStatus === '발행완료' ? 'green' : 'darkgray' }">{{
                        data.item.taxInvoiceStatus }}</span>
            </template>
            <template #cell(actions)="data">
                <b-button size="sm mx-1" @click="navigateToReport(data.item)">인쇄</b-button>
                <b-button size="sm mx-1" variant="danger" @click="deleteReceipt(data.item)">삭제</b-button>
            </template>
        </b-table>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <b-pagination id="pagination" v-model="currentPage" :total-rows="easyreceipts.length"
                :per-page="easyreceiptsPerPage" aria-controls="my-table"></b-pagination>
            <span>Showing 1 to 10 of {{ easyreceipts.length }} entries</span>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    data() {
        return {
            sortBy: 'registration_date',
            sortDesc: true,
            searchQuery: '',
            fields: [
                { key: 'registration_date', label: '등록일', thClass: 'col1-registration-date', tdClass: 'col1-registration-date', sortable: true },
                { key: 'division1', label: '구분', thClass: 'col1-division1', tdClass: 'col1-division1' },
                { key: 'division2', label: '등기구분', thClass: 'col1-division2', tdClass: 'col1-division2' },
                { key: 'requester', label: '의뢰인', thClass: 'col1-requester', tdClass: 'col1-requester' },
                { key: 'price', label: '기준금액', thClass: 'col1-price', tdClass: 'col-price' },
                { key: 'rightAmount', label: '보수료', thClass: 'col1-expensesRight', tdClass: 'col1-expensesRight' },
                { key: 'lastTotalAmount', label: '합계', thClass: 'col1-lastTotalAmount', tdClass: 'col1-lastTotalAmount' },
                { key: 'manager', label: '담당자', thClass: 'col1-manager', tdClass: 'col-manager' },
                { key: 'paymentStatus', label: '입금', thClass: 'col1-paymentStatus', tdClass: 'col1-paymentStatus' },
                { key: 'taxInvoiceStatus', label: '계산서', thClass: 'col1-taxInvoiceStatus', tdClass: 'col1-taxInvoiceStatus' },
                { key: 'actions', label: 'Actions', thClass: 'col1-actions', tdClass: 'col1-actions' }
            ],
            easyreceipts: [],
            currentPage: 1,
            easyreceiptsPerPage: 10
        };
    },
    computed: {
        filteredEasyReceipts() {
        // 1. 검색어에 따라 필터링
        let filtered = this.easyreceipts.filter(easyreceipt => {
            return Object.values(easyreceipt).some(value =>
                String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        });

        // 2. 정렬 로직 추가
        filtered = filtered.sort((a, b) => {
            const aValue = a[this.sortBy];
            const bValue = b[this.sortBy];

            if (aValue === bValue) {
                return 0;
            }

            if (this.sortDesc) {
                return aValue > bValue ? -1 : 1; // 내림차순
            } else {
                return aValue < bValue ? -1 : 1; // 오름차순
            }
        });

        // 3. 페이지네이션 적용
        const start = (this.currentPage - 1) * this.easyreceiptsPerPage;
        const end = this.currentPage * this.easyreceiptsPerPage;
        return filtered.slice(start, end);
    },
        
    },
    created() {
        this.fetchReceipts();
    },
    methods: {
        async fetchReceipts() {
            try {
                const response = await axios.get('/api/easyreceipts');
                this.easyreceipts = response.data;
            } catch (error) {
                console.error("간편영수증 불러오는 중에 오류가 발생했습니다:", error.response ? error.response.data : error.message);
            }
        },
        formattedValue(value) {
            return value === null || value === undefined ? '' : new Intl.NumberFormat().format(value);
        },
        getDivisionColor(division) {
            switch (division) {
                case '상업등기':
                    return 'blue';
                case '부동산등기':
                    return 'green';
                case '소송사건':
                    return 'black';
                default:
                    return 'black';
            }
        },
        onSearch() {
            this.currentPage = 1;
        },
        viewEasyReceipt(easyreceipt) {
            this.$router.push({ name: 'EasyReceiptEdit', params: { easyreceipt_id: easyreceipt.easyreceipt_id, isEdit: true } });
        },
        createEasyReceipt() {
            this.$router.push({ name: 'EasyReceiptEdit' });
        },
        navigateToReport(easyreceipt) {
            const url = this.$router.resolve({ name: 'EasyReceiptReport', params: { easyreceipt_id: easyreceipt.easyreceipt_id } }).href;
            const newWindowName = `newwindow-${easyreceipt.easyreceipt_id}`;
            window.open(url, newWindowName, 'width=1050,height=800');
        },
        async deleteReceipt(easyreceipt) {
            if (confirm("이 영수증을 삭제하시겠습니까?")) {
                try {
                    await axios.delete(`/api/easyreceipt/receipt/${easyreceipt.easyreceipt_id}`);
                    alert("영수증이 삭제되었습니다.");
                    this.fetchReceipts();  // Fetch the updated list of receipts
                } catch (error) {
                    console.error("영수증 삭제 중 오류가 발생했습니다:", error.response ? error.response.data : error.message);
                    alert("영수증 삭제 중 오류가 발생했습니다.");
                }
            }
        }
    }
};
</script>

<style scoped>
.small-text-table-container .table {
    min-width: 1150px;
}

.small-text-table-container .table th,
.small-text-table-container .table td {
    font-size: 14px;
    /* 작은 글자 크기로 조정 */
    text-align: center;
    padding: 16px 5px 16px 5px;
}

span {
    font-size: 14px !important;
}

.col1-registration-date {
    min-width: 50px;
}

.col1-division1 {
    min-width: 50px;
}

.col1-division2 {
    max-width: 150px;
}

.col1-requester {
    min-width: 200px;
}

.col1-price {
    width: 100px;
}

.col1-expensesRight {
    width: 100px;
}

.col1-lastTotalAmount {
    width: 100px;
}

.col1-manager {
    width: 100px;
}

.col1-paymentStatus {
    width: 60px;
}

.col1-taxInvoiceStatus {
    width: 60px;
}

.col1-actions {
    width: 120px;
}

/* b-pagination 스타일 조정 */
.pagination .page-link {
    padding: 0.3rem 0.7rem !important;
    /* 원하는 크기로 조정 */
    font-size: 1rem !important;
    /* 글자 크기 조정 */
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
}

.pagination .active .page-link {
    background-color: #6c757d !important;
    border-color: #6c757d !important;
}

.pagination .page-item {
    margin: 0 2px !important;
}

/* Custom styles for sorting icons */
.b-table-sort-icon {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
}

.b-table-sort-icon::before {
    content: "\f0dc";
    /* FontAwesome icon for up and down arrows */
}
</style>