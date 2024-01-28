import { FormCategorias } from "./Form";
import { Grid } from "components/Grid";
import { endpoints } from "constants/endpoints";
import { BsPencilSquare } from "react-icons/bs";

export function GridCategorias() {
  return (
    <Grid
      titulo="Categorias"
      endpoint={endpoints.categorias}
      Form={FormCategorias}
      display={(categoria, setId) => (
        <div key={categoria.id + categoria.nome} className="col-12">
          <div className="card" title={categoria.descricao}>
            <div className="card-body">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <h6>
                  {categoria.ativo === "S" ? (
                    <span className="badge bg-primary me-2">Ativo</span>
                  ) : (
                    <span className="badge bg-danger me-2">Inativo</span>
                  )}
                  {categoria.nome}
                </h6>

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <button
                      className="btn"
                      onClick={() => {
                        setId(categoria.id);
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
