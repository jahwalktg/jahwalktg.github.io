/* 김태균 도구 공통 「의견·문의」 — 모든 사이트(jahwalktg.github.io/…)가 이 파일 하나를 불러 씀.
   - 설문은 하나(김태균 도구 의견·문의). 「사이트」·「화면」 칸을 링크에 담아 자동으로 채움 → 응답 시트 한 곳에서 걸러 보기.
   - 메일 링크는 제목에 [사이트 › 화면]을 넣음 → 지메일에서 제목으로 걸러 보기.
   - 이미 있는 옛 설문 링크·mailto 링크는 새 형식으로 바꿔 주고, 문의 링크가 하나도 없는 화면에는 맨 아래 한 줄을 붙임.
   - 설문을 바꾸면 아래 FORM 세 줄만 고치면 됨. 사이트 이름은 SITES. */
(function () {
  if (window.__jtContact) return; window.__jtContact = 1;
  var FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeLbEHToGS4f1OqD_MUcwBTR7lm_tWQ6YiQonG1BaHVspLeZQ/viewform';
  var E_SITE = 'entry.743554503', E_SCREEN = 'entry.187621732';
  var MAIL = 'jahwalktg@gmail.com';
  var OLD = /docs\.google\.com\/forms\/d\/e\/(1FAIpQLSexSFxYOztvqwaG2vQ5IGS0lal4SmBjz7CgSjATp0ozb1W1PQ|1FAIpQLScT2se9k9-LEl0YCyvyBpE8xNlZZSZ9UC67DmWotTKymzqV7Q|1FAIpQLSeLbEHToGS4f1OqD_MUcwBTR7lm_tWQ6YiQonG1BaHVspLeZQ)/;
  var SITES = {
    '': '자활 도구 모음',
    'jahwal-tools': '1번 지역자활센터 업무 도구',
    'gukgicho': '2번 국기초 가늠표',
    'jahwal-guide': '3번 자활 참여자 길잡이',
    'jahwal-start': '4번 어서와 자활은 처음이지',
    'jahwal-buddy': '5번 AI 동료 유형',
    'jahwal-search': '6번 자활 지침 찾기',
    'welfare': '사회복지 도구 모음',
    'welfare-tools': '사회복지사 업무 도구',
    'welfare-search': '사회복지 지침 찾기',
    'bokjiro-search': '복지제도 찾기'
  };
  function info() {
    var parts = location.pathname.split('/').filter(Boolean);
    var onGh = /github\.io$/.test(location.hostname);
    var key = onGh ? (parts[0] && SITES[parts[0]] !== undefined ? parts[0] : '') : null;
    var site = key !== null ? SITES[key] : (window.JT_SITE || '미리보기(' + location.host + ')');
    var rest = onGh && key ? parts.slice(1) : parts;
    rest = rest.filter(function (p) { return p !== 'index.html'; });
    var title = (document.title || '').split(/\s+[—|–-]\s+/)[0].trim();
    var screen = (rest.length ? title + ' (' + rest.join('/') + ')' : '첫 화면 · ' + title) + (location.hash && location.hash.length < 30 ? ' ' + location.hash : '');
    return { site: site, screen: screen };
  }
  function formUrl() { var i = info(); return FORM + '?usp=pp_url&' + E_SITE + '=' + encodeURIComponent(i.site) + '&' + E_SCREEN + '=' + encodeURIComponent(i.screen); }
  function mailUrl(oldHref) {
    var i = info(), tag = '[' + i.site + ' › ' + i.screen + '] ';
    var m = /[?&]subject=([^&]*)/.exec(oldHref || ''), sub = m ? decodeURIComponent(m[1]) : '문의';
    while (sub.indexOf(tag) === 0) sub = sub.slice(tag.length);
    var b = /[?&]body=([^&]*)/.exec(oldHref || '');
    return 'mailto:' + MAIL + '?subject=' + encodeURIComponent(tag + sub) + (b ? '&body=' + b[1] : '');
  }
  window.JTContact = { formUrl: formUrl, mailUrl: mailUrl, info: info };
  function fix() {
    var found = 0, forms = 0;
    [].forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href');
      if (OLD.test(h)) { a.href = formUrl(); a.target = '_blank'; a.rel = 'noopener'; found++; forms++; }
      else if (/^mailto:jahwalktg@gmail\.com/i.test(h)) { a.href = mailUrl(h); found++; }
    });
    // 메일 주소가 글자로만 적힌 곳(링크 아님)은 링크로
    [].forEach.call(document.querySelectorAll('[data-jt-contact], #makerLine'), function (el) {
      if (el.querySelector('a') || el.textContent.indexOf(MAIL) < 0) return;
      el.innerHTML = el.innerHTML.replace(MAIL, '<a href="' + mailUrl() + '">' + MAIL + '</a> · <a href="' + formUrl() + '" target="_blank" rel="noopener">의견 설문</a>');
      found++; forms++;
    });
    return forms;
  }
  function bar() {
    if (document.getElementById('jtContactBar')) return;
    var p = location.pathname.split('/').filter(Boolean)[0];
    if (p === 'jahwal-guide') return; // 참여자 화면에는 붙이지 않음
    var d = document.createElement('div');
    d.id = 'jtContactBar';
    d.style.cssText = 'margin:28px auto 18px;max-width:960px;padding:10px 16px;text-align:center;font-size:13px;line-height:1.7;color:#6b7280;border-top:1px solid rgba(127,127,127,.25)';
    d.innerHTML = '이 화면에 대한 의견·문의: <a href="' + formUrl() + '" target="_blank" rel="noopener" style="color:#1a6eff;font-weight:600">의견 보내기(설문)</a> · <a href="' + mailUrl() + '" style="color:#1a6eff">메일 ' + MAIL + '</a>'
      + '<div style="margin-top:4px;font-size:12.5px">' + UPD + '</div>';
    printHide(); document.body.appendChild(d);
    var n = document.getElementById('jtUpdateNote'); if (n) n.remove();
  }
  /* 업데이트 안내(2026-11-13 태균님): 도구는 의견만이 아니라 해가 바뀐 기준·지침, 고쳐진 원문에 맞춰 수시로 고쳐진다는 것.
     ① 모든 화면 맨 아래 한 줄(의견·문의 줄이 있으면 그 안에, 없으면 따로) ② 처음 한 번만 뜨는 작은 알림(브라우저에 기억, 모든 사이트 공통)
     참여자 화면(jahwal-guide)·인쇄물에는 넣지 않음. 문구를 바꾸면 UPD·TOAST만, 다시 한 번 띄우려면 TOAST_ID를 새 값으로. */
  var UPD = '도구는 해가 바뀐 기준·지침, 고쳐진 원문(지침·법령·복지로 등), 보내 주신 의견을 반영해 수시로 고쳐집니다. 내려받아 둔 파일보다 이 주소로 열어 쓰시고, 중요한 숫자는 원문과 함께 확인해 주세요.';
  var TOAST_ID = 'upd-2026-11';
  var isGuide = function () { return location.pathname.split('/').filter(Boolean)[0] === 'jahwal-guide'; };
  function printHide() {
    if (document.getElementById('jtContactCss')) return;
    var st = document.createElement('style'); st.id = 'jtContactCss';
    st.textContent = '@media print{#jtContactBar,#jtUpdateNote,#jtUpdToast{display:none!important}}'
      + '#jtUpdToast{position:fixed;left:16px;bottom:16px;z-index:2147483000;max-width:360px;background:#fff;color:#1f2937;border:1px solid rgba(0,0,0,.12);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:14px 16px 12px;font-size:14px;line-height:1.6;font-family:inherit;animation:jtUpdIn .35s ease both}'
      + '#jtUpdToast b{display:block;font-size:15px;margin-bottom:4px}#jtUpdToast .r{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}'
      + '#jtUpdToast button{border:0;border-radius:9px;padding:7px 14px;background:#1a6eff;color:#fff;font:inherit;font-weight:700;cursor:pointer}#jtUpdToast a{align-self:center;color:#1a6eff;font-size:13px}'
      + '@keyframes jtUpdIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'
      + '@media (max-width:520px){#jtUpdToast{left:10px;right:10px;bottom:10px;max-width:none}}'
      + '@media (prefers-color-scheme:dark){#jtUpdToast{background:#1f2937;color:#e5e7eb;border-color:rgba(255,255,255,.15)}}';
    document.head.appendChild(st);
  }
  function note() {
    if (isGuide() || document.getElementById('jtContactBar') || document.getElementById('jtUpdateNote')) return;
    var d = document.createElement('div'); d.id = 'jtUpdateNote';
    d.style.cssText = 'margin:20px auto 16px;max-width:960px;padding:8px 16px;text-align:center;font-size:12.5px;line-height:1.7;color:#6b7280';
    d.textContent = UPD; printHide(); document.body.appendChild(d);
  }
  function toast() {
    if (isGuide() || window.top !== window.self) return;
    var seen = ''; try { seen = localStorage.getItem('jt.updToast') || ''; } catch (e) { return; }
    if (seen === TOAST_ID) return;
    setTimeout(function () {
      if (document.getElementById('jtUpdToast')) return;
      printHide();
      var t = document.createElement('div'); t.id = 'jtUpdToast'; t.setAttribute('role', 'status');
      t.innerHTML = '<b>수시로 고쳐지는 도구예요</b>해가 바뀌어 기준·지침이 달라지거나 원문이 고쳐지면, 그리고 보내 주신 의견이 있으면 도구도 그때그때 고쳐집니다. 즐겨찾기해 둔 이 주소로 열면 늘 최신 내용이에요.'
        + '<div class="r"><a href="' + formUrl() + '" target="_blank" rel="noopener">의견 보내기</a><button type="button">알겠어요</button></div>';
      t.querySelector('button').onclick = function () { try { localStorage.setItem('jt.updToast', TOAST_ID); } catch (e) {} t.remove(); };
      document.body.appendChild(t);
    }, 2500);
  }
  function run() { if (!fix()) bar(); else note(); toast(); } // 설문 링크가 없는 화면(메일만 있는 곳 포함)에는 맨 아래 한 줄, 있으면 업데이트 안내 한 줄만
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  // 화면이 나중에 그리는 링크(의견 창 등)도 바꾸고, 주소 # 가 바뀌면 화면 이름도 새로
  setTimeout(fix, 1500);
  // 누르는 순간에도 한 번 더 (화면이 링크를 나중에 바꿔도 사이트·화면 표시가 빠지지 않게)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href');
    if (OLD.test(h)) a.href = formUrl(); else if (/^mailto:jahwalktg@gmail\.com/i.test(h)) a.href = mailUrl(h);
  }, true);
  window.addEventListener('hashchange', function () { fix(); var b = document.getElementById('jtContactBar'); if (b) { b.remove(); bar(); } });
})();
