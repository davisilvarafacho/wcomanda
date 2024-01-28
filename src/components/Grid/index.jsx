import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { BsArrowLeft, BsArrowRight, BsSearch } from "react-icons/bs";
import { useBackend } from "hooks/useBackend";

export function Grid({
  titulo,
  endpoint,
  filtros,
  display,
  filtrosListagem = {},
  Form,
}) {
  const [id, setId] = useState(null);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [filtro, setFiltro] = useState(""); // const [filtro, setFiltro] = useState(filtros[0].titulo + ": ");
  const [parametrosFiltro, setParametrosFiltro] = useState({
    page: paginaAtual,
    ...filtrosListagem,
  });

  const confFiltroDefault = useMemo(
    () => filtros.find((item) => item.default === true),
    []
  );

  const { listarRegistros, salvarRegistro } = useBackend(endpoint);

  const { data, isSuccess, isLoading } = useQuery(
    [endpoint, endpoint + "?page=" + paginaAtual, parametrosFiltro],
    () => listarRegistros(parametrosFiltro)
  );

  const { mutate: ativarInativar } = useMutation(
    () => salvarRegistro({ ativo: "S" }),
    {
      onSuccess: () => {
        toast.success("Registro ativado com sucesso!");
        filtrarRegistros();
      },
      onError: () => {
        toast.error("Erro ao ativar registro!");
      },
    }
  );

  function filtrarRegistros(pagina = paginaAtual) {
    const valorInputSeparado = filtro.split(":").reverse();
    const [conteudoFiltro, tituloFiltro] = valorInputSeparado;
    let confFiltro = null;

    if (!tituloFiltro) {
      confFiltro = filtros.find((item) => item.default === true);
    } else {
      confFiltro =
        filtros.find((item) => item.titulo === tituloFiltro) ??
        confFiltroDefault;
    }

    const novoFiltro = {
      page: pagina,
      [confFiltro.urlParam]: conteudoFiltro.trim(),
    };

    setParametrosFiltro(novoFiltro);
  }

  useEffect(() => {
    if (isSuccess) {
      const REGISTRO_POR_PAGINA = 15;
      const divisao = data.total_registros / REGISTRO_POR_PAGINA;
      setTotalPaginas(
        Number.isInteger(divisao) ? divisao || 1 : parseInt(divisao) + 1
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    document.title = "wCommanda | " + titulo;
  }, []);

  return (
    <div className="w-100">
      <div className="row">
        <div className="col-lg-4 me-3 px-4 py-2">
          <Form id={id} setId={setId} />
        </div>

        <div className="col-lg-7 border-start mb-2 px-4 py-2">
          {" "}
          {/* <div className="col-lg-7 border-end me-4 pe-4 mb-2"> */}
          {/* <div className="col-12 mb-4">
            <div className="input-group">
              <button
                className="btn btn-sm btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filtros
              </button>
              <ul className="dropdown-menu">
                {filtros.map((filtro) => (
                  <li
                    role="button"
                    key={filtro.titulo + filtro.urlParam}
                    onClick={() => setFiltro(filtro.titulo + ": ")}
                  >
                    <span className="dropdown-item">{filtro.titulo}</span>
                  </li>
                ))}
              </ul>

              <input
                type="text"
                className="form-control form-control-sm"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                onKeyDown={(e) => {
                  e.key === "Enter" && filtrarRegistros();
                }}
              />

              <button
                className="btn btn-sm btn-primary"
                onClick={() => filtrarRegistros()}
              >
                <BsSearch />
              </button>
            </div>
          </div> */}
          <div className="d-flex col-12 mb-4">
            <input
              type="text"
              className="form-control me-3"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Pesquise pelo nome ou pelo código"
              onKeyDown={(e) => {
                e.key === "Enter" &&
                  filtrarRegistros(filtro !== "" ? 1 : paginaAtual);
                filtro !== "" && setPaginaAtual(1);
              }}
            />

            <button
              className="btn  btn-primary"
              onClick={() => {
                filtrarRegistros(filtro !== "" ? 1 : paginaAtual);
                filtro !== "" && setPaginaAtual(1);
              }}
            >
              <BsSearch />
            </button>
          </div>
          <div
            style={{ maxHeight: "590px" }}
            className="row overflow-y-auto gap-3"
          >
            {isLoading ? (
              <div
                style={{ minHeight: "590px" }}
                className="col-12 d-flex justify-content-center align-items-center"
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : null}

            {isSuccess
              ? data.resultados.map((data) => display(data, setId))
              : null}
          </div>
          <div className="w-100 d-flex justify-content-between gap-1 mb-3 mt-4">
            <button
              className="d-flex align-items-center btn btn-primary"
              onClick={() => {
                if (paginaAtual === 1) {
                  toast.warn("Você está na primeira página");
                  return;
                }

                setParametrosFiltro((p) => ({ ...p, page: paginaAtual - 1 }));
                setPaginaAtual((p) => p - 1);
              }}
            >
              <BsArrowLeft />
            </button>

            <div className="d-flex align-items-center gap-3">
              <span>
                Página {paginaAtual} de {totalPaginas}
              </span>
            </div>

            <button
              className="d-flex align-items-center btn btn-primary"
              onClick={() => {
                if (paginaAtual === totalPaginas) {
                  toast.warn("Você está na última página");
                  return;
                }

                setParametrosFiltro((p) => ({ ...p, page: paginaAtual + 1 }));
                setPaginaAtual((p) => p + 1);
              }}
            >
              <BsArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
