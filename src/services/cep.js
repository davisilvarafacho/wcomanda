import axios from "axios";

export function cepService(cep) {
  return axios.create({
    baseURL: `https://viacep.com.br/ws/${cep}/json/`,
  });
}
