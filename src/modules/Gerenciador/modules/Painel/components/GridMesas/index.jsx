import { useState } from "react";
import { useQuery } from "react-query";

import { useBackend } from "hooks/useBackend";
import { endpoints } from "constants/endpoints";

export function GridMesas() {
  const [statusMesasGrid, setStatusMesasGrid] = useState("T");

  const statusMesasGridMap = {
    T: "Todas",
    L: "Livres",
    O: "Ocupadas",
  };

  const { listarRegistros } = useBackend(endpoints.mesas);

  const { data, isLoading, isSuccess } = useQuery(
    [endpoints.mesas, "all", statusMesasGrid],
    () =>
      listarRegistros({
        size: "all",
        ...(statusMesasGrid !== "T" ? { status: statusMesasGrid } : {}),
      })
  );

  return (
    <div className="col-12">
      <div className="d-flex justify-content-between">
        <h4 className="d-flex">
          <span className="me-2">Mesas</span>
          <div className="dropdown">
            <span
              className="dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              | {statusMesasGridMap[statusMesasGrid]}
            </span>

            <ul className="dropdown-menu">
              <li
                role="button"
                className="dropdown-item"
                onClick={() => {
                  setStatusMesasGrid("T");
                }}
              >
                Todas
              </li>
              <li
                role="button"
                className="dropdown-item"
                onClick={() => {
                  setStatusMesasGrid("L");
                }}
              >
                Livres
              </li>
              <li
                role="button"
                className="dropdown-item"
                onClick={() => {
                  setStatusMesasGrid("O");
                }}
              >
                Ocupadas
              </li>
            </ul>
          </div>
        </h4>
      </div>
      <hr />

      <div className="row overflow-y-auto mt-4">
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="col-12 mb-3">
                <div className="card user-select-none">
                  <div className="card-body placeholder-glow">
                    <h6 className="card-title d-flex justify-content-between">
                      <b className="placeholder">{"codigo"}</b>
                      <div>
                        <span className="badge bg-primary text-primary placeholder">
                          {"LIVRE"}
                        </span>
                      </div>
                    </h6>
                    <div className="card-text">
                      <div className="d-flex justify-content-between">
                        <span className="placeholder">lugares</span>
                        <span className="placeholder">1234</span>
                      </div>

                      <div></div>
                    </div>

                    {/* <button
                className="btn btn-sm btn-primary w-100 mt-4"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapseMesa${'mesa.id'}`}
                aria-expanded="false"
                aria-controls={`collapseMesa${'mesa.id'}`}
              >
                <BsArrowDown />
              </button> */}

                    <div
                      className="collapse mt-3"
                      id={`collapseMesa${"mesa.id"}`}
                    >
                      <div className="card card-body">
                        <b>Comandas</b>
                        <ul className="mt-3">
                          <li>1</li>
                          <li>2</li>
                          <li>3</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
        {isSuccess ? (
          data.resultados.length === 0 ? (
            <p className="text-muted">Nenhuma mesa foi cadastrada...</p>
          ) : (
            data.resultados.map((mesa) => (
              <div key={mesa.id + mesa.codigo} className="col-12 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title d-flex justify-content-between">
                      <b>{mesa.codigo}</b>
                      <div>
                        <span
                          className={`badge ${
                            mesa.ocupada == "S" ? "bg-danger" : "bg-primary"
                          }`}
                        >
                          {mesa.ocupada == "S" ? "OCUPADA" : "LIVRE"}
                        </span>
                        {/* {mesa.ocupada == "S" ? "OCUPADA" : "LIVRE"} */}
                      </div>
                    </h6>
                    <div className="card-text">
                      <div className="d-flex justify-content-between">
                        <span>lugares</span>{" "}
                        <span>{mesa.quantidade_lugares}</span>
                      </div>

                      <div>
                        {/* comandas: {"mesa.comandas.length"} */}
                        {/* se apenas uma linkar para uma tela que terá ela direto */}
                      </div>
                    </div>

                    {/* <button
                      className="btn btn-sm btn-primary w-100 mt-4"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapseMesa${mesa.id}`}
                      aria-expanded="false"
                      aria-controls={`collapseMesa${mesa.id}`}
                    >
                      <BsArrowDown />
                    </button> */}

                    <div
                      className="collapse mt-3"
                      id={`collapseMesa${mesa.id}`}
                    >
                      <div className="card card-body">
                        <b>Comandas</b>
                        <ul className="mt-3">
                          <li>1</li>
                          <li>2</li>
                          <li>3</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : null}

        {/* ordernar pelas mesas ocupadas */}
      </div>
    </div>
  );
}
