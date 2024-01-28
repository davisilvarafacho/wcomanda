export function dinamicObjAcessor(obj, path) {
  if (!path) return obj;
  const properties = path.split('.');
  return dinamicObjAcessor(obj[properties.shift()], properties.join('.'));
}
