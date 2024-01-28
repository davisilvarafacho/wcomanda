export function HeaderRelatorio({ titulo }) {
  const hoje = new Date();
  const data = hoje.toLocaleDateString("pt-BR");
  const hora = hoje.toLocaleTimeString("pt-BR");

  return (
    <div className="w-100 mb-4">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <h2 className="text-primary fw-bold">wCommanda</h2>
          <h6 className="text-primary">Relatório | {titulo}</h6>
        </div>

        <div className="d-flex flex-column">
          <span className="text-muted text-end">{data}</span>
          <span className="text-muted text-end">{hora}</span>
        </div>
      </div>
    </div>
  );
}
