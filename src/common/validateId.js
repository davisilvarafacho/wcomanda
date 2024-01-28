import { backend } from 'services/backend';

/**
 * Checka se o dado id existe no endpoint referido (e.g. /users/1/).
 * @param {string} id id do objeto a ser validado
 * @param {string} endpoint endpoint da api a ser consultada
 * @returns {boolean} true se o id for válido, false caso contrário
 */
export async function validateId(id, endpoint) {
  return await backend.get(`${endpoint}/${id}/`).then((res) => true).catch((err) => false);
}
