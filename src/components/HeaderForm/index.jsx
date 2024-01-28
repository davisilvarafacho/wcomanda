import { useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  BsTrashFill,
  BsArrowReturnLeft,
  BsCheck2All,
  BsPencilSquare,
  BsXCircle,
  BsX,
  BsTrash,
} from "react-icons/bs";
import bootstrapBundleMin from "bootstrap/dist/js/bootstrap.bundle.min";

import { useBackend } from "hooks/useBackend";
import { hideModal, showModal } from "common/bootstrapActions";
import { sessionKeys } from "constants/session";

export function HeaderForm(props) {
  const {
    titulo,
    endpoint,
    validacoes,
    dados,
    confSalvar,
    confExclusao,
    form,
    limparForm,
    id = null,
    codigo = null,
  } = props;

  const modalExclusao = useRef();
  const queryClient = useQueryClient();

  const { salvarRegistro, excluirRegistro } = useBackend(endpoint);

  const { mutate: salvar } = useMutation(
    () =>
      salvarRegistro(
        { licenca: sessionStorage.getItem(sessionKeys.licencaUsuario), ...dados() },
        id ? "patch" : "post",
        id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([endpoint]);
        queryClient.invalidateQueries([endpoint, id]);
        toast.success(confSalvar.mensagemSucesso);
        limparForm();
      },
      onError: () => toast.warn(confSalvar.mensagemErro),
    }
  );

  const { mutate: excluir } = useMutation(() => excluirRegistro(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([endpoint]);
      queryClient.removeQueries([endpoint, id]);

      hideModal(modalExclusao.current);

      toast.success(confExclusao.mensagemSucesso);
      limparForm();
    },
    onError: (err) => {
      toast.warn(confExclusao.mensagemErro);
    },
  });

  return (
    <div>
      <div className="my-2">
        <div className="d-flex justify-content-between align-items-center">
          <h6>
            {titulo} | {codigo ?? "Novo"}
          </h6>

          <div className="d-flex justify-content-end gap-2 w-50">
            <button
              className="btn btn-sm btn-primary"
              header-form-control="off"
              onClick={async () => {
                (await validacoes()) &&
                  !form.current.querySelector(".is-invalid") &&
                  salvar();
              }}
            >
              <BsCheck2All size={18} className="me-1" />
            </button>

            <button
              className="btn btn-sm btn-warning"
              header-form-control="off"
              onClick={async () => {
                limparForm();
              }}
            >
              <BsX />
            </button>

            <button
              className="btn btn-sm btn-danger"
              header-form-control="off"
              disabled={!id}
              onClick={async () => {
                showModal(modalExclusao.current);
              }}
            >
              <BsTrash />
            </button>
          </div>
        </div>
      </div>

      <hr />

      <div
        ref={modalExclusao}
        className="modal fade"
        id="modalExclusao"
        tabIndex={-1}
        aria-labelledby="modalExclusaoLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalExclusaoLabel">
                {confExclusao.titulo}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">{confExclusao.texto}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => excluir()}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
