/* Unmild Agent site interactions */
(function(){
  // ---- NAV TOGGLE
  const toggle = document.getElementById('navToggle');
  const header = document.getElementById('header');
  if(toggle && header){
    toggle.addEventListener('click', ()=>{
      const open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    header.querySelectorAll('.nav-mobile a').forEach(a=>{
      a.addEventListener('click', ()=> header.classList.remove('open'));
    });
  }

  // ---- FAQ
  document.querySelectorAll('.faq-item .faq-q').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>{
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded','false');
        const ic=i.querySelector('.faq-icon'); if(ic) ic.textContent='+';
      });
      if(!wasOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        const ic=item.querySelector('.faq-icon'); if(ic) ic.textContent='−';
      }
    });
  });

  // ---- GALLERY masonry
  const galleryData = [
    {file:'Screenshot (452).png', label:'Configuration modal — API key, base URL, Test Connection', alt:'Configuration modal with Test Connection button and API key field'},
    {file:'Screenshot (453).png', label:'New Project modal — working folder picker', alt:'New Project dialog showing working folder selection'},
    {file:'Screenshot (454).png', label:'Composer bar — Attach / Model / Effort / Permissions', alt:'Input bar with Attach, Model, Effort and Permissions popovers'},
    {file:'Screenshot (455).png', label:'Permission mode popover', alt:'Permission mode selector: Ask first, Auto-edit, Full access'},
    {file:'Screenshot (456).png', label:'Connectors (Sanyojak) panel', alt:'Connectors panel listing external app integrations'},
    {file:'Screenshot (457).png', label:'Customize — Colors theme editor', alt:'Theme customization panel showing color tokens'},
    {file:'Screenshot (458).png', label:'Customize — Key bindings', alt:'Keyboard shortcut customization panel'},
    {file:'Screenshot (459).png', label:'Theme editor detail', alt:'Theme colors live editor detail view'},
    {file:'Screenshot (460).png', label:'Model picker — searchable, hundreds of models', alt:'Model picker dropdown with search filtering models'},
    {file:'Screenshot (461).png', label:'Main window — sidebar, chat, input bar', alt:'Unmild Agent main window with project sidebar and chat transcript'},
    {file:'Screenshot (462).png', label:'Permission approval modal', alt:'Permission modal asking to approve file edit or command'},
    {file:'Screenshot (463).png', label:'Chat transcript — file changes & timing', alt:'Chat view showing assistant reply with file change summary and elapsed time'},
    {file:'Screenshot (464).png', label:'File change summary detail', alt:'Detail of file change summary with added and removed lines'},
    {file:'Screenshot (465).png', label:'Browser panel', alt:'Embedded browser panel showing web content'},
    {file:'Screenshot (466).png', label:'Settings surface', alt:'Settings panel view'},
    {file:'Screenshot (467).png', label:'Terminal integration', alt:'Terminal panel with command output'},
    {file:'Screenshot (468).png', label:'Terminal panel — PowerShell output', alt:'Terminal panel showing PowerShell command output'},
    {file:'Screenshot (469).png', label:'Sidebar — projects & navigation', alt:'Sidebar showing project list and navigation'},
    {file:'Screenshot (470).png', label:'Welcome hero — Unmild Agent mark', alt:'Welcome screen with Unmild Agent logo and tagline'},
    {file:'Screenshot (471).png', label:'Welcome & getting started', alt:'Welcome hero detail with start instructions'},
  ];

  const masonry = document.getElementById('masonry');
  if(masonry){
    masonry.innerHTML = '';
    galleryData.forEach((g,i)=>{
      const el = document.createElement('div');
      el.className = 'masonry-item';
      el.dataset.index = String(i);
      el.innerHTML = `
        <img src="assets/images/${g.file}" alt="${g.alt}" loading="lazy" width="600" height="400">
        <div class="masonry-cap"><strong>${g.label}</strong><span>${String(i+1).padStart(2,'0')} / 20</span></div>
      `;
      el.addEventListener('click', ()=> openLb(i));
      masonry.appendChild(el);
    });
  }

  // ---- LIGHTBOX
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let cur = 0;

  function openLb(i){
    cur = i;
    const g = galleryData[cur];
    if(!lb || !lbImg || !lbCap) return;
    lbImg.src = `assets/images/${g.file}`;
    lbImg.alt = g.alt;
    lbCap.textContent = `${g.label} — ${g.alt}`;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeLb(){
    if(!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  function nav(dir){
    cur = (cur + dir + galleryData.length) % galleryData.length;
    const g = galleryData[cur];
    lbImg.src = `assets/images/${g.file}`;
    lbImg.alt = g.alt;
    lbCap.textContent = `${g.label} — ${g.alt}`;
  }
  if(lbClose) lbClose.addEventListener('click', closeLb);
  if(lbPrev) lbPrev.addEventListener('click', ()=> nav(-1));
  if(lbNext) lbNext.addEventListener('click', ()=> nav(1));
  if(lb) lb.addEventListener('click', (e)=>{ if(e.target===lb) closeLb(); });
  document.addEventListener('keydown', (e)=>{
    if(!lb || !lb.classList.contains('open')) return;
    if(e.key==='Escape') closeLb();
    if(e.key==='ArrowLeft') nav(-1);
    if(e.key==='ArrowRight') nav(1);
  });

  // ---- HEADER: fixed + scrolled state (locked navbar)
  const hdr = document.querySelector('.site-header');
  let ticking=false;
  function syncHeader(){
    if(!hdr) return;
    if(window.scrollY>8) hdr.classList.add('scrolled');
    else hdr.classList.remove('scrolled');
  }
  syncHeader();
  window.addEventListener('scroll', ()=>{
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(function(){ syncHeader(); ticking=false; });
  }, {passive:true});

  // ---- COPY helper for code blocks (optional)
  document.querySelectorAll('pre').forEach(pre=>{
    pre.style.cursor='pointer';
    pre.title='Click to copy';
    pre.addEventListener('click', ()=>{
      const t = pre.innerText;
      navigator.clipboard.writeText(t).then(()=>{
        pre.style.background='#1e1e1e';
        setTimeout(function(){ pre.style.background='#111'; }, 300);
      }).catch(function(){});
    });
  });
})();
