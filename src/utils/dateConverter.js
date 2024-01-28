export function dateConverter(date, pt_br = true) {
  return pt_br ? new Date(date).toLocaleDateString('pt-br') : new Date(date).toLocaleDateString('en-US');
}
