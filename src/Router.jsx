import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { Navbar } from "modules/Gerenciador/components/Navbar";
import { HomePainel } from "modules/Gerenciador/modules/Painel/pages/Home";

import { Login } from "modules/Gerenciador/modules/Auth/pages/Login";

import { HomeCadastros } from "modules/Gerenciador/modules/Cadastros/pages/Home";
import { GridProdutos } from "modules/Gerenciador/modules/Produtos/pages/Grid";
import { GridCategorias } from "modules/Gerenciador/modules/Categorias/pages/Grid";
import { GridMesas } from "modules/Gerenciador/modules/Mesas/pages/Grid";

import { HomeRelatorios } from "modules/Gerenciador/modules/Relatorios/pages/Home";
import { RelatorioProdutos } from "modules/Gerenciador/modules/Relatorios/pages/Produtos";
import { RelatorioFluxoCaixa } from "modules/Gerenciador/modules/Relatorios/pages/FluxoCaixa";
import { PainelPedidos } from "modules/Gerenciador/modules/Pedidos/pages/Painel";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="esqueci-minha-senha/" element={<Login />} />

        <Route
          path="/*"
          element={
            <div className="w-100 vh-100">
              <Navbar />
              <div className="container mt-4">
                <Outlet />
              </div>
            </div>
          }
        >
          <Route path="home" element={<HomePainel />} />

          <Route path="pedidos" element={<PainelPedidos />} />

          <Route path="cadastros" element={<HomeCadastros />} />
          <Route path="cadastros/produtos/" element={<GridProdutos />} />
          <Route path="cadastros/categorias/" element={<GridCategorias />} />
          <Route path="cadastros/mesas/" element={<GridMesas />} />

          <Route path="relatorios" element={<HomeRelatorios />} />
          <Route path="relatorios/produtos/" element={<RelatorioProdutos />} />
          <Route
            path="relatorios/fluxo-caixa/"
            element={<RelatorioFluxoCaixa />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
