import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { useBackend } from "hooks/useBackend";
import { endpoints } from "constants/endpoints";
import { hideModal, showModal } from "common/bootstrapActions";

export function PainelPedidos() {
  const [idItem, setIdItem] = useState(null);
  const [quantidadeItem, setQuantidadeItem] = useState("");
  const [nomeItem, setNomeItem] = useState("");

  const { listarRegistros, salvarRegistro } = useBackend(endpoints.itensComanda);

  const queryClient = useQueryClient();

  const { mutate: finalizarItem } = useMutation([], () => salvarRegistro({ status: "F" }, "patch", idItem), {
    onSuccess: () => {
      toast.success("Item finalizado com sucesso");
      btnFinalizacao.current.disabled = false;
      clearDadosItem();
      hideModal("modalFinalizacao");

      queryClient.invalidateQueries([endpoints.itensComanda, "status=A"]);
    },
    onError: () => {
      toast.warn("Não foi possível finalizar o item");
      btnFinalizacao.current.disabled = false;
    },
  });
  const { mutate: cancelarItem } = useMutation(
    [],
    () => salvarRegistro({ status: "F", size: "all" }, "patch", idItem),
    {
      onSuccess: () => {
        toast.success("Item cancelado com sucesso");
        btnCancelamento.current.disabled = false;
        clearDadosItem();
        hideModal("modalCancelamento");

        queryClient.invalidateQueries([endpoints.itensComanda, "status=A"]);
      },
      onError: () => {
        toast.warn("Não foi possível cancelar o item");
        btnCancelamento.current.disabled = false;
      },
    }
  );

  const btnFinalizacao = useRef(null);
  const btnCancelamento = useRef(null);

  const { data, isSuccess, isLoading } = useQuery(
    [endpoints.itensComanda, "status=A", "all"],
    () => listarRegistros({ status: "A" }),
    {
      refetchInterval: 1000,
    }
  );

  function loadDadosItem(dados) {
    setIdItem(dados.id);
    setNomeItem(dados.produto.nome);
    setQuantidadeItem(dados.quantidade);
  }

  function clearDadosItem() {
    setIdItem(null);
    setQuantidadeItem("");
    setNomeItem("");
  }

  return (
    <div>
      <h4>Pedidos | Aberto</h4>

      <div className="row placeholder-glow user-select-none">
        {isLoading
          ? [1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="col-xl-3 mb-3">
                <div className="card bg-primary text-light">
                  <div className="card-body">
                    <div className="d-flex flex-column">
                      <span className="h4 mb-3 placeholder">{"nome"}</span>
                      <div className="h6 text-muted d-flex justify-content-between">
                        <span className="text-light">Quantidade</span>
                        <span className="text-light placeholder">{"quantidade"}</span>
                      </div>

                      <div className="h6 text-muted d-flex justify-content-between">
                        <span className="text-light">Tempo preparo</span>
                        <span className="text-light placeholder">{"tempo_preparo"}</span>
                      </div>
                    </div>

                    <hr className="my-2" />

                    {/* TODO colocar um campo para mostrar o tempo de preparo sugerido(o que está no cadastro) e começar um temporizador */}
                    <div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-light">Cliente: </span>
                        <span className="text-light placeholder">{"cliente"}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-light">Mesa: </span>
                        <span className="text-light placeholder">{"mesa"}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-3 mt-4">
                      <button className="btn btn-sm w-100 text-danger placeholder disabled"></button>
                      <button className="btn btn-sm w-100 btn-sm btn-success placeholder disabled"></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>

      {isSuccess && data.resultados.length === 0 ? (
        <div className="text-center text-muted mt-5">Nenhum pedido em aberto ainda...</div>
      ) : null}

      <div className="row mt-4">
        {/* TODO fazer uma segregação dos itens por comanda vínoculada */}
        {isSuccess
          ? data.resultados.map((item) => (
              <div key={"pedido" + item.id} className="col-xl-3 mb-3">
                <div className="card bg-primary text-light">
                  <div className="card-body">
                    {/* <div className="d-flex justify-content-between">
                      <h6>{item.produto.nome}</h6>
                      <h6 className="badge bg-primary text-ligth p-2">
                        {item.quantidade}
                      </h6>
                    </div> */}

                    <div className="d-flex flex-column">
                      <span className="h4 mb-3">
                        {item.produto.nome} <span class="badge bg-success">{item.codigo}</span>
                      </span>
                      <div className="h6 text-muted d-flex justify-content-between">
                        <span className="text-light">Quantidade</span>
                        <span className="text-light">{item.quantidade}</span>
                      </div>

                      <div className="h6 text-muted d-flex justify-content-between">
                        <span className="text-light">Tempo preparo</span>
                        <span className="text-light">{item.produto.tempo_preparo || "-"}</span>
                      </div>
                    </div>

                    <hr className="my-2" />

                    {/* TODO colocar um campo para mostrar o tempo de preparo sugerido(o que está no cadastro) e começar um temporizador */}
                    <div>
                      <div className="d-flex justify-content-between">
                        <span className="text-light">Cliente: </span>
                        <span className="text-light">{item.cliente || "-"}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-light">Mesa: </span>
                        <span className="text-light">{item.mesa || "-"}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-3 mt-4">
                      <button
                        className="btn btn-sm w-100 text-danger"
                        onClick={(e) => {
                          loadDadosItem(item);
                          showModal("modalCancelamento");
                        }}
                      >
                        Cancelar
                      </button>

                      <button
                        className="btn btn-sm w-100 btn-sm btn-success"
                        onClick={(e) => {
                          loadDadosItem(item);
                          showModal("modalFinalizacao");
                        }}
                      >
                        Finalizar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>

      <div
        className="modal fade"
        id="modalFinalizacao"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex flex-column justify-content-between">
                <div className="d-flex flex-column mb-5">
                  <div className="d-flex justify-content-between mb-4">
                    <h1 className="modal-title fs-5">Finalizar Item | {idItem}</h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        clearDadosItem();
                      }}
                    />
                  </div>

                  <div id="content">
                    <div className="d-flex flex-column">
                      <div>
                        Produto: <span className="text-muted">{nomeItem}</span>
                      </div>
                      <div>
                        Quantidade:
                        <span className="text-muted"> {quantidadeItem}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    ref={btnFinalizacao}
                    type="button"
                    className="btn btn-sm btn-success px-4"
                    onClick={(e) => {
                      // TODO Finalizar por quantidade
                      e.target.disabled = true;
                      finalizarItem();
                    }}
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="modalCancelamento"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex flex-column justify-content-between">
                <div className="d-flex flex-column mb-5">
                  <div className="d-flex justify-content-between mb-4">
                    <h1 className="modal-title fs-5">Cancelar Item | {idItem}</h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        clearDadosItem();
                      }}
                    />
                  </div>

                  <div id="content">
                    <div className="d-flex flex-column">
                      <div>
                        Produto: <span className="text-muted">{nomeItem}</span>
                      </div>
                      <div>
                        Quantidade:
                        <span className="text-muted"> {quantidadeItem}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    ref={btnCancelamento}
                    type="button"
                    className="btn btn-sm btn-danger px-4"
                    onClick={(e) => {
                      // TODO Cancelar por quantidade
                      e.target.disabled = true;
                      cancelarItem();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
