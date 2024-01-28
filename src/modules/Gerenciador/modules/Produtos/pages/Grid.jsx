import { Grid } from "components/Grid";
import { FormProdutos } from "./Form";
import { endpoints } from "constants/endpoints";
import { BsPencilSquare } from "react-icons/bs";

export function GridProdutos() {
  return (
    <Grid
      titulo="Produtos"
      Form={FormProdutos}
      display={(produto, setId) => (
        <div key={produto.id + produto.nome} className="col-12">
          <div className="card" title={produto.descricao}>
            <div className="card-body">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <h6>
                  {produto.ativo === "S" ? (
                    <span className="badge bg-primary me-2">Ativo</span>
                  ) : (
                    <span className="badge bg-danger me-2">Inativo</span>
                  )}
                  {produto.nome}
                </h6>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="me-4">{produto.preco.toReal()}</span>
                  <div>
                    <button
                      className="btn"
                      onClick={() => {
                        setId(produto.id);
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
      endpoint={endpoints.produtos}
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
