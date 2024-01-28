import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  BsBoxSeamFill,
  BsReverseListColumnsReverse,
  BsFillCartFill,
} from "react-icons/bs";

import { RelatorioProdutos } from "./Produtos";
import { RelatorioFluxoCaixa } from "./FluxoCaixa";

export function HomeRelatorios() {
  const relatorios = useRef(null);
  const navigate = useNavigate();

  return (
    <div>
      <div className="row no-print">
        <motion.div
          role="button"
          whileHover={{ scale: 1.02 }}
          className="col-md-6 col-lg-4 col-xl-3 mb-3"
        >
          <div className="card rounded">
            <div
              className="card-body rounded bg-primary text-light"
              onClick={() => navigate("fluxo-caixa/")}
            >
              <div className="d-flex align-items-center gap-2">
                <BsReverseListColumnsReverse /> Fluxo de Caixa
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          role="button"
          whileHover={{ scale: 1.02 }}
          className="col-md-6 col-lg-4 col-xl-3 mb-3"
        >
          <div className="card rounded">
            <div
              className="card-body rounded bg-primary text-light"
              onClick={() => navigate("produtos/")}
            >
              <div className="d-flex align-items-center gap-2">
                <BsBoxSeamFill /> Produtos
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
