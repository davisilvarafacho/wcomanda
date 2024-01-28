import { useState, useRef, useEffect } from "react";
import { useQuery } from "react-query";

import { HeaderForm } from "components/HeaderForm";
import { useValidacoes } from "hooks/useValidacoes";
import { useBackend } from "hooks/useBackend";
import { REGEX_CAMPO_PREENCHIDO } from "constants/regexs";
import { endpoints } from "constants/endpoints";
import { removeInvalidation } from "utils/invalidations";

export function FormProdutos({ id, setId }) {
  const { validar } = useValidacoes();
  const { obterRegistro } = useBackend(endpoints.produtos);
  const { data, isSuccess, isLoading, isRefetching } = useQuery([endpoints.produtos, id], () => obterRegistro(id), {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const [codigo, setCodigo] = useState(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idCategoria, setIdCategoria] = useState(null);
  const [inputCategoria, setInputCategoria] = useState("");

  const form = useRef(null);

  const txtNome = useRef(null);
  const txtPreco = useRef(null);
  const txtIdCategoria = useRef(null);
  const txtDescricao = useRef(null);

  const txtImagem = useRef(null);

  function carregarDados() {
    removeInvalidation([txtNome.current, txtPreco.current]);

    setCodigo(data.codigo)
    setNome(data.nome);
    setPreco(data.preco);
    setDescricao(data.observacao);

    if (data.categoria) {
      setIdCategoria(data.categoria.id);
      setInputCategoria(`${data.categoria.id} - ${data.categoria.nome}`);
    }

    if (data.image) {
      // carregar imagem
    }
  }

  function validacoes() {
    validar(txtNome.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
    validar(txtPreco.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
    return !form.current.querySelector(".is-invalid");
  }

  function limparForm() {
    removeInvalidation([txtNome.current, txtPreco.current]);

    setId(null);
    setCodigo(null);

    setNome("");
    setPreco("");
    setDescricao("");
    setIdCategoria("");
    setInputCategoria("");
  }

  useEffect(() => {
    isSuccess && carregarDados();
  }, [isLoading, isRefetching]);

  return (
    <div ref={form} className="text-dark">
      <HeaderForm
        id={id}
        codigo={codigo}
        titulo={"Produtos"}
        validacoes={validacoes}
        endpoint={endpoints.produtos}
        form={form}
        limparForm={limparForm}
        confExclusao={{
          titulo: "Excluir Produto",
          texto: (
            <>
              Deseja mesmo excluir o produto <strong>{nome}</strong>?
            </>
          ),
          mensagemSucesso: (
            <>
              Produto <strong>{nome}</strong> excluído com sucesso
            </>
          ),
          mensagemErro: (
            <>
              Não foi possível excluir o produto <strong>{nome}</strong>
            </>
          ),
        }}
        dados={() => ({
          nome,
          preco,
          descricao,
          categoria: idCategoria,
          // imagem: txtImagem.current.files[0],
        })}
        confSalvar={{
          mensagemSucesso: (
            <>
              Produto <strong>{nome}</strong> salvo com sucesso
            </>
          ),
          mensagemErro: (
            <>
              Não foi possível salvar o produto <strong>{nome}</strong>
            </>
          ),
        }}
      />

      <div className="row">
        <div className="col-12 mb-3">
          <label className="form-label">
            Nome <i className="text-danger">*</i>
          </label>
          <input
            ref={txtNome}
            type="text"
            maxLength={50}
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onBlur={(e) => validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])}
          />
          <div className="invalid-feedback" />
        </div>

        <div className="col-12 mb-3">
          <label className="form-label">
            Preço <i className="text-danger">*</i>
          </label>
          <input
            ref={txtPreco}
            type="number"
            className="form-control text-end"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            onBlur={(e) => validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])}
          />
          <div className="invalid-feedback" />
        </div>

        <div className="col-12 mb-3">
          <label className="form-label">Descrição </label>
          <textarea
            ref={txtDescricao}
            rows={5}
            maxLength={700}
            className="form-control"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <div className="invalid-feedback" />
        </div>
      </div>
    </div>
  );
}
