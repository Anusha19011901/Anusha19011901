/* ============================================================
   ANUSHA SESHADRI — shared behaviour
   cursor · reveal · terminal drawer · konami · copy-email · form
   ============================================================ */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EMAIL = 'anushaseshadri1901@gmail.com';

  /* ── reveal ───────────────────────────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach(el => io.observe(el));

  /* ── cursor ───────────────────────────────────────────────── */
  if (fine && !reduced) {
    const cur = document.createElement('div');
    cur.className = 'cursor';
    cur.innerHTML = '<span class="cursor__label"></span>';
    const label = cur.firstElementChild;
    document.body.appendChild(cur);
    document.body.classList.add('has-cursor');
    addEventListener('mousemove', e => {
      cur.style.opacity = '1';
      cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('a, button, [data-cursor], input, textarea');
      cur.classList.remove('is-link', 'is-text', 'has-label');
      if (!t) return;
      if (t.matches('input, textarea')) { cur.classList.add('is-text'); return; }
      cur.classList.add('is-link');
      const txt = t.dataset.cursor || '';
      if (txt) { label.textContent = txt; cur.classList.add('has-label'); }
    });
    document.addEventListener('mouseleave', () => cur.style.opacity = '0');
    document.addEventListener('mouseenter', () => cur.style.opacity = '1');
  }

  /* ── toast + achievement ──────────────────────────────────── */
  function toast(text) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }
  function achievement(title, sub) {
    const a = document.createElement('div');
    a.className = 'achv';
    a.innerHTML = `<div class="achv__icon">★</div><div><div class="achv__k">Achievement unlocked</div><div class="achv__t"></div><div class="achv__s"></div></div>`;
    a.querySelector('.achv__t').textContent = title;
    a.querySelector('.achv__s').textContent = sub;
    document.body.appendChild(a);
    setTimeout(() => a.remove(), 4500);
  }

  /* ── copy email ───────────────────────────────────────────── */
  $$('[data-copy-email]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    toast('copied');
  }));

  /* ── contact form → mailto ────────────────────────────────── */
  const form = $('#contact-form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const subject = encodeURIComponent(`Message from ${f.get('name') || 'portfolio visitor'}`);
    const body = encodeURIComponent(`${f.get('message') || ''}\n\n— ${f.get('name') || ''} (${f.get('email') || ''})`);
    const btn = form.querySelector('button[type="submit"]');
    location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    btn.textContent = 'Opened your mail app';
    setTimeout(() => { btn.textContent = 'Send'; }, 3000);
  });

  /* ── konami ───────────────────────────────────────────────── */
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let ki = 0;
  document.addEventListener('keydown', e => {
    ki = e.key === seq[ki] ? ki + 1 : (e.key === seq[0] ? 1 : 0);
    if (ki === seq.length) { ki = 0; achievement('You know the Konami code', '↑↑↓↓←→←→BA — a timeless classic'); }
  });

  /* ── console ──────────────────────────────────────────────── */
  console.log('%c ANUSHA SESHADRI ', 'font-size:20px;color:#f3efe6;background:#d5281b;padding:6px 14px;font-weight:900;');
  console.log('%c Hello — curious minds are welcome here.\n → github.com/Anusha19011901\n → press ` anywhere for the terminal', 'font-size:12px;color:#6f6a62;line-height:1.8;');

  /* ============================================================
     Terminal drawer
     ============================================================ */
  const term = document.createElement('div');
  term.className = 'term';
  term.setAttribute('role', 'dialog');
  term.setAttribute('aria-label', 'terminal');
  term.innerHTML = `
    <div class="term__bar">
      <span><b>terminal</b>anusha@portfolio ~</span>
      <button class="term__close" type="button">ESC · close</button>
    </div>
    <div class="term__out" id="term-out"><p class="hint">type help to see available commands · press \` to toggle</p></div>
    <form class="term__in" id="term-form" autocomplete="off">
      <span class="prompt">$</span>
      <input id="term-input" type="text" placeholder="type a command…" spellcheck="false" aria-label="command"/>
    </form>`;
  document.body.appendChild(term);
  const out = $('#term-out'), input = $('#term-input');
  const RED = '#d5281b', PAPER = '#efe9dc', MUTE = '#8a8479', DIM = '#55514a';
  let hintIdx = 0, cmdCount = 0, booted = false;

  function print(lines) {
    if (!lines) return;
    lines.forEach(l => {
      const p = document.createElement('p');
      p.style.color = l.color || '#cfc8b8';
      p.textContent = l.text;
      out.appendChild(p);
    });
    out.scrollTop = out.scrollHeight;
  }

  const commands = {
    help: () => [
      { text: 'available commands:', color: RED },
      { text: '  whoami       → who am i' },
      { text: '  projects     → selected work' },
      { text: '  skills       → core competencies' },
      { text: '  status       → what i am doing now' },
      { text: '  hobbies      → life outside the terminal' },
      { text: '  fun          → something light' },
      { text: '  contact      → how to reach me' },
      { text: '  resume       → the plain version' },
      { text: '  clear        → clean slate' },
      { text: '  hint         → psst...', color: DIM },
    ],
    whoami: () => [
      { text: 'anusha seshadri', color: RED },
      { text: 'AI engineer · data scientist' },
      { text: 'currently: AI Engineer @ Digestive Disease Care, NYC' },
      { text: 'previously: RIT (NGAFID research), Tata Elxsi, SmartBridge' },
      { text: 'MS Data Science, Rochester Institute of Technology' },
    ],
    projects: () => [
      { text: 'selected work', color: RED },
      { text: '  01  Predictive Anomaly Detection in NGAFID   (deep learning research)' },
      { text: '  02  shadow360                                 (healthcare platform, DDC)' },
      { text: '  03  Kyron Medical                             (AI scheduling — chat + voice)' },
      { text: '  04  YogiSync                                  (real-time computer vision)' },
      { text: '  05  MendPath                                  (generative AI health app)' },
      { text: '  06  EnterpriseDesk AI                         (agentic IT helpdesk, ServiceNow)' },
      { text: '  07  SolAI                                     (enterprise conversational agent)' },
      { text: '  08  Retail Inventory & Demand Analytics       (data engineering)' },
      { text: '  09  Analyzing the Quality of Agentic Code     (MSR 2026 study)' },
      { text: '  10  Quantum Kernel SVM                        (Qiskit)' },
      { text: '  11  Grover\'s Search                           (Qiskit)' },
      { text: '  12  BB84 Quantum Key Distribution             (Qiskit)' },
      { text: '  --  Granted patent · Indian Patent No. 601763 · 2 publications' },
      { text: '→ patent.html', color: MUTE },
      { text: '→ projects.html', color: MUTE },
    ],
    skills: () => [
      { text: 'core competencies:', color: RED },
      { text: '  ████████████  deep learning / PyTorch / CUDA' },
      { text: '  ███████████░  generative AI / LLMs / RAG' },
      { text: '  ███████████░  computer vision / MediaPipe / OpenCV' },
      { text: '  ██████████░░  healthcare data / HL7 FHIR / claims analytics' },
      { text: '  █████████░░░  infrastructure / Docker / AWS / Spark' },
    ],
    status: () => [
      { text: 'now:', color: RED },
      { text: '  leading the AI & data science function at Digestive Disease Care' },
      { text: '  denial prediction · insurance verification · FHIR interoperability' },
      { text: 'open to research collaborations, speaking, and good conversations', color: MUTE },
      { text: `→ ${EMAIL}` },
    ],
    hobbies: () => [
      { text: 'outside the terminal:', color: RED },
      { text: '  music (always)' },
      { text: '  theatre & public speaking' },
      { text: '  reading (mostly late)' },
      { text: '  thrifting' },
      { text: '  learning ASL storytelling' },
      { text: '  occasional writing' },
    ],
    fun: () => {
      const jokes = [
        ['why do ML engineers make great chefs?', 'they know how to batch things.'],
        ['a SQL query walks into a bar...', '...walks up to two tables and asks "can i join you?"'],
        ['why did the neural net break up with backprop?', 'too many vanishing gradients.'],
        ['my model has 94% accuracy.', 'the other 6% is a "creative interpretation".'],
      ];
      const p = jokes[Math.floor(Math.random() * jokes.length)];
      return [{ text: p[0], color: RED }, { text: p[1] }];
    },
    contact: () => [
      { text: 'reach me at:', color: RED },
      { text: `  email     → ${EMAIL}` },
      { text: '  github    → github.com/Anusha19011901' },
      { text: '  linkedin  → linkedin.com/in/anusha-seshadri-9021a3215' },
    ],
    resume: () => { setTimeout(() => location.href = 'resume.html', 500); return [{ text: 'loading the plain version…', color: MUTE }]; },
    hint: () => {
      const hints = [
        [{ text: 'hint 1/7:', color: RED }, { text: 'there\'s a filesystem around here somewhere.' }],
        [{ text: 'hint 2/7:', color: RED }, { text: 'the developer runs on caffeine. ask the machine what it runs on.' }],
        [{ text: 'hint 3/7:', color: RED }, { text: 'every repo tells a story. what does this one\'s history look like?' }],
        [{ text: 'hint 4/7:', color: RED }, { text: 'one of the files here is encrypted. allegedly.' }],
        [{ text: 'hint 5/7:', color: RED }, { text: 'what does the matrix look like from the inside?' }],
        [{ text: 'hint 6/7:', color: RED }, { text: 'sudo. you know you want to.' }],
        [{ text: 'hint 7/7:', color: RED }, { text: 'the answer to all of this is probably 42.' }],
      ];
      const lines = hints[hintIdx % hints.length]; hintIdx++;
      return [...lines, { text: `(type hint again for the next one — ${hints.length - (hintIdx % hints.length)} remaining)`, color: DIM }];
    },
    // ── secret commands ──────────────────────────────────────
    ls: () => [
      { text: '~/anusha', color: RED },
      { text: '  projects/            (12 items)' },
      { text: '  resume.pdf           (please read)' },
      { text: '  secrets.txt          (encrypted... maybe)' },
      { text: '  coffee_count.txt     (too large to display)' },
      { text: '  brain.py             (overtrained, low validation loss)' },
      { text: '  todo.txt' },
    ],
    'cat secrets.txt': () => [
      { text: 'decrypting...', color: RED },
      { text: '----------------------------' },
      { text: 'secret 1: i debug with print() and feel no shame.' },
      { text: 'secret 2: my first model had 0.51 accuracy. i named it "coin flip v1".' },
      { text: 'secret 3: i have a playlist called "coding but make it cottagecore".' },
      { text: '----------------------------', color: DIM },
    ],
    'cat todo.txt': () => [
      { text: 'todo.txt', color: RED },
      { text: '  [x] build useful things' },
      { text: '  [x] make this terminal' },
      { text: '  [ ] sleep more' },
      { text: '  [ ] close some of the 47 browser tabs' },
    ],
    sudo: () => [
      { text: 'sudo: permission denied', color: RED },
      { text: 'this incident has been reported to: nobody' },
      { text: 'try: sudo make me a sandwich', color: DIM },
    ],
    'sudo make me a sandwich': () => [{ text: 'okay.', color: RED }, { text: '🥪' }, { text: '(xkcd 149)' }],
    42: () => [
      { text: '42', color: RED },
      { text: 'the answer to life, the universe, and everything.' },
      { text: 'the question remains unclear, as always.', color: MUTE },
    ],
    coffee: () => [
      { text: 'brewing...', color: RED }, { text: '' },
      { text: '        )  )  )' }, { text: '       (  (  (' }, { text: '      __)____)_' },
      { text: '   .-\'---------|  |' }, { text: '  ( C|/\\/\\/\\/\\/|  |' }, { text: '   \'-./\\/\\/\\/\\/|  |' },
      { text: '     \'_______\'  |' }, { text: '      \'-------\'' }, { text: '' },
      { text: 'fuel loaded.', color: RED },
    ],
    'git log': () => [
      { text: 'commit a3f9c12  HEAD -> main', color: RED },
      { text: `Author: Anusha Seshadri <${EMAIL}>` },
      { text: 'Date:   right now' },
      { text: '    finally fixed that one bug' }, { text: '' },
      { text: 'commit b2e1094' }, { text: '    added feature, broke two others, shipped anyway' }, { text: '' },
      { text: 'commit c0ffee00' }, { text: '    wip: does not work but the vibes are immaculate' }, { text: '' },
      { text: 'commit deadc0de' }, { text: '    initial commit (the hopeful era)' },
    ],
    'git blame': () => [
      { text: 'blame report:', color: RED },
      { text: '  100% of bugs traced back to: coffee deficit' },
      { text: '  recommended fix: more coffee, fewer meetings' },
    ],
    matrix: () => {
      const rows = Array.from({ length: 5 }, () => Array.from({ length: 28 }, () => Math.round(Math.random())).join(' '));
      return [{ text: 'entering the matrix...', color: RED }, ...rows.map(r => ({ text: r, color: PAPER })), { text: 'you took the red pill.', color: MUTE }];
    },
    python: () => [
      { text: 'Python 3.12.0 (main) — AnushaOS build', color: RED },
      { text: 'Type "help", "copyright", or just vibe.' },
      { text: '>>> import torch' },
      { text: '>>> model = torch.nn.Linear(1, 1)  # humble beginnings' },
      { text: '>>> print("hello world")' }, { text: 'hello world' },
      { text: '>>> exit()', color: DIM },
    ],
    uname: () => [
      { text: 'AnushaOS v2026.9 LTS', color: RED },
      { text: 'Kernel: caffeine-6.2.0-lts' },
      { text: 'Arch: overthinking-x64' },
      { text: 'Memory: 16GB RAM + infinite browser tabs' },
      { text: 'Uptime: running since undergrad, no reboot in sight', color: MUTE },
    ],
    vim: () => {
      setTimeout(() => print([{ text: '  (to exit, type :q!)', color: MUTE }]), 2000);
      return [
        { text: '-- INSERT MODE --', color: RED }, { text: '' },
        { text: '  brain.py  [Modified]' }, { text: '  ~~~' }, { text: '  ~~~  # TODO: figure out life' }, { text: '  ~~~' },
        { text: '  "brain.py" 847L, 29103C' },
      ];
    },
    ':q!': () => [{ text: 'escaped vim. you are one of the few.', color: RED }],
    hello: () => [{ text: 'hello.', color: RED }, { text: 'glad you stopped by. type help to look around.' }],
    hi: () => commands.hello(),
    date: () => [
      { text: new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }), color: RED },
      { text: 'another day, another gradient descent.' },
    ],
    rickroll: () => {
      setTimeout(() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'), 400);
      return [{ text: 'never gonna give you up...', color: RED }, { text: '(you\'ve been rickrolled. classic.)', color: DIM }];
    },
    clear: () => { out.innerHTML = '<p class="hint">type help to see available commands</p>'; return null; },
    exit: () => { closeTerm(); return null; },
    close: () => commands.exit(),
  };

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    const echo = document.createElement('p');
    echo.style.color = PAPER; echo.style.marginTop = '8px';
    echo.textContent = `$ ${raw}`;
    out.appendChild(echo);
    if (!cmd) return;
    if (commands[cmd]) { print(commands[cmd]()); }
    else {
      const unixLike = ['pwd','grep','find','mkdir','touch','echo','curl','wget','ssh','cd','cp','mv','man','top','ps','kill','chmod','env','which','alias','rm'].includes(cmd.split(' ')[0]);
      print([{ text: `command not found: ${cmd}${unixLike ? ' — unix-y, i like it. try hint' : ' — try help'}`, color: RED }]);
    }
    if (++cmdCount === 3) setTimeout(() => print([{ text: 'psst: type hint for clues', color: DIM }]), 600);
    out.scrollTop = out.scrollHeight;
  }

  function boot() {
    if (booted) return; booted = true;
    const h = new Date().getHours();
    const g = h < 5 ? 'burning the midnight oil?' : h < 12 ? 'good morning' : h < 17 ? 'good afternoon' : h < 21 ? 'good evening' : 'still up?';
    print([{ text: 'anusha@portfolio', color: RED }, { text: g, color: MUTE }, { text: 'type help to get started', color: MUTE }]);
  }
  function openTerm() { term.classList.add('open'); boot(); setTimeout(() => input.focus(), 200); }
  function closeTerm() { term.classList.remove('open'); input.blur(); }
  function toggleTerm() { term.classList.contains('open') ? closeTerm() : openTerm(); }

  $('#term-form').addEventListener('submit', e => { e.preventDefault(); run(input.value); input.value = ''; });
  $('.term__close', term).addEventListener('click', closeTerm);
  $$('[data-term]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); toggleTerm(); }));
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName) && document.activeElement !== input;
    if (e.key === '`' && !typing) { e.preventDefault(); toggleTerm(); }
    if (e.key === 'Escape' && term.classList.contains('open')) closeTerm();
  });
  if (location.hash === '#terminal') openTerm();
})();
