import { useEffect } from "react";
import { useQuery } from "react-query";

import { SkeletonRelatorio } from "components/Relatorios/Skeleton";
import { endpoints } from "constants/endpoints";
import { useBackend } from "hooks/useBackend";

export function RelatorioFluxoCaixa() {
  const { listarRegistros } = useBackend(endpoints.relatorios.fluxo_caixa);
  const { data, isSuccess, refetch } = useQuery(
    [endpoints.relatorios.fluxo_caixa],
    () => listarRegistros()
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SkeletonRelatorio titulo="Fluxo de Caixa">
      <table className="table-light table">
        <thead>
          <tr>
            <th className="table-light text-start text-nowrap">Produto</th>
            <th className="table-light text-end text-nowrap">Quantidade Total Vendida</th>
            <th className="table-light text-end text-nowrap">Valor Total Faturado</th>
          </tr>
        </thead>
        <tbody>
          {isSuccess
            ? data.fluxo_produtos.map((fluxo) => (
                <tr key={fluxo.produto + fluxo.valor_total_faturado}>
                  <td className="table-light text-start text-nowrap">{fluxo.produto}</td>
                  <td className="table-light text-end text-nowrap">{fluxo.quantidade_total_vendida}</td>
                  <td className="table-light text-end text-nowrap">{fluxo.valor_total_faturado.toReal()}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </SkeletonRelatorio>
  );
}
