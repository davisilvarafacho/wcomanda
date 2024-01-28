import { useNavigate } from "react-router-dom";
import { BsPrinterFill, BsArrowLeft } from "react-icons/bs";

import { HeaderRelatorio } from "components/Relatorios/Header";
import { FooterRelatorio } from "components/Relatorios/Footer";

export function SkeletonRelatorio({ children, titulo }) {
  const navigate = useNavigate();

  return (
    <div /* style={{ backgroundColor: '#fff' }} */ className="w-100 print pb-5">
      <div className="w-100 d-flex justify-content-between mb-4 no-print">
        <button
          className="btn d-flex align-items-center gap-2"
          onClick={() => {
            navigate(-1); // navigate('/relatorios/');
          }}
        >
          <BsArrowLeft /> Voltar
        </button>
        <button
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={() => {
            print();
          }}
        >
          <BsPrinterFill /> Imprimir
        </button>
      </div>

      <hr className="no-print" />

      <HeaderRelatorio titulo={titulo} />
      <div className="table-responsive">{children}</div>
      <FooterRelatorio />
    </div>
  );
}
