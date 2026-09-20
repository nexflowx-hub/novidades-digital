export default function LibraryPage(){
  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-xl card p-8">
        <h1 className="text-3xl font-black">Biblioteca Digital</h1>
        <p className="mt-4 leading-7 text-slate-300">
          Nesta primeira release, o acesso é feito pelo link individual liberado após pagamento.
          A área autenticada centralizada será a próxima camada.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Se já comprou, utilize o link de acesso apresentado na confirmação da compra.
        </p>
      </div>
    </main>
  );
}
