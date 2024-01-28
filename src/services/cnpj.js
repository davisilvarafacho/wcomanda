import axios from 'axios';

export const cnpjService = axios.create({
  baseURL: 'https://api.cnpja.com/office/',
  headers: {
    Authorization: 'dd7a7b1c-9ae3-4311-9376-52966da1aedf-d026c0e7-c1c8-4424-9855-d63b37a90961', // criar uma para o sistemas rafacho
  },
});
