import { dinamicObjAcessor } from 'utils/dinamicObjAcessor';

export function mapStateToProps(...reducersPath) {
  return function (state) {
    const reducers = {};
    reducersPath.forEach((reducerPath) => 
      reducers[reducerPath] = dinamicObjAcessor(state, reducerPath)
    );
    return reducers;
  };
}
