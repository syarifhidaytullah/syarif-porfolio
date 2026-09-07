async function loadProjects(){
  try{
    const res = await fetch('data/projects.json');
    if(!res.ok) throw new Error('fetch fail');
    return await res.json();
  }catch(e){
    // fallback inline if fetch fails (file://)
    return window.__PROJECTS__ || [];
  }
}
function cardHTML(p){
  const tools = p.tools.map(t=>`<span>${t}</span>`).join('');
  const demoBtn = p.demo ? `<a class="ghost" href="${p.demo}" target="_blank" rel="noopener">Live Demo</a>` : ``;
  return `<article class="p-card" data-category="${p.category}">
    <div class="p-thumb">
      <img src="${p.thumb}" alt="${p.title}" loading="lazy">
      <span class="p-cat">${p.category}</span>
    </div>
    <div class="p-body">
      <h3>${p.title}</h3>
      <p>${p.oneLiner}</p>
      <div class="p-tags">${tools}</div>
      <div class="p-actions">
        <a class="primary" href="projects/${p.slug}.html">Studi Kasus &rarr;</a>
        <a class="ghost" href="${p.github}" target="_blank" rel="noopener">GitHub</a>
        ${demoBtn}
      </div>
    </div>
  </article>`;
}
async function render(filter='all'){
  const grid = document.getElementById('projectGrid');
  if(!grid) return;
  const projects = await loadProjects();
  const filtered = filter==='all' ? projects : projects.filter(p=>p.category===filter);
  grid.innerHTML = filtered.map(cardHTML).join('') || '<p style="color:var(--muted)">Tidak ada proyek di kategori ini.</p>';
}
// filter
document.addEventListener('DOMContentLoaded', async ()=>{
  await render('all');
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });
  // hamburger
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if(ham) ham.addEventListener('click', ()=> links.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a=> a.addEventListener('click', ()=> links.classList.remove('open')));
  // active nav on scroll
  const sections = ['home','about','projects','skills','contact'].map(id=>document.getElementById(id)).filter(Boolean);
  const navAs = document.querySelectorAll('.nav-links a');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        navAs.forEach(a=> a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id));
      }
    });
  },{rootMargin:'-50% 0px -50% 0px',threshold:0});
  sections.forEach(s=>obs.observe(s));
  // contact form -> mailto
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name'), email=fd.get('email'), msg=fd.get('message');
      const subject = encodeURIComponent(`Portfolio inquiry dari ${name}`);
      const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${msg}`);
      window.location.href = `mailto:syarif.hidayatullah.analyst@gmail.com?subject=${subject}&body=${body}`;
      const note = document.getElementById('formNote');
      if(note) note.textContent = 'Membuka email client... Jika tidak terbuka, hubungi via GitHub atau Fastwork.';
      const btn = document.getElementById('formBtn');
      if(btn){ btn.textContent='✓ Siap kirim via email'; setTimeout(()=>btn.textContent='Kirim Pesan →',2500);}
    });
  }
});
