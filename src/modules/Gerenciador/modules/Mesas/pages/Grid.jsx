import { FormMesas } from "./Form";
import { Grid } from "components/Grid";
import { endpoints } from "constants/endpoints";
import { BsPencilSquare } from "react-icons/bs";

export function GridMesas() {
  return (
    <Grid
      titulo="Categorias"
      endpoint={endpoints.mesas}
      Form={FormMesas}
      display={(mesa, setId) => (
        <div key={mesa.id + mesa.codigo} className="col-12">
          <div className="card" title={mesa.descricao}>
            <div className="card-body">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <h6>
                  {mesa.ativo === "S" ? (
                    <span className="badge bg-primary me-2">Ativo</span>
                  ) : (
                    <span className="badge bg-danger me-2">Inativo</span>
                  )}
                  {mesa.codigo}
                </h6>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="me-4">
                    {mesa.quantidade_lugares}{" "}
                    {mesa.quantidade_lugares === 1 ? "pessoa" : "pessoas"}
                  </span>
                  <div>
                    <button
                      className="btn"
                      onClick={() => {
                        setId(mesa.id);
                      }}
                    >
                      <BsPencilSquare />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      filtros={[
        {
          default: true,
          titulo: "Nome",
          urlParam: "nome__icontains",
        },
        {
          titulo: "Preço",
          chaveApi: "preco",
        },
        {
          titulo: "Categoria",
          chaveApi: "categoria",
        },
      ]}
      configuracoes={[
        {
          titulo: "Nome",
          chaveApi: "nome",
        },
        {
          titulo: "Preço",
          chaveApi: "preco",
        },
        {
          titulo: "Categoria",
          chaveApi: "categoria",
        },
        {
          titulo: "Descrição",
          chaveApi: "descricao",
        },
      ]}
    />
  );
}
