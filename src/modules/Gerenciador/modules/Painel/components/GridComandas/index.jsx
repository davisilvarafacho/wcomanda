import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BsBoxes, BsEyeFill, BsPlusLg, BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";

import { useBackend } from "hooks/useBackend";
import { endpoints } from "constants/endpoints";
import { hideModal, showModal } from "common/bootstrapActions";
import { useValidacoes } from "hooks/useValidacoes";
import { REGEX_CAMPO_PREENCHIDO } from "constants/regexs";
import { InputID } from "components/InputID";
import { removeInvalidation } from "utils/invalidations";

export function GridComandas() {
  const [idComanda, setIdComanda] = useState(null);
  const [statusComandaGrid, setStatusComandaGrid] = useState("A");
  const statusComandaGridMap = {
    A: "Abertas",
    C: "Canceladas",
    P: "Pagas",
  };

  // form comanda
  const [cliente, setCLiente] = useState("");
  const [mesa, setMesa] = useState("");
  const [garcom, setGarcom] = useState("");

  const [idProduto, setIdProduto] = useState("");
  const [inputProduto, setInputProduto] = useState("");
  const [dadosProduto, setDadosProduto] = useState({});
  const [quantidadeProduto, setQuantidadeProduto] = useState("1");
  const [statusProduto, setStatusProduto] = useState("A");

  const [valorTotalComanda, setValorTotalComanda] = useState(0);
  const [itensComanda, setItensComanda] = useState([]);

  const selectMesa = useRef(null);
  const txtCliente = useRef(null);
  const txtGarcom = useRef(null);

  const txtIdProduto = useRef(null);
  const txtQuantidadeProduto = useRef(null);

  // finalizar comanda
  const [formaPagamento, setFormaPagamento] = useState("CRE");

  const selectFormaPagamentoFechamento = useRef(null);

  const { obterRegistro, listarRegistros, salvarRegistro, excluirRegistro } = useBackend(endpoints.comandas);
  const { validar, validarExpressao, validacaoMassiva } = useValidacoes();

  const statusItemMap = {
    A: "Aberto",
    C: "Cancelado",
    E: "Entregue",
    F: "Finalizado",
  };

  const queryClient = useQueryClient();

  const {
    data: comandas,
    isLoading: isLoadingComandas,
    isSuccess: isSuccessComandas,
  } = useQuery([endpoints.comandas, statusComandaGrid, "all"], () =>
    listarRegistros({ status: statusComandaGrid, size: "all" })
  );

  const {
    data: comanda,
    isLoading: isLoadingComanda,
    status: statusComanda,
    isRefetching: isRefetchingComanda,
    refetch: refetchComanda,
  } = useQuery([endpoints.comandas, idComanda], () => obterRegistro(idComanda), {
    enabled: !!idComanda,
  });

  const { data: mesas, isSuccess: isSuccessMesas } = useQuery([endpoints.mesas, "all"], () =>
    listarRegistros({ size: "all" }, endpoints.mesas)
  );

  const { mutate: salvarComanda } = useMutation(
    [endpoints.comandas, idComanda],
    () =>
      salvarRegistro(
        idComanda
          ? {
              mesa,
              cliente,
              garcom,
            }
          : {
              mesa,
              cliente,
              garcom,
              produtos: itensComanda.map((item) => ({
                produto: item.produto.id,
                quantidade: item.quantidade,
              })),
            },
        idComanda ? "patch" : "post",
        idComanda
      ),
    {
      onSuccess: () => {
        toast.success("Comanda salva com sucesso!");
        hideModal("modalComanda");

        queryClient.invalidateQueries([endpoints.mesas, "all"]);
        queryClient.invalidateQueries([endpoints.comandas, statusComandaGrid, "all"]);
        queryClient.invalidateQueries([endpoints.comandas, idComanda]);

        setIdProduto(null);
        setInputProduto("");
        setQuantidadeProduto("1");
        setStatusProduto("A");
      },
      onError: (err) => {
        toast.warn("Não foi possível salvar a comanda");
        if (import.meta.env.DEV) {
          console.log(err.response.data);
        }
      },
    }
  );

  const { mutate: addComandaItem } = useMutation(
    [endpoints.itensComanda],
    () =>
      salvarRegistro(
        {
          produto: idProduto,
          quantidade: quantidadeProduto,
          comanda: idComanda,
        },
        "post",
        null,
        endpoints.itensComanda
      ),
    {
      onSuccess: () => {
        toast.success("Item adicionado com sucesso");

        queryClient.invalidateQueries([endpoints.comandas, statusComandaGrid]);
        queryClient.invalidateQueries([endpoints.comandas, idComanda]);

        setInputProduto("");
        setIdProduto(null);
        setQuantidadeProduto("1");
        setStatusProduto("A");
        setDadosProduto({});
      },
      onError: () => {
        toast.warn("Não foi possível adicionar o item");
      },
    }
  );

  const { mutate: excluirComandaItem } = useMutation(
    [endpoints.itensComanda],
    (id) => excluirRegistro(id, endpoints.itensComanda),
    {
      onSuccess: () => {
        toast.success("Item excluído com sucesso");
        queryClient.invalidateQueries([endpoints.comandas, statusComandaGrid, "all"]);
        queryClient.invalidateQueries([endpoints.comandas, idComanda]);
      },
      onError: () => {
        toast.warn("Não foi possível excluir o item");
      },
    }
  );

  const { mutate: finalizarComanda } = useMutation(
    () => salvarRegistro({ status: "P", forma_pagamento: formaPagamento }, "patch", idComanda),
    {
      onSuccess: () => {
        toast.success("Comanda finalizada com sucesso");
        queryClient.invalidateQueries([endpoints.mesas, "all"]);
        queryClient.invalidateQueries([endpoints.comandas, statusComandaGrid, "all"]);
        queryClient.invalidateQueries([endpoints.comandas, idComanda]);

        setIdComanda(null);

        hideModal("modalFechamento");
      },
      onError: () => {
        toast.warn("Não foi possível finalizar a comanda");
      },
    }
  );

  const { mutate: cancelarComanda } = useMutation(() => salvarRegistro({ status: "C" }, "patch", idComanda), {
    onSuccess: () => {
      toast.success("Comanda cancelada com sucesso");
      queryClient.invalidateQueries([endpoints.mesas, "all"]);
      queryClient.invalidateQueries([endpoints.comandas, statusComandaGrid, "all"]);
      queryClient.invalidateQueries([endpoints.comandas, idComanda]);

      setIdComanda(null);

      hideModal("modalCancelamento");
    },
    onError: () => {
      toast.warn("Não foi possível cancelar a comanda");
    },
  });

  useEffect(() => {
    setQuantidadeProduto(statusComandaGrid === "A" ? "1" : "");
  }, [statusComandaGrid]);

  useEffect(() => {
    if (idComanda && statusComanda === "success") {
      setMesa(comanda.mesa);
      setGarcom(comanda.garcom);
      setCLiente(comanda.cliente);
      setItensComanda(comanda.produtos);
    }
  }, [statusComanda, idComanda, isRefetchingComanda]);

  useEffect(() => {
    const novoTotalItemsComanda = itensComanda.reduce((acc, item) => acc + item.valor_total, 0);
    setValorTotalComanda(novoTotalItemsComanda);
  }, [itensComanda]);

  return (
    <div className="col-12">
      <div className="d-flex justify-content-between">
        <h4 className="d-flex">
          <span className="me-2">Comandas</span>
          <div className="dropdown">
            <span className="dropdown-toggle" role="button" data-bs-toggle="dropdown">
              | {statusComandaGridMap[statusComandaGrid]}
            </span>

            <ul className="dropdown-menu">
              <li
                role="button"
                className="dropdown-item"
                onClick={() => {
                  setStatusComandaGrid("A");
                }}
              >
                Abertas
              </li>
              <li
                role="button"
                className="dropdown-item"
                onClick={() => {
                  setStatusComandaGrid("P");
                }}
              >
                Pagas
              </li>
              <li
                role="button"
                className="dropdown-item"
                onClick={() => {
                  setStatusComandaGrid("C");
                }}
              >
                Canceladas
              </li>
            </ul>
          </div>
        </h4>

        <div className="w-100 px-5">
          <input type="search" className="form-control" placeholder="Ex.: Davi..." />
        </div>

        {statusComandaGrid === "A" ? (
          <div className="d-flex gap-3">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                setIdComanda(null);
                showModal("modalComanda");
              }}
            >
              <div className="d-flex justify-content-between gap-2">
                Adicionar <BsPlusLg size={19} />
              </div>
            </button>
          </div>
        ) : null}
      </div>

      <hr />

      <div className="row mt-4">
        {isLoadingComandas
          ? [1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n + "comanda"} className="col-xl-4 mb-3 user-select-none placeholder-glow">
                <div className="card">
                  <div className="card-header bg-primary text-light d-flex justify-content-between">
                    <span className="placeholder">{"comanda.id"}</span>
                    <span className="placeholder">Aberta</span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-column card-text">
                      <div className="d-flex justify-content-between mb-2">
                        <b className="placeholder text-secondary">cliente</b>
                        <span className="placeholder text-secondary">cliente</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <b className="placeholder text-secondary">mesa</b>
                        <span className="placeholder text-secondary">mesa</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <b className="placeholder text-secondary">garçom</b>
                        <span className="placeholder text-secondary">garcom</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <b className="placeholder text-secondary">valor total</b>
                        <span className="placeholder text-secondary">valor_total</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="w-100 d-flex justify-content-between">
                      <button className="btn btn-sm btn-outline-primary d-flex align-items-center disabled" disabled>
                        <BsEyeFill className="me-2" /> Visualizar
                      </button>

                      {statusComandaGrid === "A" ? (
                        <div className="dropdown">
                          <button className="btn btn-sm" type="button" disabled={true} aria-expanded="false">
                            <BsThreeDotsVertical />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
        {isSuccessComandas ? (
          comandas.resultados.length === 0 ? (
            <p className="text-muted">
              Não existem comandas {statusComandaGridMap[statusComandaGrid].toLowerCase()}...
            </p>
          ) : (
            comandas.resultados.map((comanda) => (
              <div key={comanda.id + Math.random()} className="col-xl-4 mb-3">
                <div className="card">
                  <div className="card-header bg-primary text-light d-flex justify-content-between">
                    <span>{comanda.id}</span>
                    <span>Aberta</span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-column card-text">
                      <div className="d-flex justify-content-between">
                        <b>cliente</b>
                        <span>{comanda.cliente || "-"}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <b>mesa</b>
                        <span>{comanda.mesa || "-"}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <b>garçom</b>
                        <span>{comanda.garcom || "-"}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <b>valor total</b>
                        <span>{comanda.valor_total.toReal()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="w-100 d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                        onClick={() => {
                          showModal("modalComanda");
                          setIdComanda(comanda.id);
                          // refetchComanda();
                        }}
                      >
                        <BsEyeFill className="me-2" /> Visualizar
                      </button>

                      {statusComandaGrid === "A" ? (
                        <div className="dropdown">
                          <button className="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <BsThreeDotsVertical />
                          </button>
                          <ul className="dropdown-menu">
                            <li
                              role="button"
                              className="dropdown-item"
                              onClick={() => {
                                setIdComanda(comanda.id);
                                showModal("modalFechamento");
                              }}
                            >
                              Finalizar
                            </li>
                            <li
                              role="button"
                              className="dropdown-item"
                              onClick={() => {
                                setIdComanda(comanda.id);
                                showModal("modalCancelamento");
                              }}
                            >
                              Cancelar
                            </li>
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : null}
      </div>

      <div
        className="modal fade"
        id="modalFechamento"
        tabIndex={-1}
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between">
                    <h1 className="modal-title fs-5">Finalizar Comanda | {idComanda}</h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setFormaPagamento("CRE");
                      }}
                    />
                  </div>

                  <div className="row mt-4">
                    <div className="col-12">
                      {/* TODO sugestões de promoções com base nas formas de pagamento a vista */}
                      <label className="form-label">
                        Forma de Pagamento <i className="text-danger">*</i>
                      </label>
                      <select
                        ref={selectFormaPagamentoFechamento}
                        type="text"
                        className="form-control"
                        value={formaPagamento}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                      >
                        <option value="CRE">Cartão de Crédito</option>
                        <option value="CRD">Cartão de Débito</option>
                        <option value="DIN">Dinheiro</option>
                        <option value="PIX">PIX</option>
                        <option value="OUT">Outro</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-5">
                  <button
                    type="button"
                    className="w-100 btn btn-primary"
                    onClick={() => {
                      finalizarComanda();
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
        tabIndex={-1}
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between">
                  <h1 className="modal-title fs-5">Cancelar Comanda | {idComanda}</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>

                <span className="mt-4">Tem certeza que deseja cancelar a comanda?</span>

                <button type="button" className="btn btn-danger mt-5" onClick={() => cancelarComanda()}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="modalComanda"
        tabIndex={-1}
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
          <div
            className="modal-content"
            style={{
              minHeight: "90vh",
              height: "90vh",
              maxHeight: "90vh",
            }}
          >
            {isLoadingComanda ? (
              <div className="modal-body d-flex flex-column justify-content-between align-items-center placeholder-glow">
                <div>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span className="placeholder rounded placeholder-lg py-3 col-2" />
                    <button className="btn btn-sm btn-secondary disabled placeholder px-4" aria-disabled="true" />
                  </div>

                  <div className="w-100 my-4">
                    <div id="comanda">
                      <div className="d-flex flex-column justify-content-between h-100">
                        <div className="row">
                          <div className="col-md-6 col-lg-4 mb-2">
                            <label className="placeholder form-label rounded">Cliente</label>
                            <input type="text" className="form-control placeholder" disabled />
                            <div className="invalid-feedback" />
                          </div>
                          <div className="col-md-6 col-lg-3 mb-2">
                            <label className="placeholder form-label rounded">Garçom</label>
                            <input type="text" className="form-control placeholder" disabled />
                          </div>
                          <div className="col-md-6 col-lg-2 mb-2">
                            <label className="placeholder form-label rounded">Mesa</label>
                            <select className="form-select placeholder" disabled />
                          </div>

                          <div className="col-md-12">
                            <h6 className="border-bottom border-secondary pb-2 mb-3">
                              <BsBoxes /> Itens
                            </h6>
                          </div>

                          <div className="col-md-6 col-lg-4 mb-2">
                            <label className="placeholder form-label rounded">Produto</label>
                            <input type="text" className="form-control placeholder" disabled />
                          </div>

                          <div className="col-md-6 col-lg-3 mb-2">
                            <label className="placeholder form-label rounded">Quantidade</label>
                            <input type="text" className="form-control placeholder" disabled />
                            <div className="invalid-feedback" />
                          </div>

                          <div className="col-lg-2 d-flex flex-column align-items-center justify-content-center">
                            <button
                              className="btn btn-primary disabled placeholder w-100"
                              aria-disabled="true"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="comanda-itens" className="mt-3 px-3">
                      <div className="row">
                        <div className="col-12 placeholder rounded my-2 py-3"></div>
                        <div className="col-12 placeholder rounded my-2 py-3"></div>
                        <div className="col-12 placeholder rounded my-2 py-3"></div>
                        <div className="col-12 placeholder rounded my-2 py-3"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end w-100">
                  <button className="btn btn-primary disabled placeholder col-1" aria-disabled="true" />
                </div>
              </div>
            ) : (
              <div className="modal-body d-flex flex-column justify-content-between align-items-center">
                <div>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <h1 className="modal-title fs-5">Comanda | {idComanda ?? "Nova"}</h1>

                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setIdComanda(null);

                        setMesa("");
                        setCLiente("");
                        setGarcom("");

                        setIdProduto(null);
                        setInputProduto("");
                        setQuantidadeProduto("1");
                        setStatusProduto("A");
                        setDadosProduto({});
                        setItensComanda([]);

                        removeInvalidation([txtCliente.current, txtIdProduto.current, txtQuantidadeProduto.current]);

                        queryClient.invalidateQueries([endpoints.mesas, "all"]);

                        queryClient.invalidateQueries([endpoints.comandas, statusComandaGrid, "all"]);

                        queryClient.invalidateQueries([endpoints.comandas, idComanda]);
                      }}
                    />
                  </div>

                  <div className="w-100 my-4">
                    <div id="comanda">
                      <div className="d-flex flex-column justify-content-between h-100">
                        <div className="row">
                          <div className="col-md-6 col-lg-4 mb-2">
                            <label className="form-label">
                              Cliente <i className="text-danger">*</i>
                            </label>
                            <input
                              ref={txtCliente}
                              disabled={!!idComanda}
                              type="text"
                              className="form-control"
                              maxLength={30}
                              value={cliente}
                              onChange={(e) => setCLiente(e.target.value)}
                              onBlur={(e) => {
                                validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                              }}
                            />
                            <div className="invalid-feedback" />
                          </div>

                          <div className="col-md-6 col-lg-3 mb-2">
                            <label className="form-label">Garçom</label>
                            <input
                              ref={txtGarcom}
                              disabled={!!idComanda}
                              type="text"
                              className="form-control"
                              maxLength={30}
                              value={garcom}
                              onChange={(e) => setGarcom(e.target.value)}
                            />
                          </div>

                          <div className="col-md-6 col-lg-2 mb-2">
                            <label className="form-label">Mesa</label>
                            <select
                              ref={selectMesa}
                              disabled={!!idComanda}
                              className="form-select"
                              value={mesa}
                              onChange={(e) => setMesa(e.target.value)}
                            >
                              <option value="">Selecione</option>
                              {isSuccessMesas
                                ? mesas.resultados.map((mesa) => (
                                    <option key={mesa.codigo} value={mesa.codigo}>
                                      {mesa.codigo}
                                    </option>
                                  ))
                                : null}
                            </select>
                          </div>

                          <div className="col-md-12">
                            <h6 className="border-bottom border-secondary pb-2 mb-3">
                              <BsBoxes /> Itens
                            </h6>
                          </div>

                          <div className="col-md-12 col-lg-4 mb-3">
                            <label className="form-label">Produto</label>
                            <InputID
                              modulo={"PRODUTOS"}
                              setID={setIdProduto}
                              state={inputProduto}
                              onClick={(dados, dadosInput) => {
                                setDadosProduto(dados);
                                setInputProduto(dadosInput);
                              }}
                              validacoes={(input) => {
                                // input.classList.contains("is-invalid") &&
                                validar(input, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                              }}
                              inputProps={{
                                disabled: statusComandaGrid !== "A",
                                ref: txtIdProduto,
                              }}
                            />
                          </div>

                          <div className="col-md-12 col-lg-4 mb-3">
                            <label className="form-label">Quantidade</label>
                            <input
                              ref={txtQuantidadeProduto}
                              type="number"
                              className="form-control text-end"
                              value={quantidadeProduto}
                              disabled={statusComandaGrid !== "A"}
                              onChange={(e) => setQuantidadeProduto(e.target.value.replace(/\D/g, ""))}
                              onBlur={(e) => {
                                validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                                if (e.target.classList.contains("is-invalid")) return;

                                validarExpressao(
                                  txtQuantidadeProduto.current,
                                  parseFloat(quantidadeProduto.replace(",", ".")) > 0,
                                  "A quantidade não pode ser 0"
                                );
                              }}
                            />
                            <div className="invalid-feedback" />
                          </div>

                          <div className="col-lg-2">
                            <label className="form-label">Status</label>
                            <select
                              className="form-select"
                              value={statusProduto}
                              onChange={(e) => setStatusProduto(e.target.value)}
                            >
                              <option value="A">Aberto</option>
                              <option value="E">Entregue</option>
                            </select>
                          </div>

                          {statusComandaGrid === "A" ? (
                            <div className="col-lg-2 d-flex flex-column align-items-center justify-content-center">
                              <button
                                className="w-100 btn btn-sm btn-outline-primary"
                                onClick={() => {
                                  let valido = validacaoMassiva([txtIdProduto.current, txtQuantidadeProduto.current]);

                                  if (txtQuantidadeProduto.current.classList.contains("is-invalid")) return;

                                  validarExpressao(
                                    txtQuantidadeProduto.current,
                                    parseFloat(quantidadeProduto.replace(",", ".")) > 0,
                                    "A quantidade não pode ser 0"
                                  );

                                  if (!valido) return;

                                  if (!idComanda) {
                                    const id = (Math.random() * 10000).toFixed(0);
                                    setItensComanda([
                                      ...itensComanda,
                                      {
                                        id,
                                        produto: {
                                          id: idProduto,
                                          nome: dadosProduto.nome,
                                          preco: dadosProduto.preco,
                                        },
                                        quantidade: quantidadeProduto,
                                        status: statusProduto,
                                        valor_total: dadosProduto.preco * quantidadeProduto,
                                      },
                                    ]);

                                    setIdProduto(null);
                                    setInputProduto("");
                                    setQuantidadeProduto("1");
                                    setStatusProduto("A");
                                    setDadosProduto({});
                                    // setStatus;
                                  } else {
                                    addComandaItem();
                                  }
                                }}
                              >
                                Adicionar
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div id="comanda-itens" className="mt-3">
                      {isLoadingComanda ? (
                        <div className="d-flex flex-column justify-content-center align-items-center h-100">
                          <div className="spinner-border text-primary" role="status"></div>
                        </div>
                      ) : null}

                      <div className="mt-4">
                        <table className="table table-hover2">
                          <thead>
                            <tr>
                              <th className="text-start">Código</th>
                              <th>Produto</th>
                              <th className="text-center">Status</th>
                              <th className="text-end">Preço</th>
                              <th className="text-end">Quantidade</th>
                              <th className="text-end">Valor Total</th>
                              {statusComandaGrid === "A" ? <th /> : null}
                            </tr>
                          </thead>
                          <tbody>
                            {itensComanda.map((item) => (
                              <tr key={item.id + Math.random()}>
                                <td className="text-start">{item.codigo || ""}</td>
                                <td>{item.produto.nome}</td>
                                <td className="text-center">{statusItemMap[item.status]}</td>
                                <td className="text-end">{item.produto.preco.toReal()}</td>
                                <td className="text-end">{item.quantidade}</td>
                                <td className="text-end">{item.valor_total.toReal()}</td>
                                {statusComandaGrid === "A" ? (
                                  <td
                                    role="button"
                                    className="text-center"
                                    onClick={() => {
                                      if (!idComanda) {
                                        const novosItensComanda = itensComanda.filter((i) => i.id !== item.id);
                                        setItensComanda(novosItensComanda);
                                        return;
                                      }

                                      if (item.status === "F")
                                        toast.warn("Este item já foi finalizado e não pode ser excluído");
                                      else if (item.status === "E")
                                        toast.warn("Este item já foi entregue e não pode ser excluído");
                                      else if (item.status === "C")
                                        toast.warn("Este item foi cancelado e não pode ser excluído");
                                      else excluirComandaItem(item.id);
                                    }}
                                  >
                                    <BsTrash />
                                  </td>
                                ) : null}
                              </tr>
                            ))}
                            <tr>
                              <td>VALOR TOTAL</td>
                              <td />
                              <td />
                              <td />
                              <td />
                              <td className="text-end">{valorTotalComanda.toReal()}</td>
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {statusComandaGrid === "A" ? (
                  <div className="d-flex justify-content-end w-100">
                    <button
                      type="button"
                      className="col-12 col-md-2 btn btn-sm btn-outline-primary"
                      onClick={() => {
                        /* const formValido = validacaoMassiva(
                          [selectMesa.current, txtCliente.current],
                          [{ regex: REGEX_CAMPO_PREENCHIDO }]
                        );

                        if (!formValido) return; */

                        validar(txtCliente.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);

                        if (txtCliente.current.classList.contains("is-invalid")) return txtCliente.current.focus();

                        if (itensComanda.length === 0) return toast.warn("Adicione pelo menos um item na comanda");

                        salvarComanda();
                      }}
                    >
                      Salvar
                    </button>
                  </div>
                ) : null}

                {/* <div className="w-100 h-100 d-flex flex-column justify-content-between align-items-center"></div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
