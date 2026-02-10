import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      <aside className="w-64 bg-[#1a1a1a] border-r border-white/10 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-purple-500">Admin Panel</h2>
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="block p-3 rounded-lg hover:bg-white/5 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/photos" className="block p-3 rounded-lg hover:bg-white/5 transition-colors">
            Fotos
          </Link>
          <Link href="/admin/albums" className="block p-3 rounded-lg hover:bg-white/5 transition-colors">
            Álbuns
          </Link>
          <Link href="/admin/profile" className="block p-3 rounded-lg hover:bg-white/5 transition-colors">
            Perfil
          </Link>
        </nav>
        <Link href="/" className="mt-auto p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-400">
          Voltar ao Site
        </Link>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
