import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { IMaskInput } from "react-imask";
import { toast } from "react-toastify";

import { useValidacoes } from "hooks/useValidacoes";
import { useBackend } from "hooks/useBackend";
import { REGEX_CAMPO_PREENCHIDO } from "constants/regexs";
import { endpoints } from "constants/endpoints";
import { cepService } from "services/cep";
import { BsCheck2All } from "react-icons/bs";

export function UsuarioForm() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");

  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const form = useRef();

  const txtNome = useRef();
  const txtEmail = useRef();
  const txtCelular = useRef();

  const txtCep = useRef();
  const selectEstado = useRef();
  const txtCidade = useRef();
  const txtBairro = useRef();
  const txtRua = useRef();
  const txtNumero = useRef();

  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { obterRegistro } = useBackend(endpoints.medicos);

  const { data, isSuccess, isLoading, isRefetching } = useQuery(
    [endpoints.medicos, endpoints.medicos + id + "/"],
    () => obterRegistro(id),
    {
      enabled: !pathname.match(/adicionar/),
      refetchOnWindowFocus: false,
    }
  );

  const { validar, validarExpressao, validarCNPJ } = useValidacoes();

  async function requisitarDadosCep() {
    const dadosCEP = await cepService(cep.replace(/\D/g, ""))
      .get("")
      .then((res) => {
        if(res.data.erro) {
          toast.warn('O cep informado não existe')
          return null;
        }

        toast.success(`Os dados do cnpj foram carregados com sucesso`);
        return res.data;
      })
      .catch((err) => {
        toast.warn("Não foi possível carregar os dados do cnpj");
        return null;
      });

    if (!dadosCEP) return;

    setEstado(dadosCEP.uf);
    setBairro(dadosCEP.bairro);
    setCidade(dadosCEP.localidade);
    setRua(dadosCEP.logradouro);
  }

  function carregarDados() {}

  const validacoes = () => {
    return !form.current.querySelector(".is-invalid");
  };

  useEffect(() => {
    isSuccess && carregarDados();
  }, [isLoading, isRefetching]);

  return (
    <div>
      <div ref={form}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <span>Configurações</span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Usuário
              </li>
            </ol>
          </nav>

          <div className="h4 pb-2 mb-4 text-secondary border-bottom border-secondary" />

          <div className="row">
            {/* <div className="col-4 pe-5">
              <h5>Foto de perfil</h5>
              <small className="text-muted">Uma foto que te identifique para os outros usuários e para os nossos funcionários.</small>
            </div>

            <div className="col-8 mb-3">
              <div className="row">
                <div className="col-3">
                  <div style={{ height: '150px' }} className="w-100 border rounded-circle mb-1 d-flex justify-content-center align-items-center text-muted">
                    Sua foto
                  </div>
                </div>

                <div className="col-7 d-flex flex-column gap-3">
                  <input className="form-control form-control-sm" type="file" id="formFile" />

                  <button className="w-50 btn btn-sm btn-danger mb-3">Remover foto</button>
                </div>
              </div>
            </div>

            <hr className="mb-3" /> */}

            <div className="col-4 pe-5">
              <h5>Informações principais</h5>
              <small className="text-muted">
                Dados referentes a sua conta.
              </small>
            </div>

            <div className="col-8">
              <div className="row">
                <div className="row">
                  <div className="col-lg-6">
                    <label className="form-label">
                      Nome <i className="text-danger">*</i>
                    </label>
                    <input
                      ref={txtNome}
                      type="text"
                      maxLength={70}
                      className="form-control"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      onBlur={(e) => {
                        validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                      }}
                    />
                    <div className="invalid-feedback" />
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label">
                      Sobrenome <i className="text-danger">*</i>
                    </label>
                    <input
                      ref={txtCidade}
                      type="text"
                      maxLength={70}
                      className="form-control"
                      value={sobrenome}
                      onChange={(e) => setSobrenome(e.target.value)}
                      onBlur={(e) => {
                        validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                      }}
                    />
                    <div className="invalid-feedback" />
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label">
                      Email <i className="text-danger">*</i>
                    </label>
                    <input
                      ref={txtEmail}
                      type="text"
                      maxLength={70}
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => {
                        validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                      }}
                    />
                    <div className="invalid-feedback" />
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label">
                      Telefone <i className="text-danger">*</i>
                    </label>
                    <IMaskInput
                      mask="(00) 90000-0000"
                      ref={txtCelular}
                      type="text"
                      maxLength={70}
                      className="form-control"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      onBlur={(e) => {
                        validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                      }}
                    />
                    <div className="invalid-feedback" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="mb-3" />

            <div className="col-4 pe-5">
              <h5>Dados de endereço</h5>
              <small className="text-muted">
                Dados referentes a sua localização
              </small>
            </div>

            <div className="col-8">
              <div className="row">
                <div className="col-lg-4 mb-3">
                  <label className="form-label">
                    CEP <i className="text-danger">*</i>
                  </label>
                  <IMaskInput
                    mask="00000-000"
                    ref={txtCep}
                    type="text"
                    className="form-control"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    onBlur={(e) => {
                      validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                      validarExpressao(
                        e.target,
                        cep.length !== 9,
                        "Esse CEP não é válido"
                      );
                      requisitarDadosCep();
                    }}
                  />
                  <div className="invalid-feedback" />
                </div>

                <div className="col-lg-4 mb-3">
                  <label className="form-label">
                    Estado <i className="text-danger">*</i>
                  </label>
                  <select
                    ref={selectEstado}
                    type="text"
                    className="form-control"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    onBlur={(e) =>
                      validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="RO">Rondônia</option>
                    <option value="AC">Acre</option>
                    <option value="AM">Amazonas</option>
                    <option value="RR">Roraima</option>
                    <option value="PA">Pará</option>
                    <option value="AP">Amapá</option>
                    <option value="TO">Tocantins</option>
                    <option value="MA">Maranhão</option>
                    <option value="PI">Piauí</option>
                    <option value="CE">Ceará</option>
                    <option value="RN">Rio</option> Grande do Norte
                    <option value="PB">Paraíba</option>
                    <option value="PE">Pernambuco</option>
                    <option value="AL">Alagoas</option>
                    <option value="SE">Sergipe</option>
                    <option value="BA">Bahia</option>
                    <option value="MG">Minas</option> Gerais
                    <option value="ES">Espírito</option> Santo
                    <option value="RJ">Rio</option> de Janeiro
                    <option value="SP">São</option> Paulo
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa</option> Catarina
                    <option value="RS">Rio</option> Grande do Sul
                    <option value="MS">Mato</option> Grosso do Sul
                    <option value="MT">Mato</option> Grosso
                    <option value="GO">Goiás</option>
                    <option value="DF">Distrito</option> Federal
                    <option value="EX">Exterior</option>
                  </select>
                  <div className="invalid-feedback" />
                </div>

                <div className="col-lg-4 mb-3">
                  <label className="form-label">
                    Cidade <i className="text-danger">*</i>
                  </label>
                  <input
                    ref={txtCidade}
                    type="text"
                    maxLength={70}
                    className="form-control"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    onBlur={(e) => {
                      validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                    }}
                  />
                  <div className="invalid-feedback" />
                </div>

                <div className="col-lg-5 mb-3">
                  <label className="form-label">
                    Bairro <i className="text-danger">*</i>
                  </label>
                  <input
                    ref={txtBairro}
                    type="text"
                    maxLength={40}
                    className="form-control"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    onBlur={(e) => {
                      validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                    }}
                  />
                  <div className="invalid-feedback" />
                </div>

                <div className="col-lg-7 mb-3">
                  <label className="form-label">
                    Rua <i className="text-danger">*</i>
                  </label>
                  <input
                    ref={txtRua}
                    type="text"
                    maxLength={120}
                    className="form-control"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    onBlur={(e) => {
                      validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                    }}
                  />
                  <div className="invalid-feedback" />
                </div>

                <div className="col-lg-4 mb-3">
                  <label className="form-label">
                    Número <i className="text-danger">*</i>
                  </label>
                  <input
                    ref={txtNumero}
                    type="text"
                    maxLength={8}
                    className="form-control"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    onBlur={(e) =>
                      validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])
                    }
                  />
                  <div className="invalid-feedback" />
                </div>

                <div className="col-lg-8 mb-3">
                  <label className="form-label">Complemento</label>
                  <input
                    type="text"
                    maxLength={150}
                    className="form-control"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                  <div className="invalid-feedback" />
                </div>
              </div>
            </div>

            <hr className="mb-3" />
          </div>

          <div className="w-100 d-flex justify-content-end gap-3">
            {/* <button
              className="btn btn-sm"
              onClick={() => {
                navigate('/app/');
              }}
            >
              Voltar
            </button> */}

            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                toast.success("Alterações salvas com sucesso");
              }}
            >
              <BsCheck2All /> Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
