import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs';

import { useBackend } from 'hooks/useBackend';
import { hideModal, showModal } from 'common/bootstrapActions';
import { dinamicObjAcessor } from 'utils/dinamicObjAcessor';

export function GridItens({
  configuracoes,
  endpoint,
  querys,
  onEdit,
  checkboxOn = false,
  filtros = {},
  search = null,
  exclusao = {
    titulo: 'Excluir Item',
    mensagem: 'Deseja realmente excluir esse item?',
    mensagemToastSuccess: 'Item removido com sucesso',
    mensagemToastError: 'Não foi possível remover esse item',
    callback: () => {},
  },
  ativo = true,
}) {
  const [_id] = useState((Math.random() * 100).toFixed(0));
  const [idExclusao, setIdExclusao] = useState(null);

  const { listarRegistros, excluirRegistro } = useBackend(endpoint);

  const queryClient = useQueryClient();
  const { data: itens, isSuccess: isSuccessItens, isLoading: isLoadingItens } = useQuery(querys, () => listarRegistros(filtros), { enabled: ativo });
  const { mutate: excluir, isSuccess: isSuccessExcluir } = useMutation(() => excluirRegistro(idExclusao), {
    onSuccess: () => {
      toast.success(exclusao.mensagemToastSuccess);
      queryClient.invalidateQueries(querys);
      hideModal(`modalExclusaoItem${_id}`);
    },
    onError: (error) => {
      toast.error(exclusao.mensagemToastError);
    },
  });

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            {configuracoes.map((conf) => (
              <th {...(conf.combinedProps && conf.combinedProps)} {...(conf.thProps && conf.thProps)} key={endpoint + conf.titulo}>
                {conf.titulo}
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {isSuccessItens
            ? itens.resultados.map((item) => (
                <tr key={endpoint + item.id}>
                  {configuracoes.map((conf) => (
                    <td {...(conf.tdProps && conf.tdProps)} key={endpoint + conf.chaveApi + item.id}>
                      {conf.render ? conf.render(item) : conf.chaveApi.match('.') ? dinamicObjAcessor(item, conf.chaveApi) : item[conf.chaveApi]}
                    </td>
                  ))}
                  <td
                    role="button"
                    onClick={() => {
                      setIdExclusao(item.id);
                      showModal(`modalExclusaoItem${_id}`);
                    }}
                  >
                    <BsTrash />
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>

      <div className="modal fade" id={`modalExclusaoItem${_id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">{exclusao.tituloModal}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">{exclusao.mensagemModal}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  excluir();
                  exclusao.callback && exclusao.callback();
                }}
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
