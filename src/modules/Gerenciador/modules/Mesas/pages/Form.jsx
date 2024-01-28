import { useState, useRef, useEffect } from "react";
import { useQuery } from "react-query";

import { HeaderForm } from "components/HeaderForm";
import { useValidacoes } from "hooks/useValidacoes";
import { useBackend } from "hooks/useBackend";
import { REGEX_CAMPO_PREENCHIDO } from "constants/regexs";
import { endpoints } from "constants/endpoints";
import { removeInvalidation } from "utils/invalidations";

export function FormMesas({ id, setId }) {
  const { validar } = useValidacoes();
  const { obterRegistro } = useBackend(endpoints.mesas);
  const { data, isSuccess, isLoading, isRefetching } = useQuery(
    [endpoints.mesas, id],
    () => obterRegistro(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  // form
  const [codigo, setCodigo] = useState("");
  const [quantidadeLugares, setQuantidadeLugares] = useState("");
  const [descricao, setDescricao] = useState("");

  const form = useRef(null);

  const txtCodigo = useRef(null);
  const txtLugares = useRef(null);
  const txtDescricao = useRef(null);

  function carregarDados() {
    removeInvalidation([txtCodigo.current, txtLugares.current]);

    setCodigo(data.codigo);
    setQuantidadeLugares(data.quantidade_lugares);
    setDescricao(data.observacao);
  }

  function validacoes() {
    validar(txtCodigo.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
    validar(txtLugares.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
    return !form.current.querySelector(".is-invalid");
  }

  function limparForm() {
    removeInvalidation([txtCodigo.current, txtLugares.current]);

    setId(null);
    setCodigo("");
    setQuantidadeLugares("");
    setDescricao("");
  }

  useEffect(() => {
    isSuccess && carregarDados();
  }, [isLoading, isRefetching]);

  return (
    <div ref={form} className="text-dark">
      <HeaderForm
        id={id}
        titulo={"Mesa"}
        validacoes={validacoes}
        endpoint={endpoints.mesas}
        form={form}
        limparForm={limparForm}
        confExclusao={{
          titulo: "Excluir Mesa",
          texto: (
            <>
              Deseja mesmo excluir a mesa <strong>{codigo}</strong>?
            </>
          ),
          mensagemSucesso: (
            <>
              Mesa <strong>{codigo}</strong> excluída com sucesso
            </>
          ),
          mensagemErro: (
            <>
              Não foi possível excluir a mesa <strong>{codigo}</strong>
            </>
          ),
        }}
        dados={() => ({
          codigo,
          quantidade_lugares: quantidadeLugares,
          descricao,
        })}
        confSalvar={{
          mensagemSucesso: (
            <>
              Mesa <strong>{codigo}</strong> salva com sucesso
            </>
          ),
          mensagemErro: (
            <>
              Não foi possível salvar a mesa <strong>{codigo}</strong>
            </>
          ),
        }}
      />

      <div className="row">
        <div className="col-12 mb-3">
          <label className="form-label">
            Código <i className="text-danger">*</i>
          </label>
          <input
            ref={txtCodigo}
            type="text"
            maxLength={12}
            className="form-control"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            onBlur={(e) =>
              validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])
            }
          />
          <div className="invalid-feedback" />
        </div>

        <div className="col-12 mb-3">
          <label className="form-label">
            Lugares <i className="text-danger">*</i>
          </label>
          <input
            ref={txtLugares}
            type="text"
            maxLength={2}
            className="form-control"
            value={quantidadeLugares}
            onChange={(e) =>
              setQuantidadeLugares(e.target.value.replace(/\D/g, ""))
            }
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
