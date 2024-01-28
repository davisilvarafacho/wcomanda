import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import * as jose from "jose";

import { useValidacoes } from "hooks/useValidacoes";
import { useAuth } from "hooks/useAuth";
import { endpoints } from "constants/endpoints";
import { mapStateToProps } from "common/mapStateToProps";
import { REGEX_CAMPO_PREENCHIDO } from "constants/regexs";
import { localStorageKeys } from "constants/localStorageKeys";
import { actions } from "constants/actions";
import { sessionKeys } from "constants/session";

function _Login({ dispatch }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [redirect, setRedirect] = useState(false);

  const [logando, setLogando] = useState(false);

  const txtEmail = useRef();
  const txtSenha = useRef();
  const btnLogin = useRef();

  const navigate = useNavigate();

  const { validar } = useValidacoes();
  const { login } = useAuth();

  useLayoutEffect(() => {
    async function validarToken() {
      const token = localStorage.getItem(localStorageKeys.tokenUsuario);
      if (!token) return;

      const secret = import.meta.env.VITE_SECRET_KEY;
      const { payload } = await jose.jwtDecrypt(token, secret);

      setRedirect(true);
    }

    // validarToken()
  }, []);

  useEffect(() => {
    if (redirect) navigate("/app/");
  }, [redirect]);

  return (
    <div className="w-100 vh-100 bg-ligth">
      <div className="d-flex flex-column justify-content-center align-items-center h-100 p-3">
        <div className="card col-12 col-md-9 col-lg-7 col-xl-3 shadow-lg">
          <div className="card-header text-center">
            <h4 className="fw-bold text-primary">wCommanda</h4>

            <p className="card-text text-muted">
              Preencha os dados abaixo para fazer o login.
            </p>
          </div>
          <div className="card-body">
            <div className="form-floating mb-3">
              <input
                ref={txtEmail}
                className="form-control"
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) =>
                  validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])
                }
              />
              <label>Email</label>
              <div className="invalid-feedback" />
            </div>
            <div className="form-floating">
              <input
                ref={txtSenha}
                className="form-control"
                type="password"
                placeholder="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onBlur={(e) =>
                  validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])
                }
              />
              <label>Senha</label>
              <div className="invalid-feedback" />
            </div>

            <button
              className="btn btn-sm btn-primary rounded-pill w-100"
              ref={btnLogin}
              onClick={(e) => {
                validar(txtEmail.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
                validar(txtSenha.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);

                if (document.querySelector(".is-invalid")) return;

                e.target.disabled = true;
                setLogando(true);

                login(email, senha)
                  .then((data) => {
                    localStorage.setItem(
                      localStorageKeys.tokenUsuario,
                      data.access
                    );
                    sessionStorage.setItem(
                      sessionKeys.licencaUsuario,
                      jose.decodeJwt(data.access).licenca
                    );

                    toast.success("Seja bem vindo");

                    navigate("/app/home/");
                  })
                  .catch((err) => {
                    console.log(err);
                    toast.warn("Usuário ou senha inválidos");
                  })
                  .finally(() => {
                    e.target.disabled = false;
                    setLogando(false);
                  });
              }}
            >
              {logando ? (
                <div className="spinner-border" role="status" />
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-100 vh-100">
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center px-4">
        <h4 className="text-primary fw-bold">wCommanda</h4>
        <h6 className="text-muted mt-1 mb-4">
          Preencha os dados abaixo para fazer o login
        </h6>
        <div className="col-12 col-md-7 col-lg-5 col-xl-3">
          <div className="form-floating mb-3">
            <input
              className="form-control"
              ref={txtEmail}
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) =>
                validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])
              }
            />
            <label>Email</label>
            <div className="invalid-feedback" />
          </div>

          <div className="form-floating">
            <input
              className="form-control"
              ref={txtSenha}
              type="password"
              placeholder="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onBlur={(e) =>
                validar(e.target, [{ regex: REGEX_CAMPO_PREENCHIDO }])
              }
            />
            <label>Senha</label>
            <div className="invalid-feedback" />
          </div>

          {/* <div className="w-100 form-check mb-2">
            <input className="form-check-input" type="checkbox" value="" id="check-mantenha-logado" checked />
            <label className="form-check-label" for="check-mantenha-logado">
              Mantenha-me logado
            </label>
          </div> */}

          <button
            className="w-100 btn btn-primary rounded-pill mt-3"
            ref={btnLogin}
            onClick={(e) => {
              navigate("/app/");
              return;

              validar(txtEmail.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);
              validar(txtSenha.current, [{ regex: REGEX_CAMPO_PREENCHIDO }]);

              if (document.querySelector(".is-invalid")) return;

              e.target.disabled = true;
              setLogando(true);

              backend
                .post(endpoints.login, {
                  username: email,
                  password: senha,
                })
                .then((res) => {
                  const { nivel_permissao, ...dadosUsuario } = res.data;
                  dispatch({
                    type: actions.user.LOAD,
                    payload: {
                      ...dadosUsuario,
                      nivelPermissao: nivel_permissao,
                    },
                  });

                  sessionStorage.setItem(
                    sessionKeys.tokenUsuario,
                    res.data.token
                  );
                  toast.success("Bem-vindo " + res.data.nome);
                  navigate("/app/");
                })
                .catch((err) => {
                  console.log(err);
                  toast.warn("Credenciais inválidas!");
                })
                .finally(() => {
                  e.target.disabled = false;
                  setLogando(false);
                });
            }}
          >
            {logando ? (
              <div className="spinner-border" role="status" />
            ) : (
              "Entrar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export const Login = _Login; // connect(mapStateToProps('user'))(_Login);
