import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="w-100 bg-primary no-print">
      <div className="w-100 border-bottom py-2 ps-3">
        <Link to={"/home/"}>
          <span className="fw-bold text-light h5 mb-0 p-0">w</span>
          <span className="fw-bold text-light h5 mb-0 p-0">Commanda</span>
        </Link>
      </div>

      <div className="w-100 shadow-sm bg-primary rounded-bottom d-flex justify-content-between py-2 px-3">
        <div>
          <motion.div
            role="button"
            whileHover={{ scale: 1.1 }}
            className="mx-2 badge bg-success text-primary fw-bold"
            onClick={() => navigate("/home/")}
          >
            Home
          </motion.div>

          <motion.div
            role="button"
            whileHover={{ scale: 1.1 }}
            className="mx-2 badge bg-success text-primary fw-bold"
            onClick={() => navigate("/pedidos/")}
          >
            Pedidos
          </motion.div>

          <motion.div
            role="button"
            whileHover={{ scale: 1.1 }}
            className="mx-2 badge bg-success text-primary fw-bold"
            onClick={() => navigate("/analytics/")}
          >
            Analytics
          </motion.div>

          <motion.div
            role="button"
            whileHover={{ scale: 1.1 }}
            className="mx-2 badge bg-success text-primary fw-bold"
            onClick={() => navigate("/cadastros/")}
          >
            Cadastros
          </motion.div>

          <motion.div
            role="button"
            whileHover={{ scale: 1.1 }}
            className="mx-2 badge bg-success text-primary fw-bold"
            onClick={() => navigate("/relatorios/")}
          >
            Relatórios
          </motion.div>

          {/* <motion.div role="button" whileHover={{ scale: 1.1 }} className="mx-2 badge bg-success fw-normal" onClick={() => navigate('/produtos/')}>
            Produtos
          </motion.div>

          <motion.div role="button" whileHover={{ scale: 1.1 }} className="mx-2 badge bg-success fw-normal" onClick={() => navigate('/mesas/')}>
            Mesas
          </motion.div>

          <motion.div role="button" whileHover={{ scale: 1.1 }} className="mx-2 badge bg-success fw-normal" onClick={() => navigate('/relatorios/')}>
            Relatórios
          </motion.div>

          <motion.div role="button" whileHover={{ scale: 1.1 }} className="mx-2 badge bg-success fw-normal" onClick={() => navigate('/garcons/')}>
            Garçons
          </motion.div>

          <motion.div role="button" whileHover={{ scale: 1.1 }} className="mx-2 badge bg-success fw-normal" onClick={() => navigate('/usuarios/')}>
            Usuários
          </motion.div>

          <motion.div role="button" whileHover={{ scale: 1.1 }} className="mx-2 badge bg-success fw-normal" onClick={() => navigate('/configuracoes/')}>
            Configurações
          </motion.div> */}
        </div>
      </div>
    </div>
  );
}
