import { useState, useEffect, useRef, useMemo } from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import { useBackend } from 'hooks/useBackend';
import { useDebounce } from 'hooks/useDebounce';
import { endpoints } from 'constants/endpoints';

const configuracoesModulos = {
  PRODUTOS: {
    titulo: 'Produtos',
    endpoint: endpoints.produtos,
    chaves: {
      titulo: 'nome',
      subtitulo: 'id',
    },
    filtros: {},
  },
  CATEGORIAS: {
    titulo: 'Categorias',
    endpoint: endpoints.categorias,
    chaves: {
      titulo: 'nome',
      subtitulo: 'id',
    },
    filtros: {},
  },
  CLIENTES: {
    titulo: 'Clientes',
    endpoint: endpoints.clientes,
    chaves: {
      titulo: 'nome',
      subtitulo: 'id',
    },
    filtros: {},
  },
  INGREDIENTES: {
    titulo: 'Ingredientes',
    endpoint: endpoints.ingredientes,
    chaves: {
      titulo: 'id',
      subtitulo: 'id',
    },
    filtros: {},
  },
};

export function InputID({ modulo, setID, inputProps, state, filtros = {}, validacoes = (input) => {}, onClick = (input) => {}, onClear = () => {} }) {
  const conf = useMemo(() => configuracoesModulos[modulo], []);

  const [valor, setValor] = useState(state || '');
  const [preenchido, setPreenchido] = useState(!state);

  const [dados, setDados] = useState([]);
  const [totalRegistros, setTotalRegistros] = useState('0');
  const [loading, setLoading] = useState(false);

  const inputRef = inputProps ? inputProps.ref ?? useRef() : useRef();
  const valorDebounced = useDebounce(valor);

  const { listarRegistros } = useBackend(conf.endpoint);

  async function loadData() {
    setLoading(true);
    await listarRegistros({ search: valorDebounced, ...filtros }).then((dados) => {
      setDados(dados.resultados);
      setTotalRegistros(dados.total);
    });
    setLoading(false);
  }

  useEffect(() => {
    /* valorDebounced && */ !preenchido && loadData();
  }, [valorDebounced]);

  useEffect(() => {
    setValor(state);
    setPreenchido(!!state);
  }, [state]);

  return (
    <>
      <div className="position-relative">
        <button
          className="btn position-absolute left-0 clear"
          header-form-control="off"
          tabIndex={-1}
          onClick={async () => {
            setID(null);
            setValor('');
            setPreenchido(false);
            validacoes && (await validacoes(inputRef.current));
            onClear(inputRef.current);
            loadData();
          }}
        >
          {preenchido ? <BsX /> : <BsSearch />}
        </button>

        <input
          {...(inputProps && inputProps)}
          ref={inputRef}
          type="text"
          className={`form-control px-5 input ${preenchido && 'no-caret'}`}
          data-bs-toggle="dropdown"
          value={valor}
          onClick={() => !preenchido && loadData()} // onClick={() => !dados.length && loadData()}
          onBlur={(e) => validacoes && validacoes(e.target)}
          onChange={(e) => !preenchido && setValor(e.target.value)}
        />

        <div className="invalid-feedback" />

        <ul style={{ maxHeight: '400px', minWidth: '300px' }} className={`dropdown-menu overflow-auto ${preenchido && 'd-none'}`}>
          <li className="d-flex justify-content-end">
            <span className="w-100 dropdown-header fw-bold">{conf.titulo}</span>
            <span className="dropdown-header">Total: {totalRegistros}</span>
          </li>
          {
            /* isLoading || isRefetching && */ loading ? (
              <>
                <li className="d-flex justify-content-center p-2">
                  <div className="spinner-border text-primary" role="status" />
                </li>
                <li className="d-flex justify-content-center p-2" />
              </>
            ) : dados.length ? (
              dados.map((dado) => (
                <li
                  key={dado.id}
                  role="button"
                  onClick={async (e) => {
                    await setValor(`${dado[conf.chaves.subtitulo]} - ${dado[conf.chaves.titulo]}`);
                    await setID(dado.id);
                    await setPreenchido(true);
                    await onClick(dado, `${dado[conf.chaves.subtitulo]} - ${dado[conf.chaves.titulo]}`, inputRef.current);
                    validacoes && (await validacoes(inputRef.current));
                  }}
                >
                  <ul className="list-group cursor-pointer fs-7 px-3 mb-1">
                    <li className="dropdown-item list-group-item d-flex justify-content-between align-items-start">
                      <div className="ms-2 me-auto pe-3 mw-100">
                        <div className="text-truncate text-muted">{dado[conf.chaves.subtitulo]}</div>
                        <span className="">{dado[conf.chaves.titulo]}</span>
                      </div>
                    </li>
                  </ul>
                </li>
              ))
            ) : (
              <h6 className="text-center text-muted mt-4 mx-4 mb-3">Não há resultados...</h6>
            )
          }
        </ul>
      </div>
    </>
  );
}
