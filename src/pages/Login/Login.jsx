import React, { useState } from 'react';
import axios from 'axios';

import api, { AUTH_USER } from '../../services/api'
import { setToken } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
const Login = (props) => {

    let navigate = useNavigate();

    const [login, setUser] = useState({
        username: "username",
        password: "pass"
    });

    const [message, setMessage] = useState({ message: "", type: "" });


    const handleChange = (e) => {
        const { id, value } = e.target;

        setUser(prevState => ({
            ...prevState,
            [id]: value
        })
        );
    }

    const changeMessage = (msg, type) => {
        setMessage(prevState => ({
            ...prevState,
            message: msg,
            type: type
        }));
    }

    const loginHandle = e => {
        e.preventDefault();

        //console.log(login);
        const payload = {
            name: login.username,
            password: login.password
        }



        api.post(AUTH_USER, payload)
            .then(response => {
                if (response.status === 200) {
                    changeMessage('Login efetuado. Redirecionando...', 'success');
                    setToken(response.data.token);
                    navigate("/", { replace: true });
                } else {
                    changeMessage('Algo deu errado, tente novamente', 'danger');
                }
            }).catch(error => {
                changeMessage('Não foi possível fazer login, verifique os dados e tente novamente', 'danger');
                console.log(error);
            });
    }

    return (
        <div className="container d-flex align-items-center flex-column">
            <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
                <form className="form login">
                    <div className="form-group text-left">
                        <label for="username">Usuário</label>
                        <input type="text"
                            id="username"
                            placeholder="Usuário"
                            value={login.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label for="password">Senha</label>
                        <input type="password"
                            id="password"
                            placeholder="Senha"
                            value={login.senha}
                            onChange={handleChange}
                        />
                    </div>
                    {/*    */}

                    <div className={'alert mt-2 alert-' + message.type} style={{ display: message.message ? 'block' : 'none' }} role="alert">
                        {message.message}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={loginHandle}
                    >Login</button>
                </form>

                {/* @TODO REMOVE ME */}
                <p>{login.username}</p>
                <p>{login.password}</p>
            </div>
        </div>
    );

}

export default Login;
