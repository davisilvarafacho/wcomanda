import { useEffect } from "react";
import { useQuery } from "react-query";

import { SkeletonRelatorio } from "components/Relatorios/Skeleton";
import { endpoints } from "constants/endpoints";
import { useBackend } from "hooks/useBackend";

export function RelatorioProdutos() {
  const { listarRegistros } = useBackend(endpoints.produtos);
  const { data, isSuccess, refetch } = useQuery(
    [endpoints.produtos, "all"],
    () => listarRegistros({ size: "all" })
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SkeletonRelatorio titulo='Produtos'>
      <table className="table table-light">
        <thead>
          <tr>
            <th className="table-light text-start text-nowrap">Código</th>
            <th className="table-light text-start text-nowrap">Nome</th>
            <th className="table-light text-center text-nowrap">Tempo de preparo</th>
            <th className="table-light text-end text-nowrap">Preço</th>
          </tr>
        </thead>
        <tbody>
          {isSuccess
            ? data.resultados.map((produto) => (
                <tr key={produto.id}>
                  <td className="table-light text-start text-nowrap">{produto.id}</td>
                  <td className="table-light text-start text-nowrap">{produto.nome}</td>
                  <td className="table-light text-center text-nowrap">{produto.tempo_preparo} minutos</td>
                  <td className="table-light text-end text-nowrap">{produto.preco.toReal()}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </SkeletonRelatorio>
  );
}
