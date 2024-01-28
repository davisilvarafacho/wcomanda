import { useState, useRef, useEffect } from "react";
import { useQuery } from "react-query";

import { HeaderForm } from "components/HeaderForm";
import { useValidacoes } from "hooks/useValidacoes";
import { useBackend } from "hooks/useBackend";
import { REGEX_CAMPO_PREENCHIDO } from "constants/regexs";
import { endpoints } from "constants/endpoints";
import { removeInvalidation } from "utils/invalidations";

export function FormCategorias({ id, setId }) {
  const { validar } = useValidacoes();
  const { obterRegistro } = useBackend(endpoints.categorias);
  const { data, isSuccess, isLoading, isRefetching } = useQuery(
    [endpoints.categorias, id],
    () => obterRegistro(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  // form
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const form = useRef(null);

  const txtNome = useRef(null);
  const txtDescricao = useRef(null);

  function carregarDados() {
    removeInvalidation([txtNome.current]);

    setNome(data.nome);
    setDescricao(data.observacao);
  }

  function validacoes() {
    validar(txtNome.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
    return !form.current.querySelector(".is-invalid");
  }

  function limparForm() {
    removeInvalidation([txtNome.current]);

    setId(null);
    setNome("");
    setDescricao("");
  }

  useEffect(() => {
    isSuccess && carregarDados();
  }, [isLoading, isRefetching]);

  return (
    <div ref={form} className="text-dark">
      <HeaderForm
        id={id}
        titulo={"Categoria"}
        validacoes={validacoes}
        endpoint={endpoints.categorias}
        form={form}
        limparForm={limparForm}
        confExclusao={{
          titulo: "Excluir Categoria",
          texto: (
            <>
              Deseja mesmo excluir a categoria <strong>{nome}</strong>?
            </>
          ),
          mensagemSucesso: (
            <>
              Categoria <strong>{nome}</strong> excluída com sucesso
            </>
          ),
          mensagemErro: (
            <>
              Não foi possível excluir a categoria <strong>{nome}</strong>
            </>
          ),
        }}
        dados={() => ({
          nome,
          descricao,
        })}
        confSalvar={{
          mensagemSucesso: (
            <>
              Categoria <strong>{nome}</strong> salva com sucesso
            </>
          ),
          mensagemErro: (
            <>
              Não foi possível salvar a categoria <strong>{nome}</strong>
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
            onBlur={(e) =>
              validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])
            }
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
