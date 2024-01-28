import { GridComandas } from "../components/GridComandas";
import { GridItensFinalizados } from "../components/GridItensFinalizados";
import { GridMesas } from "../components/GridMesas";

export function HomePainel() {
  return (
    <div id="content">
      <div className="row">
        <div className="d-flex flex-column col-lg-5 col-xl-3 d-none d-lg-block">
          <GridItensFinalizados />

          <div className="my-5" />

          <GridMesas />
        </div>

        <div className="col-lg-7 col-xl-9">
          <GridComandas />
        </div>
      </div>
    </div>
  );
}
