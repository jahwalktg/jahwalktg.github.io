/* 굿균의 자활 사무실 — 3D로 지은 사무실을 걸어 다니며 도구를 고르는 첫 화면.
   도구 목록은 tools.js(window.JAHWAL_TOOLS)에서 읽음: 들어온 순서대로 SLOTS 자리에 놓이고, spot 종류대로 물건을 지음.
   WebGL이 안 되면 아무것도 하지 않음(아래 카드 목록이 그대로 보임). */
(function () {
  var T = window.JAHWAL_TOOLS || [];
  if (!window.THREE || !T.length) return;
  var cv = document.createElement('canvas');
  try { if (!(cv.getContext('webgl') || cv.getContext('experimental-webgl'))) return; } catch (e) { return; }

  var stage = document.getElementById('stage');
  document.documentElement.classList.add('has3d');
  stage.insertBefore(cv, stage.firstChild);
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = [].slice.call(document.querySelectorAll('#grid .card'));

  /* 자리 8곳 (위치·앞쪽 방향). 도구가 들어온 순서대로 앉음 */
  var SLOTS = [
    { p: [-6, -4.4], f: [0.25, 1] },
    { p: [-0.2, -6.9], f: [0, 1] },
    { p: [5.6, -3.4], f: [0.2, 1] },
    { p: [-9.4, 2.2], f: [1, 0.15] },
    { p: [5.4, 3.6], f: [-0.55, 1] },
    { p: [9.6, -0.6], f: [-1, 0.25] },
    { p: [-5.2, 5.6], f: [0.35, 1] },
    { p: [0.6, 6.4], f: [0, 1] }
  ];
  T = T.slice(0, SLOTS.length);
  var HUB = [0, 0.9];   /* 굿균이 자리 사이를 오갈 때 거치는 사무실 가운데 */
  var ST = T.map(function (t, i) {
    var s = SLOTS[i], f = new THREE.Vector3(s.f[0], 0, s.f[1]).normalize();
    return { t: t, p: new THREE.Vector3(s.p[0], 0, s.p[1]), f: f, side: new THREE.Vector3(-f.z, 0, f.x), color: new THREE.Color(t.color || '#1A6EFF').getHex() };
  });

  var R = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
  R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  R.shadowMap.enabled = true;
  R.shadowMap.type = THREE.PCFSoftShadowMap;
  R.outputEncoding = THREE.sRGBEncoding;
  R.toneMapping = THREE.ACESFilmicToneMapping;
  R.toneMappingExposure = 1.05;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xE4ECF8);
  scene.fog = new THREE.Fog(0xE4ECF8, 30, 60);
  var cam = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xA9B4C8, 0.85));
  var sun = new THREE.DirectionalLight(0xFFF2DD, 0.85);
  sun.position.set(7, 15, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  var sc = sun.shadow.camera; sc.left = -14; sc.right = 14; sc.top = 12; sc.bottom = -12; sc.far = 40;
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  var win = new THREE.PointLight(0xCFE3FF, 0.35, 18); win.position.set(0, 4, -6); scene.add(win);

  /* 작은 도우미 */
  var mats = {};
  function M(c, o) { var k = c + JSON.stringify(o || {}); return mats[k] || (mats[k] = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.65, metalness: 0.05 }, o || {}))); }
  function put(geo, mat, x, y, z, parent, noShadow) {
    var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
    if (!noShadow) { m.castShadow = true; m.receiveShadow = true; }
    (parent || scene).add(m); return m;
  }
  function box(w, h, d, c, x, y, z, parent, o) { return put(new THREE.BoxGeometry(w, h, d), M(c, o), x, y, z, parent); }
  function cyl(rt, rb, h, c, x, y, z, parent, seg) { return put(new THREE.CylinderGeometry(rt, rb, h, seg || 24), M(c), x, y, z, parent); }
  function tex(w, h, draw) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t;
  }
  var FONT = '"Pretendard","Apple SD Gothic Neo","Malgun Gothic",sans-serif';
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function css(hex) { return '#' + ('00000' + hex.toString(16)).slice(-6); }
  function lighten(hex, k) { var c = new THREE.Color(hex); c.lerp(new THREE.Color(0xffffff), k); return c.getHex(); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function wrapText(g, s, maxW) {
    var out = [], line = '';
    s.split(' ').forEach(function (w) { var t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; });
    if (line) out.push(line); return out;
  }

  /* 방: 나무 바닥·벽·창 */
  var floorT = tex(1024, 1024, function (g, w, h) {
    g.fillStyle = '#D9B98F'; g.fillRect(0, 0, w, h);
    for (var y = 0; y < h; y += 64) for (var x = -((y / 64) % 2) * 160; x < w; x += 320) {
      var s = 0.9 + ((x * 7 + y * 13) % 17) / 100;
      g.fillStyle = 'rgba(' + Math.round(200 * s) + ',' + Math.round(165 * s) + ',' + Math.round(120 * s) + ',1)';
      g.fillRect(x + 2, y + 2, 316, 60);
    }
  });
  floorT.wrapS = floorT.wrapT = THREE.RepeatWrapping; floorT.repeat.set(3, 2.2);
  var floor = put(new THREE.PlaneGeometry(24, 18), new THREE.MeshStandardMaterial({ map: floorT, roughness: 0.8 }), 0, 0, 0);
  floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  var wallC = 0xF4F1EA;
  box(24, 5, 0.3, wallC, 0, 2.5, -9.15);
  box(0.3, 5, 18, wallC, -12.15, 2.5, 0);
  box(24, 0.25, 0.32, 0xC9B79C, 0, 0.12, -8.98);
  box(0.32, 0.25, 18, 0xC9B79C, -11.98, 0.12, 0);
  [-7.5, 4, 9].forEach(function (x) {
    box(2.6, 2.2, 0.08, 0xBFD9FF, x, 2.9, -8.98, null, { emissive: 0x9CC4FF, emissiveIntensity: 0.55, roughness: 0.2 });
    box(2.8, 0.12, 0.2, 0xFFFFFF, x, 1.75, -8.92); box(0.1, 2.2, 0.12, 0xFFFFFF, x, 2.9, -8.92); box(2.6, 0.1, 0.12, 0xFFFFFF, x, 2.9, -8.92);
  });
  put(new THREE.CylinderGeometry(3.4, 3.4, 0.03, 48), M(0xFFE7B8), HUB[0], 0.02, HUB[1]).castShadow = false;
  put(new THREE.CylinderGeometry(2.6, 2.6, 0.035, 48), M(0xFFD48A), HUB[0], 0.03, HUB[1]).castShadow = false;
  var clockT = tex(256, 256, function (g) {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill();
    g.strokeStyle = '#1A2B50'; g.lineWidth = 10; g.stroke();
    for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; g.fillStyle = '#1A2B50'; g.fillRect(128 + Math.sin(a) * 95 - 4, 128 - Math.cos(a) * 95 - 4, 8, 8); }
  });
  put(new THREE.CircleGeometry(0.55, 32), new THREE.MeshStandardMaterial({ map: clockT }), -2.2, 3.6, -8.98, null, true);
  var hand = box(0.05, 0.42, 0.02, 0x1A2B50, -2.2, 3.6, -8.95); hand.geometry.translate(0, 0.2, 0); hand.position.y = 3.6;
  var signT = tex(1024, 256, function (g, w, h) {
    rr(g, 0, 0, w, h, 40); g.fillStyle = '#1A2B50'; g.fill();
    g.fillStyle = '#FFD166'; g.font = 'bold 92px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('굿균의 자활 사무실', w / 2, h / 2 + 4);
  });
  put(new THREE.PlaneGeometry(4.4, 1.1), new THREE.MeshStandardMaterial({ map: signT, transparent: true }), -11.95, 3.9, -3.2, null, true).rotation.y = Math.PI / 2;

  function plant(x, z, s, parent) {
    s = s || 1;
    cyl(0.32 * s, 0.24 * s, 0.6 * s, 0xE07A5F, x, 0.3 * s, z, parent);
    put(new THREE.IcosahedronGeometry(0.55 * s, 1), M(0x4CAF7A, { flatShading: true }), x, 1.0 * s, z, parent);
    put(new THREE.IcosahedronGeometry(0.4 * s, 1), M(0x6CC48E, { flatShading: true }), x + 0.25 * s, 1.35 * s, z - 0.1 * s, parent);
  }
  plant(-10.8, -7.9, 1.3); plant(10.8, -7.9, 1.2); plant(-10.8, 6.5, 1.1);
  function chair(x, z, ry, c, parent) {
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; (parent || scene).add(g);
    cyl(0.05, 0.05, 0.5, 0x555E70, 0, 0.25, 0, g, 10);
    box(0.62, 0.1, 0.6, c, 0, 0.55, 0, g); box(0.62, 0.7, 0.1, c, 0, 0.95, -0.28, g);
    cyl(0.32, 0.32, 0.04, 0x3A4255, 0, 0.03, 0, g, 16);
    return g;
  }

  /* 물건 종류 — 모두 그룹 원점 기준, 앞쪽이 +z. 색은 도구 색을 받음 */
  var anim = [];
  var SPOTS = {
    desk: function (g, c, t) {
      box(3.2, 0.12, 1.5, 0xF7F2EA, 0, 1.0, 0, g);
      [[-1.5, -0.65], [1.5, -0.65], [-1.5, 0.65], [1.5, 0.65]].forEach(function (p) { box(0.1, 1, 0.1, 0x8B95A8, p[0], 0.5, p[1], g); });
      box(0.9, 0.8, 1.3, 0xE3E8F2, 1.05, 0.5, 0, g);
      var scr = tex(512, 300, function (x, w, h) {
        x.fillStyle = '#0F1C3F'; x.fillRect(0, 0, w, h);
        x.fillStyle = css(c); x.fillRect(0, 0, w, 44);
        x.fillStyle = '#fff'; x.font = 'bold 26px ' + FONT; x.fillText(t.title, 16, 31);
        var lab = (t.feats || []).slice(0, 8), cols = ['#4C8DFF', '#3DD6A3', '#FFB347', '#B497FF', '#FF7FA6', '#5CC8FF', '#FFD166', '#7ED957'];
        for (var i = 0; i < 8; i++) {
          var bx = 16 + (i % 4) * 122, by = 60 + Math.floor(i / 4) * 116;
          rr(x, bx, by, 108, 100, 14); x.fillStyle = cols[i]; x.fill();
          if (lab[i]) { x.fillStyle = '#0F1C3F'; x.font = 'bold 19px ' + FONT; x.textAlign = 'center'; x.fillText(lab[i].slice(0, 7), bx + 54, by + 58); x.textAlign = 'left'; }
        }
      });
      box(0.12, 0.45, 0.12, 0x3A4255, -0.35, 1.28, -0.4, g);
      box(1.7, 1.0, 0.07, 0x1A2B50, -0.35, 1.9, -0.45, g);
      put(new THREE.PlaneGeometry(1.6, 0.92), new THREE.MeshBasicMaterial({ map: scr }), -0.35, 1.9, -0.41, g, true);
      box(1.0, 0.04, 0.35, 0xDDE3EE, -0.35, 1.08, 0.2, g);
      var mug = cyl(0.12, 0.1, 0.24, 0xFFD166, 1.2, 1.18, 0.25, g, 16);
      plant(1.3, -0.4, 0.45, g);
      chair(-0.3, 1.25, Math.PI, c, g);
      anim.push(function (s) { mug.rotation.y = s * 0.6; });
    },
    shelf: function (g, c) {
      box(3.6, 3.4, 0.7, 0x9C7350, 0, 1.7, -0.6, g);
      box(3.4, 3.2, 0.62, 0x6E4E33, 0, 1.75, -0.55, g);
      var bc = [c, 0x1A6EFF, 0xE63946, 0xFFD166, 0x7B4BD6, 0xF4A261, 0x2A9D8F, 0xFF7FA6, 0x264653];
      for (var s = 0; s < 4; s++) {
        box(3.4, 0.08, 0.62, 0x9C7350, 0, 0.3 + s * 0.8, -0.55, g);
        var x = -1.6, k = s * 3;
        while (x < 1.5) {
          var w = 0.14 + ((k * 37) % 9) / 60, hh = 0.5 + ((k * 53) % 7) / 30;
          box(w, hh, 0.45, bc[k % bc.length], x + w / 2, 0.34 + s * 0.8 + hh / 2, -0.5, g);
          x += w + 0.02; k++;
        }
      }
      var mag = new THREE.Group(); mag.position.set(1.1, 2.3, 0.6); g.add(mag);
      put(new THREE.TorusGeometry(0.42, 0.07, 12, 40), M(c, { metalness: 0.3 }), 0, 0, 0, mag);
      put(new THREE.CircleGeometry(0.4, 32), new THREE.MeshStandardMaterial({ color: lighten(c, 0.8), transparent: true, opacity: 0.45, roughness: 0.1 }), 0, 0, 0, mag, true);
      put(new THREE.CylinderGeometry(0.07, 0.08, 0.6, 12), M(0x3A2A1C), 0.38, -0.38, 0, mag).rotation.z = Math.PI / 4;
      box(1.0, 1.1, 0.6, 0x9C7350, -1.2, 0.55, 0.9, g);
      var bookT = tex(256, 160, function (x, w, h) { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#C8D2E2'; for (var i = 0; i < 9; i++) { x.fillRect(14, 16 + i * 15, 100, 6); x.fillRect(142, 16 + i * 15, 100, 6); } x.fillStyle = '#FFD166'; x.fillRect(140, 60, 104, 12); });
      put(new THREE.PlaneGeometry(0.9, 0.56), new THREE.MeshStandardMaterial({ map: bookT }), -1.2, 1.13, 0.9, g, true).rotation.x = -Math.PI / 2.6;
      anim.push(function (s) { mag.position.y = 2.3 + Math.sin(s * 1.6) * 0.15; mag.rotation.y = Math.sin(s * 0.8) * 0.6; });
    },
    table: function (g, c) {
      cyl(1.25, 1.25, 0.1, 0xFFF4E6, 0, 1.0, 0, g, 40);
      cyl(0.1, 0.1, 0.95, 0x8B95A8, 0, 0.5, 0, g, 12); cyl(0.5, 0.5, 0.05, 0x8B95A8, 0, 0.03, 0, g, 24);
      chair(0, 1.7, Math.PI, c, g); chair(-1.55, -0.8, Math.PI / 3, lighten(c, 0.35), g); chair(1.55, -0.8, -Math.PI / 3, lighten(c, 0.35), g);
      var s0 = new THREE.Group(); s0.position.set(0, 1.05, -0.1); g.add(s0);
      cyl(0.25, 0.3, 0.08, c, 0, 0.04, 0, s0, 20); cyl(0.04, 0.04, 0.9, c, 0, 0.5, 0, s0, 10);
      var beam = new THREE.Group(); beam.position.y = 0.95; s0.add(beam);
      box(1.3, 0.06, 0.06, c, 0, 0, 0, beam);
      var pans = [-0.62, 0.62].map(function (x) {
        var p = new THREE.Group(); p.position.x = x; beam.add(p);
        cyl(0.01, 0.01, 0.4, 0x8B95A8, 0, -0.2, 0, p, 6);
        cyl(0.28, 0.2, 0.06, 0xFFD166, 0, -0.42, 0, p, 20);
        return p;
      });
      cyl(0.1, 0.1, 0.04, 0xFFC93C, 0, -0.36, 0, pans[0], 16);
      box(0.32, 0.05, 0.44, 0x2B3550, 0.75, 1.08, 0.35, g);
      box(0.5, 0.01, 0.7, 0xFFFFFF, -0.6, 1.06, 0.4, g).rotation.y = 0.3;
      anim.push(function (s) { var a = Math.sin(s * 1.3) * 0.18; beam.rotation.z = a; pans.forEach(function (p) { p.rotation.z = -a; }); });
    },
    board: function (g, c, t) {
      var boardT = tex(1024, 640, function (x, w, h) {
        x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, w, h);
        x.fillStyle = css(c); x.font = 'bold 70px ' + FONT;
        wrapText(x, t.title, 900).slice(0, 2).forEach(function (l, i) { x.fillText(l, 60, 120 + i * 88); });
        x.font = '44px ' + FONT; x.fillStyle = '#1A2B50';
        (t.feats || []).slice(0, 4).forEach(function (s, i) {
          x.strokeStyle = css(c); x.lineWidth = 6; x.strokeRect(70, 290 + i * 80, 44, 44);
          if (i < 2) { x.beginPath(); x.moveTo(78, 312 + i * 80); x.lineTo(92, 328 + i * 80); x.lineTo(118, 290 + i * 80); x.stroke(); }
          x.fillText(s, 140, 328 + i * 80);
        });
        x.fillStyle = '#FFD166'; x.beginPath(); x.arc(860, 470, 90, 0, 7); x.fill();
        x.fillStyle = '#1A2B50'; x.font = 'bold 50px ' + FONT; x.textAlign = 'center'; x.fillText('환영!', 860, 488);
      });
      box(3.4, 2.2, 0.12, lighten(c, 0.5), 0, 2.2, -0.2, g);
      put(new THREE.PlaneGeometry(3.2, 2.0), new THREE.MeshStandardMaterial({ map: boardT }), 0, 2.2, -0.13, g, true);
      box(3.0, 0.08, 0.25, lighten(c, 0.3), 0, 1.06, -0.1, g);
      [-1.4, 1.4].forEach(function (x) { box(0.08, 3.0, 0.08, 0x8B95A8, x, 1.5, -0.3, g); });
      var balloons = [c, 0xFFD166, 0xFF7FA6].map(function (bc, i) {
        var b = put(new THREE.SphereGeometry(0.28, 20, 16), M(bc, { roughness: 0.3 }), 1.9 + i * 0.25, 2.6 + i * 0.3, 0.2 - i * 0.2, g);
        b.scale.y = 1.15; return b;
      });
      plant(-1.9, 0.3, 0.8, g);
      anim.push(function (s) { balloons.forEach(function (b, i) { b.position.y = 2.6 + i * 0.3 + Math.sin(s * 1.4 + i) * 0.12; }); });
    },
    counter: function (g, c, t) {
      box(2.8, 1.1, 0.9, 0xFFFFFF, 0, 0.55, 0, g);
      box(2.8, 0.5, 0.92, c, 0, 0.75, 0.01, g);
      box(3.0, 0.08, 1.0, 0xF7F2EA, 0, 1.12, 0, g);
      var qrT = tex(256, 340, function (x, w, h) {
        x.fillStyle = '#fff'; x.fillRect(0, 0, w, h);
        x.fillStyle = css(c); x.fillRect(0, 0, w, 70); x.fillStyle = '#fff'; x.font = 'bold 30px ' + FONT; x.textAlign = 'center'; x.fillText(t.short || t.title, w / 2, 47);
        x.fillStyle = '#1A2B50';
        for (var y = 0; y < 21; y++) for (var q = 0; q < 21; q++) {
          var fin = (q < 7 && y < 7) || (q > 13 && y < 7) || (q < 7 && y > 13);
          var on = fin ? (q % 7 === 0 || q % 7 === 6 || y % 7 === 0 || y % 7 === 6 || ((q % 7 > 1 && q % 7 < 5) && (y % 7 > 1 && y % 7 < 5))) : ((q * 7 + y * 11 + q * y) % 3 === 0);
          if (on) x.fillRect(23 + q * 10, 92 + y * 10, 10, 10);
        }
      });
      var st = new THREE.Group(); st.position.set(-0.7, 1.16, 0.05); st.rotation.set(-0.12, 0.2, 0); g.add(st);
      box(0.62, 0.82, 0.04, 0xFFFFFF, 0, 0.42, 0, st);
      put(new THREE.PlaneGeometry(0.58, 0.77), new THREE.MeshStandardMaterial({ map: qrT }), 0, 0.42, 0.025, st, true);
      [lighten(c, 0.6), 0xFFE08A, 0xB8E6D1].forEach(function (pc, i) { box(0.36, 0.5, 0.02, pc, 0.35 + i * 0.4, 1.4, 0.15 - i * 0.03, g).rotation.x = -0.25; });
      var heart = new THREE.Group(); heart.position.set(1.1, 2.6, 0); g.add(heart);
      var hs = new THREE.Shape(); hs.moveTo(0, -0.35); hs.bezierCurveTo(-0.6, 0, -0.35, 0.45, 0, 0.18); hs.bezierCurveTo(0.35, 0.45, 0.6, 0, 0, -0.35);
      put(new THREE.ExtrudeGeometry(hs, { depth: 0.15, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 }), M(0xFF4F7B, { roughness: 0.3 }), 0, 0, 0, heart);
      cyl(0.005, 0.005, 1.4, 0xAAAAAA, 0, -0.95, 0.07, heart, 4);
      chair(0, -0.9, 0, c, g);
      anim.push(function (s) { heart.rotation.y = s * 1.2; heart.position.y = 2.6 + Math.sin(s * 1.8) * 0.12; });
    },
    /* 새 도구 기본: 받침대 위 세움 화면(도구 이름·특징) + 떠서 도는 보석 */
    kiosk: function (g, c, t) {
      cyl(0.9, 1.0, 0.18, 0xE3E8F2, 0, 0.09, 0, g, 32);
      box(0.18, 1.5, 0.18, 0x8B95A8, 0, 0.9, -0.1, g);
      var scr = tex(640, 400, function (x, w, h) {
        rr(x, 0, 0, w, h, 30); x.fillStyle = '#fff'; x.fill();
        x.fillStyle = css(c); x.fillRect(0, 0, w, 96);
        x.fillStyle = '#fff'; x.font = 'bold 44px ' + FONT; x.fillText((t.short || t.title).slice(0, 12), 30, 64);
        x.font = '34px ' + FONT;
        (t.feats || []).slice(0, 4).forEach(function (s, i) { x.fillStyle = css(c); x.fillRect(34, 140 + i * 62, 14, 14); x.fillStyle = '#1A2B50'; x.fillText(s.slice(0, 14), 64, 156 + i * 62); });
      });
      box(2.2, 1.45, 0.1, c, 0, 2.15, -0.1, g).rotation.x = -0.12;
      put(new THREE.PlaneGeometry(2.05, 1.3), new THREE.MeshBasicMaterial({ map: scr }), 0, 2.16, -0.04, g, true).rotation.x = -0.12;
      var gem = put(new THREE.OctahedronGeometry(0.32, 0), M(c, { roughness: 0.2, metalness: 0.2, flatShading: true }), 1.35, 2.9, 0.2, g);
      plant(-1.2, 0.3, 0.6, g);
      anim.push(function (s) { gem.rotation.y = s * 1.5; gem.position.y = 2.9 + Math.sin(s * 2) * 0.12; });
    }
  };

  var groups = [];
  ST.forEach(function (s, i) {
    var g = new THREE.Group(); g.position.copy(s.p); g.rotation.y = Math.atan2(s.f.x, s.f.z); g.userData.st = i; scene.add(g); groups.push(g);
    var ring = put(new THREE.RingGeometry(1.9, 2.15, 64), new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.45, side: THREE.DoubleSide }), 0, 0.05, 0, g, true);
    ring.rotation.x = -Math.PI / 2; ring.userData.ring = true;
    (SPOTS[s.t.spot] || SPOTS.kiosk)(g, s.color, s.t);
  });

  /* 굿균: 3D 그림(빌보드). 물건 뒤로 가려지지 않게 언제나 앞에 그림.
     그림은 모두 미리 읽어 두고, 바꿀 때 톡 튀는 효과로 이음. 자리 사이는 사무실 가운데를 거쳐 걸어감(물건을 뚫고 지나가지 않게) */
  var loader = new THREE.TextureLoader(), pics = {};
  var picNames = ['hello', 'walk'];
  ST.forEach(function (s) { if (s.t.pic && picNames.indexOf(s.t.pic) < 0) picNames.push(s.t.pic); });
  var sprMat = new THREE.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false });
  var spr = new THREE.Sprite(sprMat); spr.center.set(0.5, 0.02); spr.renderOrder = 10;
  var guide = new THREE.Group(); scene.add(guide); guide.add(spr);
  var shadow = put(new THREE.CircleGeometry(0.62, 24), new THREE.MeshBasicMaterial({ color: 0x1A2B50, transparent: true, opacity: 0.2, depthWrite: false }), 0, 0.06, 0, guide, true);
  shadow.rotation.x = -Math.PI / 2; shadow.renderOrder = 9;
  var curPic = '', pop = -1e9, SIZE = 2.1;
  spr.visible = false;
  picNames.forEach(function (n) {
    pics[n] = loader.load('img/' + n + '.webp', function (t) { t.encoding = THREE.sRGBEncoding; t.ready = true; if (n === 'hello' && !curPic) { setPic('hello'); spr.visible = true; } },
      undefined, function () { pics[n] = null; });
  });
  function setPic(n) {
    var t = pics[n] && pics[n].ready ? pics[n] : (pics.hello && pics.hello.ready ? pics.hello : null);
    if (!t) return;
    var key = t === pics[n] ? n : 'hello';
    if (key === curPic) return;
    curPic = key; sprMat.map = t; sprMat.needsUpdate = true;
    spr.userData.aspect = t.image.width / t.image.height;
    pop = performance.now();
  }
  guide.position.set(HUB[0], 0, HUB[1]);
  var path = [], seg = null, endPic = 'hello';
  function hubPoint() { return new THREE.Vector3(HUB[0], 0, HUB[1]); }
  function spotPoint(i) { var s = ST[i]; return s.p.clone().add(s.f.clone().multiplyScalar(1.6)).add(s.side.clone().multiplyScalar(2.4)); }
  /* 길 찾기: 곧장 가되, 가는 길에 다른 자리(물건)가 막고 있으면 그 옆으로 비켜 가는 점을 하나씩 끼움 */
  var BLOCK = 2.1;
  function route(a, b, depth) {
    var ab = b.clone().sub(a), len = ab.length(); if (len < 0.01) return [b];
    var dir = ab.clone().divideScalar(len), worst = null;
    ST.forEach(function (s) {
      var ap = s.p.clone().sub(a), u = ap.dot(dir);
      if (u <= 0.3 || u >= len - 0.3) return;
      var near = a.clone().add(dir.clone().multiplyScalar(u)), d = near.distanceTo(s.p);
      if (d < BLOCK && s.p.distanceTo(b) > 0.4 && (!worst || u < worst.u)) worst = { u: u, s: s, near: near, d: d };
    });
    if (!worst || depth > 3) return [b];
    var away = worst.near.clone().sub(worst.s.p); away.y = 0;
    if (away.length() < 0.01) away.set(-dir.z, 0, dir.x);
    var via = worst.s.p.clone().add(away.normalize().multiplyScalar(BLOCK + 0.7));
    via.x = Math.max(-10.8, Math.min(10.8, via.x)); via.z = Math.max(-7.8, Math.min(7.8, via.z));
    return route(a, via, depth + 1).concat(route(via, b, depth + 1));
  }
  function walkTo(target, pic) {
    endPic = pic;
    path = route(guide.position.clone(), target, 0);
    if (reduce) { guide.position.copy(target); path = []; seg = null; setPic(pic); return; }
    nextSeg();
  }
  function nextSeg() {
    var to = path.shift();
    if (!to) { seg = null; setPic(endPic); return; }
    var from = guide.position.clone(), d = from.distanceTo(to);
    if (d < 0.05) { nextSeg(); return; }
    seg = { a: from, b: to, t0: performance.now(), d: Math.max(500, d * 230) };
    setPic('walk');
  }

  /* 이름표·아래 번호 단추 — 목록에서 만듦 */
  var tagBox = document.getElementById('tags'), tags = [], nav = document.getElementById('snav');
  ST.forEach(function (s, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tag3';
    b.innerHTML = '<i style="background:' + css(s.color) + '">' + pad2(i + 1) + '</i>' + (s.t.short || s.t.title);
    b.addEventListener('click', function () { go(i); });
    tagBox.appendChild(b); tags.push(b);
    var n = document.createElement('button'); n.type = 'button'; n.dataset.go = String(i);
    n.textContent = pad2(i + 1) + ' ' + (s.t.navLabel || (s.t.short || s.t.title).split(' ')[0]);
    nav.appendChild(n);
  });

  /* 카메라 */
  var view = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  function narrow() { return stage.clientWidth < 700; }
  function overview() {
    var n = narrow();
    return { pos: new THREE.Vector3(n ? 19 : 9, n ? 24 : 12.5, n ? 3 : 15.5), look: new THREE.Vector3(n ? -1.5 : -1, 0, n ? -0.6 : -1.2) };
  }
  function stationView(i) {
    var s = ST[i], n = narrow();
    var look = new THREE.Vector3(s.p.x, 1.5, s.p.z);
    if (!n) look.add(s.side.clone().multiplyScalar(-1.0)); else look.y = -0.6;   /* 넓은 화면: 설명 창이 오른쪽이라 물건·굿균을 왼쪽에 */
    var pos = look.clone().add(s.f.clone().multiplyScalar(n ? 10.5 : 9.4)).add(new THREE.Vector3(0, n ? 7 : 3.8, 0));
    return { pos: pos, look: look };
  }
  var o = overview(); view.pos.copy(o.pos); view.look.copy(o.look);
  var fly = null, cur = -1, yaw = 0, yawV = 0;
  function flyTo(t, ms) { fly = { a: { pos: view.pos.clone(), look: view.look.clone() }, b: t, t0: performance.now(), d: reduce ? 1 : (ms || 1600) }; }
  function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  var panel = document.getElementById('panel'), pbody = document.getElementById('pbody');
  function mark(i) {
    [].forEach.call(nav.querySelectorAll('button'), function (b) { b.classList.toggle('on', b.dataset.go === String(i)); });
    tags.forEach(function (t, k) { t.classList.toggle('on', k === i); t.classList.toggle('off', i >= 0 && k !== i); });
  }
  function go(i, fromTour) {
    if (!fromTour) stopTour();
    cur = i; yaw = 0; mark(i);
    if (i < 0) {
      flyTo(overview()); panel.classList.remove('on'); stage.classList.remove('focus');
      walkTo(hubPoint(), 'hello'); return;
    }
    flyTo(stationView(i));
    walkTo(spotPoint(i), ST[i].t.pic || 'hello');
    pbody.innerHTML = '';
    if (cards[i]) {
      var c = cards[i].cloneNode(true); c.classList.remove('dim'); pbody.appendChild(c);
      c.querySelectorAll('.copy').forEach(function (b) { b.addEventListener('click', function () { var orig = document.querySelector('#grid .copy[data-u="' + b.dataset.u + '"]'); if (orig) orig.click(); }); });
    }
    panel.classList.add('on'); panel.scrollTop = 0; stage.classList.add('focus');
  }
  document.getElementById('px').addEventListener('click', function () { go(-1); });
  nav.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.go === 'tour') toggleTour(); else go(+b.dataset.go); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur >= 0) go(-1); });

  /* 둘러보기: 자리를 차례로 */
  var tourT = null, tourBtn = nav.querySelector('[data-go="tour"]');
  function toggleTour() { if (tourT) { stopTour(); return; } tourBtn.textContent = '❚❚ 멈추기'; go(cur < 0 ? 0 : (cur + 1) % ST.length, true); tourT = setInterval(function () { go((cur + 1) % ST.length, true); }, 5600); }
  function stopTour() { if (tourT) { clearInterval(tourT); tourT = null; tourBtn.textContent = '▶ 둘러보기'; } }

  /* 끌어서 돌리기·누르기 */
  var ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), down = null, hot = -1, jump = -1e9;
  function pick(e) {
    var r = cv.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, cam);
    if (spr.visible && ray.intersectObject(spr)[0]) return -2;
    var hit = ray.intersectObjects(groups, true)[0];
    if (!hit) return -1;
    var ob = hit.object; while (ob && ob.userData.st === undefined) ob = ob.parent;
    return ob ? ob.userData.st : -1;
  }
  cv.addEventListener('pointerdown', function (e) { down = { x: e.clientX, yaw: yaw, moved: false }; });
  window.addEventListener('pointermove', function (e) {
    if (down) {
      var dx = e.clientX - down.x; if (Math.abs(dx) > 6) down.moved = true;
      if (down.moved && e.pointerType === 'mouse') { yaw = Math.max(-0.7, Math.min(0.7, down.yaw - dx / 400)); stopTour(); }
      return;
    }
    if (e.target !== cv) return;
    var h = pick(e); if (h !== hot) { hot = h; cv.classList.toggle('hot', h >= 0 || h === -2); }
  });
  window.addEventListener('pointerup', function (e) {
    if (down && !down.moved && e.target === cv) { var h = pick(e); if (h >= 0) go(h); else if (h === -2 && !seg) jump = performance.now(); }
    down = null;
  });

  function size() {
    var w = stage.clientWidth, h = stage.clientHeight;
    R.setSize(w, h, false); cam.aspect = w / h; cam.fov = w < 700 ? 58 : 42; cam.updateProjectionMatrix();
    if (!fly) { var t = cur < 0 ? overview() : stationView(cur); view.pos.copy(t.pos); view.look.copy(t.look); }
  }
  window.addEventListener('resize', size); size();

  var v = new THREE.Vector3(), visible = true, t0 = performance.now();
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(stage);
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    var t = (now - t0) / 1000;
    if (fly) {
      var k = Math.min(1, (now - fly.t0) / fly.d), e = ease(k);
      view.pos.lerpVectors(fly.a.pos, fly.b.pos, e); view.look.lerpVectors(fly.a.look, fly.b.look, e);
      if (k >= 1) fly = null;
    }
    yawV += (yaw - yawV) * 0.12;
    var off = view.pos.clone().sub(view.look); off.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawV);
    cam.position.copy(view.look).add(off); cam.position.y += reduce ? 0 : Math.sin(t * 0.5) * 0.08; cam.lookAt(view.look);

    /* 굿균 걷기·튀기 */
    var hop = 0;
    if (seg) {
      var q = Math.min(1, (now - seg.t0) / seg.d);
      guide.position.lerpVectors(seg.a, seg.b, q * q * (3 - 2 * q));
      hop = Math.abs(Math.sin((now - seg.t0) / 1000 * Math.PI * 3.2)) * 0.22;
      if (q >= 1) nextSeg();
    } else {
      var j = (now - jump) / 650;
      hop = j < 1 ? Math.sin(j * Math.PI) * 1.0 : (reduce ? 0 : Math.abs(Math.sin(t * 2.2)) * 0.07);
    }
    spr.position.y = hop;
    var pp = Math.min(1, (now - pop) / 280), ps = (reduce || pp >= 1) ? 1 : 0.8 + 0.2 * pp + Math.sin(pp * Math.PI) * 0.12;
    var a = spr.userData.aspect || 1;
    spr.scale.set(SIZE * a * ps, SIZE * ps, 1);
    shadow.scale.setScalar(1 - hop * 0.35);

    hand.rotation.z = -t * 0.4;
    groups.forEach(function (g, i) {
      var r = g.children[0];
      if (r.userData.ring) { var on = i === cur || i === hot; r.material.opacity = on ? 0.85 : 0.35 + Math.sin(t * 2 + i) * 0.12; r.scale.setScalar(on ? 1.06 : 1); }
    });
    if (!reduce) anim.forEach(function (f) { f(t); });

    var w = stage.clientWidth, h = stage.clientHeight;
    ST.forEach(function (s, i) {
      var top = { shelf: 3.9, board: 3.7, kiosk: 3.6 }[s.t.spot] || 3.2;
      v.set(s.p.x, top, s.p.z).project(cam);
      var tg = tags[i];
      if (v.z > 1) { tg.style.display = 'none'; return; }
      tg.style.display = ''; tg.style.left = ((v.x + 1) / 2 * w) + 'px'; tg.style.top = ((1 - v.y) / 2 * h) + 'px';
    });
    R.render(scene, cam);
  }
  requestAnimationFrame(frame);
  /* 주소 끝 #s1~#s8 → 그 자리에서 시작(특정 도구만 안내할 때) */
  var hm = location.hash.match(/^#s(\d)$/);
  if (hm && +hm[1] >= 1 && +hm[1] <= ST.length) setTimeout(function () { go(+hm[1] - 1); }, 400);
  window._office = { go: go, route: route, spotPoint: spotPoint, ST: ST };
})();
