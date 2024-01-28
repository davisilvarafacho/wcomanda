import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { MdOutlineTableRestaurant } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { BsBoxSeamFill } from "react-icons/bs";

export function HomeCadastros() {
  const navigate = useNavigate();
  return (
    <div>
      {/* menus + dasbhoards + componentes legais de visualização dos dados e informação */}

      <div className="w-100">
        <div className="row">
          <motion.div
            role="button"
            whileHover={{ scale: 1.04 }}
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

          <motion.div
            role="button"
            whileHover={{ scale: 1.04 }}
            className="col-md-6 col-lg-4 col-xl-3 mb-3"
          >
            <div className="card rounded">
              <div
                className="card-body rounded bg-primary text-light"
                onClick={() => navigate("categorias/")}
              >
                <div className="d-flex align-items-center gap-2">
                  <BiSolidCategory /> Categorias
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            role="button"
            whileHover={{ scale: 1.04 }}
            className="col-md-6 col-lg-4 col-xl-3 mb-3"
          >
            <div className="card rounded">
              <div
                className="card-body rounded bg-primary text-light"
                onClick={() => navigate("mesas/")}
              >
                <div className="d-flex align-items-center gap-2">
                  <MdOutlineTableRestaurant size={22} /> Mesas
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
