import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import api, { BASE_CLIENT_URL } from '../../services/api';

const Client = () => {
    let params = useParams();

    const [currentCli, setCurrentCli] = useState({ address: {}, emails: [], phones: [] });

    const [emails, setEmails] = useState([undefined]);
    const [phones, setPhones] = useState([]);

    const fetchClient = () => {
        if (params.id) {
            api.get(BASE_CLIENT_URL + '/' + params.id).then(response => {
                setCurrentCli(response.data);
                console.log(response.data);

                setEmails(response.data.emails);
                setEmails(prev => ([response.data.email, ...prev]));

                setPhones(response.data.phones);
                setPhones(prev => ([response.data.phone, ...prev]));

                console.log("todos emails");
                console.log(emails);

                console.log("todos phones");
                console.log(phones);

            }).catch(error => {
                console.log("error:", error);
            });
        }
    }

    useEffect(() => {
        fetchClient();
    }, []);


    const setPrincipal = (prop, value) => {
        setCurrentCli(prev => ({
            ...prev,
            [prop]: value
        }));
    }


    const renderEmailField = (email, index) => {
        return (
            <div className="form-group" key={index}>
                <input type="email" value={email}
                    onChange={e => {
                        let old = [...emails];
                        old[index] = e.target.value;
                        setEmails(old);
                        if (currentCli.email == email) { //if radio checked, also update value in Current client
                            setPrincipal('email', e.target.value);
                        }
                    }} />
                <div className="form-check form-check-inline">
                    <input name="email-principal" type="radio" id={'email' + (index)}
                        checked={email == currentCli.email}
                        value={email}
                        onChange={e => setPrincipal('email', email)}
                    />
                    <label htmlFor={'email' + (index)} >Principal</label>
                </div>
                <button onClick={e => { e.preventDefault(); if (emails.length > 1) setEmails(emails.filter((item, i) => i != index)) }}>Remover</button>
            </div>
        );
    }

    let phoneTypes = ['CELULAR', 'RESIDENCIAL', 'FIXO'];
    const renderPhoneField = (phone, index) => {
        return (
            <div className="form-group" key={index}>
                <input type="hidden" readOnly value={phone.id} />
                <input type="text" value={phone.number}
                    onChange={e => {
                        let old = [...phones];
                        old[index].number = e.target.value;
                        setPhones(old);
                        if (phone == currentCli.phone) {
                            setPrincipal('phone', old[index]);
                        }
                    }} />
                <select value={phone.type} defaultValue="">
                    <option value="" disabled>Selecione</option>
                    {phoneTypes.map((item, i) => {
                        return (<option value={item} key={i}>{item}</option>);
                    })}
                </select>
                <div className="form-check form-check-inline">
                    <input name="telefone-principal" type="radio" id={'phone' + (index)}
                        checked={phone == currentCli.phone}
                        value={phone}
                        onChange={e => setPrincipal('phone', phone)}
                    />
                    <label htmlFor={'phone' + (index)} >Principal</label>
                </div>
                <button onClick={e => { e.preventDefault(); if (phones.length > 1) setPhones(phones.filter(item => item != phone)) }}>Remover</button>
            </div>
        );
    }

    return (
        <div className="client content container">
            <form>
                <div className="form-row">
                    <input type="hidden" id="id" readOnly value={currentCli.id} />
                    <div className="form-group cold-md-6">
                        <label htmlFor="name">Nome</label>
                        <input type="text" id="name" placeholder="Nome" value={currentCli.name} />
                    </div>
                    <div className="form-group cold-md-6">
                        <label htmlFor="document">CPF</label>
                        <input type="text" id="document" placeholder="CPF" value={currentCli.document} />
                    </div>
                </div>
                <div className="form-row">
                    <input type="hidden" id="address.id" readOnly value={currentCli.address.id} />
                    <div className="form-group cold-md-2">
                        <label htmlFor="address.cep">CEP</label>
                        <input type="text" id="address.cep" placeholder="CEP" value={currentCli.address.cep} />
                    </div>
                    <div className="form-group cold-md-6">
                        <label htmlFor="address.logradouro">Logradouro</label>
                        <input type="text" id="address.logradouro" placeholder="Logradouro" value={currentCli.address.logradouro} />
                    </div>
                    <div className="form-group cold-md-4">
                        <label htmlFor="address.complemento">Complemento</label>
                        <input type="text" id="address.complemento" placeholder="Complemento" value={currentCli.address.complemento || ''} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group cold-md-4">
                        <label htmlFor="address.bairro">Bairro</label>
                        <input type="text" id="address.bairro" placeholder="Bairro" value={currentCli.address.bairro} />
                    </div>
                    <div className="form-group cold-md-6">
                        <label htmlFor="address.cidade">Cidade</label>
                        <input type="text" id="address.cidade" placeholder="Cidade" value={currentCli.address.cidade} />
                    </div>
                    <div className="form-group cold-md-1">
                        <label htmlFor="address.uf">UF</label>
                        <input type="text" id="address.uf" placeholder="UF" value={currentCli.address.uf} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-md-5">
                        {emails.map((email, index) => {
                            return renderEmailField(email, index);
                        })}
                        <button onClick={
                            (e) => {
                                e.preventDefault();
                                setEmails(prev => ([...prev, ""]));
                            }
                        }>
                            Adicionar</button>
                    </div>
                    <div className="col">
                        {phones.map((phone, index) => {
                            return renderPhoneField(phone, index);
                        })}
                        <button onClick={
                            (e) => {
                                e.preventDefault();
                                setPhones(prev => ([...prev, {}]));
                            }
                        }>
                            Adicionar</button>
                    </div>
                </div>

                <button onClick={(e) => {
                    e.preventDefault();
                    console.log("emails", emails);
                    console.log("emailprincipal: " + currentCli.email);
                }}
                >Verdade Emails</button>

                <button onClick={(e) => {
                    e.preventDefault();
                    console.log("phones", phones);
                    console.log("phonePrincipal: ", currentCli.phone);
                }}
                >Verdade Phone</button>

            </form>

        </div>
    );
}

export default Client;