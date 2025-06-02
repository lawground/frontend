<template>
  <div class="container mt-4 small-text-table-container">
    <div class="row justify-content-between mb-3">
      <div class="col-auto">
        <b-input-group>
          <b-form-input v-model="searchQuery" @input="onSearch" placeholder="검색어를 입력하세요"></b-form-input>
        </b-input-group>
      </div>
    </div>

    <b-table
      :items="filteredExecutives"
      :fields="fieldsWithIcons"
      @head-clicked="onSort"
      @row-clicked="viewCompany"
      hover responsive="sm"
      class="small-text-table">
    </b-table>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <b-pagination
        v-model="currentPage"
        :total-rows="executives.length"
        :per-page="executivesPerPage"
        aria-controls="my-table">
      </b-pagination>
      <span>Showing {{ (currentPage - 1) * executivesPerPage + 1 }} to
        {{ Math.min(currentPage * executivesPerPage, executives.length) }} of {{ executives.length }} entries</span>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import { format } from 'date-fns';

export default {
  name: 'CoReg_Executives',
  data() {
    return {
      sortBy: 'co_name',
      sortAsc: true,
      searchQuery: '',
      fields: [
        { key: 'requester', label: '소개구분' },
        { key: 'co_category', label: '법인구분' },
        { key: 'co_name', label: '상호'},
        { key: 'role', label: '직책' },
        { key: 'name', label: '임원이름' },
        { key: 'reg_date', label: '취임일' },
        { key: 'end_date', label: '임기만료일', sortable: true },
        { key: 'remaining_period', label: '남은기간', sortable: true },
      ],
      executives: [],
      currentPage: 1,
      executivesPerPage: 10
    };
  },
  computed: {
    fieldsWithIcons() {
      return this.fields.map(field => {
        if (!field.sortable) return field;
        const isSorted = field.key === this.sortBy;
        const icon = isSorted
          ? this.sortAsc
            ? ' ▲'
            : ' ▼'
          : '';
        return {
          ...field,
          label: field.label + icon
        };
      });
    },
    filteredExecutives() {
      let filtered = this.executives.filter(executive => {
        return Object.values(executive).some(value =>
          String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });

      if (this.sortBy) {
        filtered.sort((a, b) => {
          let aVal = a[this.sortBy];
          let bVal = b[this.sortBy];

          if (!aVal && !bVal) return 0;
          if (!aVal) return this.sortAsc ? -1 : 1;
          if (!bVal) return this.sortAsc ? 1 : -1;

          if (this.sortBy === 'end_date') {
            return this.sortAsc
              ? new Date(aVal) - new Date(bVal)
              : new Date(bVal) - new Date(aVal);
          }

          if (this.sortBy === 'remaining_period') {
            const aDays = parseInt(aVal.replace('일', ''));
            const bDays = parseInt(bVal.replace('일', ''));
            return this.sortAsc ? aDays - bDays : bDays - aDays;
          }

          return this.sortAsc
            ? aVal.toString().localeCompare(bVal.toString())
            : bVal.toString().localeCompare(aVal.toString());
        });
      }

      const start = (this.currentPage - 1) * this.executivesPerPage;
      const end = this.currentPage * this.executivesPerPage;
      return filtered.slice(start, end);
    }
  },
  created() {
    this.fetchExecutives();
  },
  methods: {
    async fetchExecutives() {
      try {
        const response = await axios.get('/api/executives');
        const executivesWithCompanyData = await Promise.all(response.data.map(async (executive) => {
          const companyResponse = await axios.get(`/api/co/${executive.company_id}`);
          const company = companyResponse.data;
          const periodValue = company.co_period === 'custom'
            ? company.co_custom_period
            : company.co_period;
          const expiryDate = executive.role === '감사'
            ? this.calculateAuditorEndDate(executive.reg_date, periodValue, company.co_settlement_month)
            : this.calculateEndDate(executive.reg_date, periodValue);
          const remainingPeriod = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

          return {
            ...executive,
            requester: company.requester,
            co_category: company.co_category === 'custom' ? company.custom_co_category : company.co_category,
            co_name: company.co_name,
            manager: company.manager,
            role: executive.role,
            end_date: expiryDate,
            remaining_period: `${remainingPeriod}일`,
          };
        }));
        this.executives = executivesWithCompanyData;
      } catch (error) {
        console.error("임원 목록 불러오기 오류:", error.response ? error.response.data : error.message);
      }
    },
    calculateEndDate(startDate, period) {
      const start = new Date(startDate);
      start.setFullYear(start.getFullYear() + parseInt(period));
      return format(start, 'yyyy-MM-dd');
    },
    calculateAuditorEndDate(startDate, period, settlementMonth) {
      const start = new Date(startDate);
      start.setFullYear(start.getFullYear() + parseInt(period));
      if (settlementMonth > 9) {
        const adjustedMonth = settlementMonth - 12;
        start.setMonth(adjustedMonth + 3);
      } else {
        start.setMonth(settlementMonth + 3);
      }
      start.setDate(0);
      return format(start, 'yyyy-MM-dd');
    },
    onSearch() {
      this.currentPage = 1;
    },
    onSort(field) {
      if (!this.fields.find(f => f.key === field)?.sortable) return;

      if (this.sortBy === field) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortBy = field;
        this.sortAsc = true;
      }
    },
    viewCompany(executive) {
      this.$router.push({ name: 'CoReg_Co_Detail', params: { company_id: executive.company_id } });
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
  text-align: center;
  padding: 16px 5px;
}

span {
  font-size: 14px !important;
}

:deep(.col1-requester),
:deep(.col1-co_category),
:deep(.col1-co_name),
:deep(.col1-reg_date),
:deep(.col1-role),
:deep(.col1-manager),
:deep(.col1-executive_name),
:deep(.col1-end_date),
:deep(.col1-remaining_period) {
  max-width: 150px !important;
}

/* Pagination 스타일 */
.pagination .page-link {
  padding: 0.3rem 0.7rem !important;
  font-size: 1rem !important;
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
</style>
