/* 자활 도구 목록 — 이 파일 하나만 고치면 카드와 3D 사무실이 함께 바뀜.
   새 도구 넣는 법 (README.md에도 있음)
   1) 아래 목록 끝에 { … } 하나를 복사해 붙이고 글·주소를 바꾼다.
   2) spot(3D 사무실의 물건): desk 책상 · shelf 책장 · table 상담 탁자 · board 칠판 · counter 안내 데스크 · kiosk 세움 화면(새 도구 기본)
   3) pic: img/ 안의 굿균 그림 이름(없으면 hello). tags: work 매일 업무 · rule 지침·수급 · new 처음 · part 참여자
   4) navLabel: 3D 화면 아래 번호 단추에 쓸 짧은 이름(없으면 short의 첫 낱말)
   5) 사무실 자리는 들어온 순서대로 자동 배치(최대 8개). 순서를 바꾸면 자리도 바뀜. */
window.JAHWAL_TOOLS = [
  {
    id: 'tools', title: '지역자활센터 업무 도구', short: '업무 도구', sub: '실무자 도구 모음', who: '실무자',
    desc: '계산기·서식·문서·홍보·사무·안전 도구를 한 화면에서 골라 써요.',
    feats: ['견적서·부가세', '근로시간', '자활 서식 71종', '주소 라벨', 'PDF 나누기', '안전 표지'],
    links: [{ label: '열어 보기', url: 'https://jahwalktg.github.io/jahwal-tools/' }],
    tags: ['work'], color: '#1A6EFF', pic: 'tools', spot: 'desk', navLabel: '업무'
  },
  {
    id: 'search', title: '자활 지침 찾기', short: '지침 찾기', sub: '낱말 하나로 지침 원문을', who: '실무자 · 지침 확인',
    desc: '2026년 자활사업·자산형성지원사업·국민기초생활보장사업 안내 본문을 낱말로 바로 찾아요.',
    feats: ['쪽수 표시', '근거 복사', '「작년엔 뭐였지」 2025년과 비교'],
    note: 'AI가 답을 지어내지 않아요. 지침 글자를 그대로 찾아 보여 줘요.',
    links: [{ label: '열어 보기', url: 'https://jahwalktg.github.io/jahwal-search/' }],
    tags: ['work', 'rule'], color: '#0F8A6C', pic: 'search', spot: 'shelf', navLabel: '지침'
  },
  {
    id: 'gukgicho', title: '국기초 가늠표', short: '국기초 가늠표', sub: '자산형성 길잡이 포함', who: '상담 · 수급 가늠',
    desc: '내 상황을 넣어 국민기초생활보장 수급 가능성을 가늠해 봐요.',
    feats: ['희망저축계좌', '청년내일저축계좌', '통장 비교', '유지·만기 안내'],
    links: [{ label: '가늠표', url: 'https://jahwalktg.github.io/gukgicho/' }, { label: '자산형성 길잡이', url: 'https://jahwalktg.github.io/gukgicho/asset/' }],
    tags: ['rule', 'part'], color: '#C2601F', pic: 'gukgicho', spot: 'table', navLabel: '가늠표'
  },
  {
    id: 'start', title: '어서와, 자활은 처음이지?', short: '자활은 처음이지?', sub: '신입 실무자 안내서', who: '신입 실무자',
    desc: '처음 듣는 말과 처음 하는 일을 쉬운 말로 차근차근 알려 줘요.',
    feats: ['쉬운 말 사전', '업무 절차', '한 해 달력', '첫 주 체크'],
    links: [{ label: '열어 보기', url: 'https://jahwalktg.github.io/jahwal-start/' }],
    tags: ['new'], color: '#7B4BD6', pic: 'start', spot: 'board', navLabel: '신입'
  },
  {
    id: 'guide', title: '자활 참여자 길잡이', short: '참여자 길잡이', sub: '참여자에게 나눠 주는 안내', who: '참여자 안내',
    desc: '급여명세서 낱말, 일할 때 지킬 것, 일하면 손해일까, 안전·건강을 쉬운 말로 풀었어요.',
    note: '종사자 화면에서 센터 연락처를 넣으면 참여자용 QR·링크가 만들어져요.',
    links: [{ label: '종사자 화면 열기', url: 'https://jahwalktg.github.io/jahwal-guide/#staff' }],
    tags: ['part'], color: '#D2366B', pic: 'guide', spot: 'counter', navLabel: '참여자'
  },
  {
    id: 'bokjiro', title: '복지제도 찾기', short: '복지제도 찾기', sub: '대상자 조건으로 복지로 제도를', who: '상담 · 사례관리 · 게이트웨이',
    desc: '나이대·가구 상황·지역을 고르면 복지로에 올라 있는 중앙부처·지자체 제도 가운데 살펴볼 만한 것을 모아 보여 줘요. 참여자에게 맞을 만한 다른 제도를 함께 살펴볼 때 써요. 지원대상·선정기준·신청 방법·문의처까지 원문 그대로.',
    feats: ['중앙부처·지자체 제도', '복지로 원문 링크', '자료 받은 날짜 표시', '상담 준비 한 장 인쇄', 'AI 주문서', '저장 없음'],
    note: '복지로 공식 서비스가 아니에요. 공개 자료를 미리 받아 둔 참고용이라 판정하지 않고, 원문과 담당 기관에서 꼭 확인해요.',
    links: [{ label: '열어 보기', url: 'https://jahwalktg.github.io/bokjiro-search/' }],
    tags: ['rule'], color: '#0B7285', pic: 'search', spot: 'kiosk', navLabel: '복지제도'
  },
  {
    id: 'motion', title: '즉석 모션그래픽', short: '모션그래픽', sub: '로고·글자만 바꿔 바로 GIF·MP4로', who: '행사 담당 · 발표 준비',
    desc: '행사 화면과 PPT에 넣을 움직이는 장면 70가지. 국민의례(음원)·시상·호명·카운트다운·타이머·숫자 올라가기·조직도·명절 인사까지 글자만 바꿔 1~2분에 받아요. 급할 땐 전체화면으로 바로 재생, 여러 장면은 골라 담아 PPT 한 파일로.',
    feats: ['장면 70가지', '디자인 테마 7종', 'MP4·GIF·PNG', '전체화면 재생', 'PPT 묶음', '국민의례 음원'],
    note: '설치·로그인 없이 브라우저에서 바로 만들어요. 입력한 글·사진은 어디에도 보내지 않아요.',
    links: [{ label: '열어 보기', url: 'https://jahwalktg.github.io/jahwal-motion/' }],
    tags: ['work'], color: '#7C3AED', pic: 'hello', spot: 'board', navLabel: '모션'
  },
  {
    id: 'office', title: '뚝딱 한엑피 공방', short: '한엑피', sub: '한글·엑셀·PPT 반복 일을 뚝딱', who: '보고서·행사 사진·발표 자료',
    desc: '엑셀 표를 한글 표로, 옛 hwp 파일을 hwpx로 한꺼번에, 부서별 엑셀 합치기·나누기, 꾸민 표를 깨끗하게 바꾸는 표 청소기, 피벗 없이 집계표, 엑셀 숫자를 고칠 수 있는 PPT 차트로, 사진 폴더를 PPT 앨범으로, 무거운 PPT·한글 파일 줄이기. 도구마다 예시로 먼저 해 볼 수 있어요.',
    feats: ['엑셀 표 → 한글 표', 'HWP → HWPX 바꾸기', '엑셀 합치기·나누기', '표 청소기', '피벗 없이 집계표', 'PPT 차트', '사진 앨범 PPT', '용량 줄이기'],
    note: '설치·로그인 없이 브라우저에서 바로. 넣은 파일은 어디에도 보내지 않아요.',
    links: [{ label: '열어 보기', url: 'https://jahwalktg.github.io/jahwal-office/' }],
    tags: ['work'], color: '#1D7A46', pic: 'tools', spot: 'desk', navLabel: '한엑피'
  }
];
