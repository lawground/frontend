<template>

  <div class="buttons">
    <b-button class="mx-1" @click="addStamp" variant="success">도장날인</b-button>
    <b-button class="mx-1" @click="printDocument" variant="primary">인쇄</b-button>
    <b-button class="mx-1" @click="saveAsImage" variant="warning">이미지저장</b-button>
  </div>

  <div>
    <!-- 확약서 -->
    <div class="hpa">
      <div class="hcD">
        <div class="head-row">
          전자소송 동의 확약서
        </div>
        <div class="category-row">
          <div class="row1">
            사건 : {{ extractYear(lawsuit.date) }}
          </div>
          <div class="row1">
            {{ lawsuit.clientType }} : {{ lawsuit.clients.join(', ') }}
          </div>
          <div class="row1">
            {{ lawsuit.opponentType }} : {{ lawsuit.opponents.join(', ') }}
          </div>
        </div>
        <div class="main-row">
          이 사건에 관하여 {{ lawsuit.clientType }} {{ lawsuit.clients.join(', ') }} 은(는) 민사소송 등에서의 전자문서 이용 등에 관한 규칙 제11조 제3항에
          따라, 추후 본인이 직접 소송서류를 제출하거나 송달받을 경우에는 그에 앞서 전자소송시스템을 통한 전자소송 진행에 동의할 것을 확약합니다.
        </div>
        <div class="date-row">
          {{ extractYear(lawsuit.date) }}년 {{ extractMonth(lawsuit.date) }}월 &nbsp;&nbsp;일
        </div>
        <div class="clients-row">
          <div class="clients-row-left">
            위임인
          </div>
          <div class="clients-row-right">
            <li class="clients-group" style="list-style-type: none; position: relative;"
              v-for="(client, idx) in lawsuit.clients" :key="idx">
              {{ client }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(인)
              <img v-if="stampImages[idx]" :src="stampImages[idx]" class="stamp-image" />
            </li>
          </div>
        </div>
      </div>
    </div>

    <!-- 위임인 확인서 -->
    <div class="hpa">
      <div class="head-row"> 제출위임인 확인서 </div>
      <div class="main-row2"> {{ lawsuit.clients.join(', ') }}은(는) 수임인 법무사 장윤진으로부터 법무사를 통한 전자소송 진행 방식(전자적 제출·송달·열람 등),
        전자소송 동의 확약서와 송달장소 및 송달영수인신고서 등의 법률적 의미에 관하여 충분한 설명을 들었으며, 수임인이 제출하는 (신청서, 제증명, 송달장소 및 송달영수인 신고서, 보정서, 취하서, 전자소송
        동의 확약서)이(가) 위임인의 의사에 따라 작성된 것임을 확인합니다(민사소송 등에서의 전자문서 이용 등에 관한 규칙 제11조 제3항 제2호 등에 따른 확인). </div>
      <div class="date-row">
        {{ extractYear(lawsuit.date) }}년 {{ extractMonth(lawsuit.date) }}월 &nbsp;&nbsp;일
      </div>
      <div class="clients-row2">
        <div class="clients-row-left2">
          위임인
        </div>
        <div class="clients-row-right2">
          <ul class="clients-list">
            <li class="clients-group2" style="list-style-type: none; position: relative;"
              v-for="(client, idx) in lawsuit.clients" :key="idx">
              {{ client }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(인)
              <img v-if="stampImages[idx]" :src="stampImages[idx]" class="stamp-image" />
            </li>
          </ul>
        </div>
      </div>
      <hr class="dashed-line">
      <div class="head-row2"> 제출위임장 </div>
      <div class="category-row2">법무사 장윤진<br>
        경기도 안양시 동안구 시민대로327번길 7, 8층 810호(관양동, 대명 글로벌 비즈스퀘어)<br>
        (전화 : 031-425-7533) </div>
      <div class="category-row">위 사람을 대리인으로 정하고 다음 사항의 권한을 위임함.</div>
      <div class="main-row2">{{ lawsuit.clientType }} {{ lawsuit.clients.join(', ') }}와(과) {{ lawsuit.opponentType }} {{
        lawsuit.opponents.join(', ') }} 사이의 {{ lawsuit.caseName }}에 관하여(신청서, 소장, 제증명, 송달장소 및 송달영수인 신고서, 준비서면, 보정서, 취하서,
        전자소송 동의
        확약서)을(를) 제출하는 행위</div>
      <div class="date-row">
        {{ extractYear(lawsuit.date) }}년 {{ extractMonth(lawsuit.date) }}월 &nbsp;&nbsp;일
      </div>
      <div class="clients-row2">
        <div class="clients-row-left2">
          위임인
        </div>
        <div class="clients-row-right2">
          <ul class="clients-list">
            <li class="clients-group2" style="list-style-type: none; position: relative;"
              v-for="(client, idx) in lawsuit.clients" :key="idx">
              {{ client }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(인)
              <img v-if="stampImages[idx]" :src="stampImages[idx]" class="stamp-image" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import html2canvas from 'html2canvas';

export default {
  props: ['index'], // 부모 컴포넌트로부터 전달받은 'index' 프로퍼티를 사용
  data() {
    return {
      lawsuit: {
        clientType: '',
        clients: [''],
        opponentType: '',
        opponents: [''],
        date: '',
        caseName: '',
        court: ''
      },
      stampImages: [] // 도장 이미지를 저장할 배열
    };
  },
  created() {
    this.fetchLawsuit(); // 컴포넌트가 생성될 때 소송 정보를 가져오는 메서드 호출
  },
  methods: {
    fetchLawsuit() {
      const index = this.index; // props로 전달받은 index 사용
      axios.get(`/api/lawsuits/${index}`) // 서버로부터 해당 인덱스의 소송 정보를 가져오는 GET 요청
        .then(response => {
          this.lawsuit = response.data; // 서버로부터 받은 데이터를 lawsuit에 저장
        })
        .catch(error => {
          console.error("소송 정보를 불러오는 중에 오류가 발생했습니다:", error); // 오류 발생 시 콘솔에 메시지 출력
        });
    },
    generateStamps() {
      this.lawsuit.clients.forEach((client, idx) => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 150;
        this.createStamp(canvas, client);
        this.stampImages.splice(idx, 1, canvas.toDataURL('image/png'));
      });
    },
    createStamp(canvas, clientName) {
      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 타원 그리기
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 25, 57, 0, 0, 2 * Math.PI); // 단축 값을 70으로 늘리고 장축 값을 60으로 설정
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3; // 선의 두께를 조정
      ctx.stroke();

      // 이름 세로로 쓰기
      ctx.font = 'bold 30px Arial'; // 글자 크기를 30px로 설정하고 굵게 만듦
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const nameArr = clientName.split('');
      const lineHeight = 32; // 글자 간격 설정

      nameArr.forEach((char, i) => {
        ctx.fillText(char, centerX, centerY - (nameArr.length - 1) * lineHeight / 2 + i * lineHeight); // 글자 간격을 조정
      });

    },
    printDocument() {
      const elements = document.querySelectorAll('.hpa');
      elements.forEach(element => {
        element.querySelectorAll('.stamp-canvas').forEach(canvas => {
          const img = document.createElement('img');
          img.src = canvas.toDataURL('image/png');
          img.style.position = canvas.style.position;
          img.style.top = canvas.style.top;
          img.style.left = canvas.style.left;
          img.style.transform = canvas.style.transform;
          img.style.width = canvas.style.width;
          img.style.height = canvas.style.height;
          img.style.opacity = canvas.style.opacity;
          canvas.replaceWith(img);
        });
      });

      // 인쇄 전 스타일 적용
      const buttonsDiv = document.querySelector('.buttons');
      const hpaElements = document.querySelectorAll('.hpa');
      
      // 버튼 숨기기
      buttonsDiv.style.display = 'none';
      
      // hpa 여백 제거
      hpaElements.forEach(element => {
        element.style.marginLeft = '0';
        element.style.marginRight = '0';
      });

      // 인쇄
      window.print();

      // 원래대로 되돌리기
      buttonsDiv.style.display = 'block';
      hpaElements.forEach(element => {
        element.style.marginLeft = '2mm';
        element.style.marginRight = '2mm';
      });
      
      window.location.reload();
    },


    // 이미지 저장 버튼
    saveAsImage() {
    const elements = document.querySelectorAll('.hpa');
    elements.forEach((element, index) => {
      const clientName = this.lawsuit.clients;
      const caseName = this.lawsuit.caseName;
      
      // 기본 스타일 저장
      const originalBorder = element.style.border;
      const originalBoxShadow = element.style.boxShadow;

      // 그림자와 테두리 삭제
      element.style.border = 'none';
      element.style.boxShadow = 'none';

      html2canvas(element).then(canvas => {
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${clientName}_${caseName}_확약서 및 동의서_${index + 1}.png`;
          link.click();
          URL.revokeObjectURL(url); // 메모리 해제를 위해 URL 객체 해제

          // 다시 기본스타일로 만듬
          element.style.border = originalBorder;
          element.style.boxShadow = originalBoxShadow;
        });
      });
    });
  },

    extractYear(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.getFullYear();
    },

    extractMonth(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.getMonth() + 1; // getMonth()는 0부터 11까지의 값을 반환하므로 +1 해줍니다.
  },


    addStamp() {
      this.generateStamps();
    }
  }
}
</script>

<style scoped>
.buttons { padding-bottom: 20px; }
.container { max-width: 0%; margin-left: 0; }
.contents { margin: 30px; }
.hpa {
  font-family: "바탕";
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  position: relative;
  padding: 0;
  overflow: hidden;
  margin-left: 2mm; /* 기본 여백 */
  margin-right: 2mm; /* 기본 여백 */
  margin-bottom: 2mm;
  margin-top: 0mm;
  border: 1px black solid;
  box-shadow: 1mm 1mm 0 #AAAAAA;
}
.head-row {
  padding-top: 1.5cm;
  padding-bottom: 0.5cm;
  font-size: 0.7cm;
  text-align: center;
  font-weight: bold;
}
.category-row {
  padding-top: 1cm;
  padding-left: 1cm;
  font-family: "바탕";
}
.category-row .row1 { padding-top: 5mm; }
.main-row {
  padding: 1cm;
  line-height: 200%;
}
.date-row {
  font-size: 13pt;
  text-align: center;
}
.clients-row {
  display: flex;
  padding-top: 2cm;
  padding-bottom: 2cm;
}
.clients-row-left {
  width: 50%;
  text-align: right;
  padding-right: 2cm;
}
.clients-row-right {
  width: 50%;
  text-align: left;
}
.clients-row-right .clients-group {
  padding-bottom: 8mm;
  position: relative;
}
.dashed-line { border-top: 2px dashed black; }

.main-row2 {
  padding-left: 0.8cm;
  padding-right: 0.8cm;
  padding-top: 0.3cm;
  padding-bottom: 0.3cm;
  line-height: 160%;
}
.head-row2 {
  padding-top: 1cm;
  font-size: 0.7cm;
  text-align: center;
  font-weight: bold;
}
.clients-row2 {
  display: flex;
  padding-top: 1cm;
}
.clients-row-left2 {
  width: 50%;
  text-align: right;
  padding-right: 2cm;
}
.clients-row-right2 {
  width: 50%;
  text-align: left;
}
.clients-row-right2 .clients-group2 {
  padding-bottom: 8mm;
  position: relative;
}
.category-row2 {
  padding-top: 1cm;
  padding-left: 1.5cm;
}
.stamp-image {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-165%, -64%) rotate(6deg);
  width: 55px;
  height: 71px;
  opacity: 0.7;
}
.contents{margin:0%}

@media print {
  .buttons {
    display: none;
  }
  .hpa {
    margin-left: 0 !important;
    margin-right: 0 !important;
    border: none !important; /* 테두리 제거 */
    box-shadow: none !important;
  }
}

</style>
