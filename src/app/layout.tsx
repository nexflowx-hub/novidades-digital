import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://digital.novidades.store"),
  title: { default: "Novidades Digital", template: "%s | Novidades Digital" },
  description: "Produtos digitais, toolkits e ferramentas práticas da Novidades.store."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="border-b border-white/10 bg-slate-950 text-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
            <Link href="/" className="font-black tracking-tight">NOVIDADES<span className="text-cyan-300">.digital</span></Link>
            <nav className="flex items-center gap-4 text-xs font-bold text-slate-300 md:text-sm">
              <Link href="/#produto" className="hover:text-white">Produto</Link>
              <Link href="/ferramentas/hook-lab" className="hover:text-white">Hook Lab</Link>
              <a href="https://novidades.store" className="hover:text-white">Novidades.store</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-slate-500 md:px-6">
            <strong className="text-slate-800">Novidades Digital</strong>
            <span>Produtos digitais e ferramentas práticas. Resultados comerciais não são garantidos.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
