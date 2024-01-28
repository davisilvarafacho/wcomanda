export function removeInvalidation(inputs) {
  for (const input of inputs) {
    input.classList.remove("is-invalid");
    input.parentNode.querySelector(".invalid-feedback").textContent = "";
  }
}

export function addInvalidation(input, text = "Esse campo é obrigatório") {
  input.classList.add("is-invalid");
  input.parentNode.querySelector(".invalid-feedback").textContent = text;
}

export function isInvalidated(input) {
  return input.classList.contains("is-invalid");
}

export function hasAnyInvalidation(...inputs) {
  return inputs.some((input) => isInvalidated(input));
}
