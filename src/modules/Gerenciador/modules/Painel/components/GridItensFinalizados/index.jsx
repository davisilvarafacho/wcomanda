import { useQuery, useMutation, useQueryClient } from "react-query";
import { BsCheck2All } from "react-icons/bs";

import { useBackend } from "hooks/useBackend";
import { endpoints } from "constants/endpoints";
import { toast } from "react-toastify";

export function GridItensFinalizados() {
  const { listarRegistros, salvarRegistro } = useBackend(endpoints.itensComanda);

  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess } = useQuery([endpoints.itensComanda, "status=F", "all"], () =>
    listarRegistros({ size: "all", status: "F" })
  );

  const { mutate: entregarItem } = useMutation((id) => salvarRegistro({ status: "E" }, "patch", id), {
    onSuccess: () => {
      toast.success("Item entregue com sucesso!");
      queryClient.invalidateQueries([endpoints.itensComanda, "status=F", "all"]);
    },
    onError: () => {
      toast.warn("Não foi possível alterar o status do item");
    },
  });

  return (
    <div style={{ maxHeight: "800px" }} className="col-12">
      <div className="d-flex justify-content-between">
        <h4>Itens Finalizados</h4>
      </div>

      <hr />

      <div className="row overflow-y-auto mt-4">
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="col-12 mb-3">
                <div className="card user-select-none">
                  <div className="card-body placeholder-glow">
                    <h6 className="card-title d-flex justify-content-between">
                      <b className="placeholder">{"codigo"}</b>
                      <div>
                        <span className="badge bg-primary text-primary placeholder">{"LIVRE"}</span>
                      </div>
                    </h6>
                    <div className="card-text">
                      <div className="d-flex justify-content-between">
                        <span className="placeholder">lugares</span>
                        <span className="placeholder">1234</span>
                      </div>
                    </div>

                    <div className="collapse mt-3" id={`collapseMesa${"mesa.id"}`}>
                      <div className="card card-body">
                        <b>Comandas</b>
                        <ul className="mt-3">
                          <li>1</li>
                          <li>2</li>
                          <li>3</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}

        {isSuccess && data.resultados.length === 0 ? (
          <p className="text-muted">Não há nenhum item finalizado...</p>
        ) : null}

        {isSuccess
          ? data.resultados.map((item) => (
              <div key={item.id + item.codigo} className="col-12 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <b>{item.produto.nome}</b>
                      <span className="badge bg-primary ms-2">{item.codigo}</span>
                    </h5>
                    <div className="card-text">
                      <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">cliente</span> <span>{item.cliente || "-"}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">mesa</span> <span>{item.comanda.mesa || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-100 btn btn-sm btn-primary mt-3"
                      onClick={() => {
                        entregarItem(item.id);
                      }}
                    >
                      <BsCheck2All /> Entregar
                    </button>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
