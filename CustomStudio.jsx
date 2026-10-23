import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, ExternalLink, Settings2, Download, X, Pencil } from 'lucide-react';
import Reveal from './Reveal';

const SEED = [
  { id: 'seed-work', type: 'work', title: 'Graphic Design Work', description: 'Banners, footers, profile graphics and visual identity pieces.', url: '#', tag: 'Design' },
  { id: 'seed-server', type: 'server', title: 'Frenkins Roleplay', description: 'Multi-platform roleplay community and ongoing creative/technical work.', url: 'https://dsc.gg/wlfsrp', tag: 'Community' },
  { id: 'seed-project', type: 'project', title: 'Frenkins CAD', description: 'A roleplay dispatch platform concept with radio and unit workflows.', url: '#', tag: 'In progress' },
];

const readInitial = () => {
  try {
    const saved = localStorage.getItem('gaibe-portfolio-studio-v1');
    return saved ? JSON.parse(saved) : { headline: 'Graphic Designer & Developer', bio: 'I create clean visuals, community brands, Discord systems and web experiences. This portfolio is a living collection of the work and communities I help build.', items: SEED };
  } catch { return { headline: 'Graphic Designer & Developer', bio: 'I create clean visuals, community brands, Discord systems and web experiences.', items: SEED }; }
};

const typeLabel = (type) => ({ work: 'Design work', server: 'Server / Community', project: 'Project' }[type] || type);

export default function CustomStudio() {
  const [data, setData] = useState(readInitial);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ type: 'project', title: '', description: '', url: '', tag: '' });
  const [filter, setFilter] = useState('all');
  useEffect(() => { localStorage.setItem('gaibe-portfolio-studio-v1', JSON.stringify(data)); }, [data]);
  const visible = useMemo(() => data.items.filter((item) => filter === 'all' || item.type === filter), [data, filter]);
  const update = (key, value) => setData((old) => ({ ...old, [key]: value }));
  const addItem = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setData((old) => ({ ...old, items: [{ ...form, id: `${Date.now()}`, title: form.title.trim(), url: form.url.trim() || '#', description: form.description.trim() || 'Details coming soon.' }, ...old.items] }));
    setForm({ type: 'project', title: '', description: '', url: '', tag: '' });
  };
  const remove = (id) => setData((old) => ({ ...old, items: old.items.filter((item) => item.id !== id) }));
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'gaibe-portfolio-content.json'; a.click(); URL.revokeObjectURL(url);
  };
  const importData = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { const parsed = JSON.parse(reader.result); if (Array.isArray(parsed.items)) setData(parsed); } catch { alert('That file is not a valid portfolio backup.'); } };
    reader.readAsText(file); e.target.value = '';
  };

  return <section id="studio" className="relative py-24 sm:py-32">
    <div className="section-shell">
      <Reveal className="max-w-2xl">
        <span className="eyebrow">Your space · editable</span>
        <h2 className="mt-4 font-display text-3xl font-semibold text-ice-light sm:text-4xl">{data.headline || 'Your work. Your servers. Your story.'}</h2>
        <p className="mt-4 text-sm leading-relaxed text-ice-light/60 sm:text-base">{data.bio}</p>
      </Reveal>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button onClick={() => setEditing(!editing)} className="inline-flex items-center gap-2 rounded-full bg-ice px-5 py-3 text-xs font-semibold uppercase tracking-widest text-bg"><Settings2 size={15}/>{editing ? 'Close studio' : 'Customize portfolio'}</button>
        <button onClick={exportData} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-widest text-ice-light/80 hover:border-ice/40"><Download size={15}/> Export backup</button>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-widest text-ice-light/80 hover:border-ice/40">Import backup<input type="file" accept="application/json" className="hidden" onChange={importData}/></label>
      </div>
      {editing && <div className="glass-panel mt-6 rounded-2xl p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between"><h3 className="font-display text-xl text-ice-light">Portfolio settings</h3><button aria-label="Close editor" onClick={() => setEditing(false)} className="rounded-full p-2 text-ice-light/60 hover:bg-white/5"><X size={17}/></button></div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-widest text-ice-light/60">Headline<input value={data.headline} onChange={(e) => update('headline', e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 normal-case tracking-normal text-ice-light outline-none focus:border-ice/50"/></label>
          <label className="text-xs uppercase tracking-widest text-ice-light/60">Intro / bio<textarea value={data.bio} onChange={(e) => update('bio', e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 normal-case tracking-normal text-ice-light outline-none focus:border-ice/50"/></label>
        </div>
        <form onSubmit={addItem} className="mt-6 border-t border-white/10 pt-6">
          <h4 className="mb-4 font-display text-lg text-ice-light">Add an entry</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <select value={form.type} onChange={(e) => setForm({...form,type:e.target.value})} className="rounded-xl border border-white/10 bg-[#0d1219] px-4 py-3 text-sm text-ice-light"><option value="work">Design / work sample</option><option value="server">Server / community I work in</option><option value="project">Project</option></select>
            <input required placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ice-light outline-none focus:border-ice/50"/>
            <input placeholder="Short description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ice-light outline-none focus:border-ice/50"/>
            <input placeholder="Link (website, Discord invite, image, etc.)" value={form.url} onChange={(e)=>setForm({...form,url:e.target.value})} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ice-light outline-none focus:border-ice/50"/>
            <input placeholder="Small label (e.g. Branding, Active)" value={form.tag} onChange={(e)=>setForm({...form,tag:e.target.value})} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ice-light outline-none focus:border-ice/50"/>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-ice px-4 py-3 text-sm font-semibold text-bg"><Plus size={16}/> Add to portfolio</button>
          </div>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-ice-light/45">Note: entries save on this device/browser. Export a backup before changing devices. To publish edits for every visitor, update the project data and redeploy the site.</p>
      </div>}
      <div className="mt-10 flex flex-wrap gap-2">
        {[['all','Everything'],['work','Design work'],['server','Servers & communities'],['project','Projects']].map(([value,label])=><button key={value} onClick={()=>setFilter(value)} className={`rounded-full px-4 py-2 text-xs transition ${filter===value?'bg-ice text-bg':'border border-white/10 text-ice-light/60 hover:border-ice/40'}`}>{label}</button>)}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => <article key={item.id} className="glass-panel group relative flex min-h-52 flex-col rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-ice/30">
          <div className="flex items-start justify-between gap-3"><span className="rounded-full border border-ice/20 bg-ice/5 px-3 py-1 text-[10px] uppercase tracking-widest text-ice">{item.tag || typeLabel(item.type)}</span>{editing && <button aria-label={`Remove ${item.title}`} onClick={()=>remove(item.id)} className="rounded-full p-2 text-ice-light/40 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={14}/></button>}</div>
          <h3 className="mt-5 font-display text-xl font-semibold text-ice-light">{item.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ice-light/55">{item.description}</p>
          {item.url && item.url !== '#' && <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ice hover:text-ice-light">Open link <ExternalLink size={13}/></a>}
          {(!item.url || item.url === '#') && <span className="mt-5 text-xs uppercase tracking-widest text-ice-light/30">Link not added yet</span>}
        </article>)}
        {!visible.length && <p className="text-sm text-ice-light/50">No entries in this category yet. Open Customize portfolio to add one.</p>}
      </div>
    </div>
  </section>;
}
