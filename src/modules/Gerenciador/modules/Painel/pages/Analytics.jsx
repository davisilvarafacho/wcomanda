import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

export function Analytics() {
  // pie
  const dataPie = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Vendas por vendedores || Especialidades que representam mais dos orçamentos',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // area
  const optionsArea = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vendas por mês',
      },
    },
  };

  const labelsArea = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const dataArea = {
    labels: labelsArea,
    datasets: [
      {
        fill: true,
        label: 'Faturamento(R$)',
        data: [120, 120, 120, 120, 120, 120, 120],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Faturamento Mensal',
      },
    },
  };

  const labelsBar = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const dataBar = {
    labels: labelsBar,
    datasets: [
      {
        label: 'Dataset 1',
        data: [120, 120, 120, 120, 120, 120, 120],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [120, 120, 120, 120, 120, 120, 120],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // fazer com que ele possa escolher as analytics que
  // ele quer ver, e a partir disso, montar o dashboard
  return (
    <div className='pb-5'>
      <div className="row">
        <div className="col-6 col-lg-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h6 className="text-end">Total vendido</h6>
              <div className="text-end">R$ 74,557.34</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h6 className="text-end">Itens feitos</h6>
              <div className="text-end">42</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h6 className="text-end">Item/h</h6>
              <div className="text-end">22</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h6 className="text-end">Pedidos pela comanda externa</h6>
              <div className="text-end">17</div>
            </div>
          </div>
        </div>
      </div>

      <div className="1d-none 1d-lg-block row">
        <div className="col-8 mb-2">
          <div className="card p-3">
            <Line options={optionsArea} data={dataArea} />
          </div>
        </div>

        <div className="col-4 mb-2">
          <div className="card h-100 p-3">
            <Pie data={dataPie} />
          </div>
        </div>

        <div className="col-12 mb-2">
          <div className="card w-100 p-3">
            <Bar options={optionsBar} data={dataBar} />
          </div>
        </div>
      </div>
    </div>
  );
}