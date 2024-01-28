import { REGEX_CAMPO_PREENCHIDO } from "constants/regexs";

export function useValidacoes() {
  function validar(input, validacoes) {
    for (let conf of validacoes) {
      if (!conf.regex.test(input.value)) {
        input.classList.add("is-invalid");
        input.parentNode.querySelector(".invalid-feedback").textContent =
          conf.texto ?? "Este campo é obrigatório";
        break;
      } else {
        input.classList.remove("is-invalid");
        input.parentNode.querySelector(".invalid-feedback").textContent = "";
      }
    }
  }

  function validarExpressao(input, expressao, textoInvalidacao) {
    if (!expressao) {
      input.classList.add("is-invalid");
      input.parentNode.querySelector(".invalid-feedback").textContent =
        textoInvalidacao;
    } else {
      input.classList.remove("is-invalid");
      input.parentNode.querySelector(".invalid-feedback").textContent = "";
    }
  }

  function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, "");
    // cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == "") return false;

    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999"
    )
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
  }

  function validarCPF(cpf) {
    if (cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9, 10].forEach((j) => {
      var soma = 0,
        r;
      cpf
        .split(/(?=)/)
        .splice(0, j)
        .forEach(function (e, i) {
          soma += parseInt(e) * (j + 2 - (i + 1));
        });
      r = soma % 11;
      r = r < 2 ? 0 : 11 - r;
      if (r != cpf.substring(j, j + 1)) result = false;
    });
    return result;
  }

  function removerInvalidacao(input) {
    input.classList.remove("is-invalid");
    input.parentNode.querySelector(".invalid-feedback").textContent = "";
  }

  function validacaoGenerica(content) {
    let contentIsValid = true;
    content.current.querySelectorAll("input").forEach((input) => {
      if (input.getAttribute("required"))
        validar(input, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
      if (contentIsValid && input.classList.contains("is-invalid")) contentIsValid = false;
    });

    return contentIsValid;
  }

  function validacaoMassiva(
    inputs,
    validacoes = [{ regex: REGEX_CAMPO_PREENCHIDO }]
  ) {
    let inputsAreValid = true;
    for (const input of inputs) {
      validar(input, validacoes);
      if (inputsAreValid && input.classList.contains("is-invalid")) inputsAreValid = false;
    }

    return inputsAreValid;
  }

  return {
    validar,
    validarExpressao,
    validarCNPJ,
    validarCPF,
    removerInvalidacao,
    validacaoGenerica,
    validacaoMassiva,
  };
}
