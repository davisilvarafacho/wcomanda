import { Grid } from 'components/Grid';
import { endpoints } from 'constants/endpoints';

export function GarconsGrid() {
  return (
    <div>
      <Grid
        titulo="Garçons"
        endpoint={endpoints.garcons}
        filtros={[
          {
            default: true,
            titulo: 'Nome',
            urlParam: 'nome',
          },
        ]}
        configuracoes={[
          {
            titulo: 'Nome',
            chaveApi: 'nome',
          },
          {
            titulo: 'Descrição',
            chaveApi: 'descricao',
          },
        ]}
      />
    </div>
  );
}
