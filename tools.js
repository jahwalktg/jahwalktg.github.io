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
  }
];
