import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://digital.novidades.store"),
  title: { default: "Novidades Digital", template: "%s · Novidades Digital" },
  description: "Produtos digitais práticos da Novidades.store: sistemas, guias, workbooks, planilhas e ferramentas.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-b border-white/10 bg-[#07111f]/95 backdrop-blur">
          <div className="shell flex min-h-16 items-center justify-between gap-4">
            <Link href="/" className="font-black tracking-[-0.03em]">
              NOVIDADES<span className="text-cyan-300">.digital</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-300">
              <Link href="/#produtos">Produtos</Link>
              <Link href="/biblioteca">Biblioteca</Link>
              <a href="https://novidades.store">Novidades.store</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-20 border-t border-white/10 py-10 text-sm text-slate-400">
          <div className="shell flex flex-wrap justify-between gap-4">
            <p>© 2026 Novidades Digital.</p>
            <p>Entrega digital protegida · Pagamentos via XPAYMENTS</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
