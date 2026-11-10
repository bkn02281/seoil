(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 첫 화면 장식 등장
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('is-ready'), 120));

  // 첫 화면 제목 타이핑 → 끝나면 나머지 표지 글자가 천천히 나타남
  const h1 = document.querySelector('.cover h1[data-type]');
  const coverBits = document.querySelectorAll('.cover .cv');
  const showCover = () => coverBits.forEach((el, i) => setTimeout(() => el.classList.add('is-on'), i * 160));
  if (h1) {
    const lines = [...h1.querySelectorAll(':scope > span')];
    const full = lines.map((l) => l.textContent);
    h1.setAttribute('aria-label', full.join(' '));
    if (reduce) {
      showCover();
    } else {
      const outs = lines.map((l, i) => {
        l.setAttribute('aria-hidden', 'true');
        l.textContent = '';
        const box = document.createElement('i'); box.className = 'ty-box';
        const ghost = document.createElement('i'); ghost.className = 'ty-ghost'; ghost.textContent = full[i];
        const live = document.createElement('i'); live.className = 'ty-live';
        box.append(ghost, live); l.append(box);
        return live;
      });
      const SPEED = 46, JITTER = 30, LINE_GAP = 220, START = 400;
      let li = 0, ci = 0;
      const tick = () => {
        if (li >= full.length) {
          outs[outs.length - 1].classList.remove('is-typing');
          h1.classList.add('ty-done');
          showCover();
          return;
        }
        outs.forEach((o, i) => o.classList.toggle('is-typing', i === li));
        if (ci < full[li].length) {
          outs[li].textContent = full[li].slice(0, ++ci);
          setTimeout(tick, SPEED + Math.random() * JITTER);
        } else {
          li++; ci = 0;
          setTimeout(tick, LINE_GAP);
        }
      };
      setTimeout(tick, START);
    }
  } else {
    showCover();
  }

  // 상단 바: 스크롤하면 반투명 흰 배경
  const gnb = document.querySelector('.gnb');
  const onScroll = () => gnb && gnb.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // 스크롤 등장
  const rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    rvs.forEach((el) => io.observe(el));
  } else {
    rvs.forEach((el) => el.classList.add('is-in'));
  }

  // 현재 섹션 메뉴 표시
  const links = [...document.querySelectorAll('.gnb-menu a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (targets.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((t) => so.observe(t));
  }

  // 작업 필터
  const filter = document.querySelector('.filter');
  if (filter) {
    const cards = [...document.querySelectorAll('.pcard[data-cat]')];
    filter.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button[data-filter]');
      if (!btn) return;
      const f = btn.dataset.filter;
      filter.querySelectorAll('button').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.cat === f); });
    });
  }
})();
