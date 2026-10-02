import Link from 'next/link';

const items = [
  ['Dashboard','/dashboard'],['Workspace','/workspace'],['Products','/products'],['Roadmap','/roadmap'],['Reports','/reports'],['Calendar','/calendar'],['Settings','/settings']
];
export function Sidebar(){return <aside className="sidebar"><div className="brand"><div className="logoMark">ANT</div><div><b>ANT Digital Office</b><small>Enterprise Workspace</small></div></div><nav>{items.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav><div className="sidebarFoot">Alpha Nusantara Teknologi<br/><span>Founder Workspace</span></div></aside>}
