import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { BsPlusLg } from 'react-icons/bs';

import { HeaderForm } from 'components/HeaderForm';
import { GridItens } from 'components/GridItens';
import { InputID } from 'components/InputID';
import { useValidacoes } from 'hooks/useValidacoes';
import { useBackend } from 'hooks/useBackend';
import { REGEX_CAMPO_PREENCHIDO } from 'constants/regexs';
import { endpoints } from 'constants/endpoints';
import { TitutloForm } from 'components/TitutloForm';
import { hasAnyInvalidation } from 'utils/invalidations';

export function GarconsForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { pathname } = useLocation();
    const queryClient = useQueryClient();

    const { validar, validarExpressao } = useValidacoes();
    const { obterRegistro, obterRegistroPorFiltragem, salvarRegistro } = useBackend(endpoints.categorias);

    // form
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');

    const form = useRef(null);

    const txtNome = useRef(null);
    const txtPreco = useRef(null);
    const txtDescricao = useRef(null);

    function carregarDados() {
        setNome(data.nome);
        setPreco(data.preco);
        setDescricao(data.observacao);
    }

    function validacoes() {
        validar(txtNome.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
        validar(txtPreco.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
        return !form.current.querySelector('.is-invalid');
    }

    useEffect(() => {
        isSuccess && carregarDados();
    }, [isLoading, isRefetching]);

    return (
        <div ref={form} className="text-dark">
            <HeaderForm
                titulo={nome || 'Novo'}
                subtitulo={'categoria'}
                validacoes={validacoes}
                endpoint={endpoints.categorias}
                form={form}
                confExclusao={{
                    titulo: 'Excluir Categoria',
                    texto: (
                        <>
                            Deseja mesmo excluir a categoria <strong>{nome}</strong>?
                        </>
                    ),
                    mensagemSucesso: (
                        <>
                            Categoria <strong>{nome}</strong> excluído com sucesso
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
                            Não foi possível salvar o categoria <strong>{nome}</strong>
                        </>
                    ),
                }}
            />

            <div className="row">
                <TitutloForm />

                <div className="col-12 col-md-6">
                    <label className="form-label">Nome <i className="text-danger">*</i></label>
                    <input type="text" maxLength={50} className="form-control" value={nome} onChange={e => setNome(e.target.value)} />
                </div>

                <div className="col-12 col-md-6">
                    <label className="form-label">Preço <i className="text-danger">*</i></label>
                    <input type="number" className="form-control" value={preco} onChange={e => setPreco(e.target.value)} />
                </div>

                <div className="col-12 col-md-6">
                    <label className="form-label">Descrição <i className="text-danger">*</i></label>
                    <textarea ref={txtDescricao} maxLength={700} className="form-control" value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>
            </div>

        </div>
    );
}
