import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import api, { BASE_CLIENT_URL } from '../../services/api';
import InputMask from 'react-input-mask';
import './Client.css';
import PhoneInput from '../../components/Mask/PhoneInput';
import Swal from 'sweetalert2'
import Header from '../../components/Header/Index';

const Client = () => {
    let params = useParams();

    const emptyPhone = { id: "", number: "", type: "" }
    const emptyClient = {
        id: "",
        name: "",
        document: "",
        address: { id: "", cep: "", logradouro: "", complemento: "", bairro: "", cidade: "", uf: "" },
        email: "",
        emails: [""],
        phone: emptyPhone,
        phones: [emptyPhone]
    }

    const [currentCli, setCurrentCli] = useState(emptyClient);

    const [emails, setEmails] = useState([""]);
    const [phones, setPhones] = useState([emptyPhone]);

    useEffect(() => {
        fetchClient();
    }, []);

    const fetchClient = () => {
        if (params.id) {
            api.get(BASE_CLIENT_URL + '/' + params.id).then(response => {
                setClientDataFromApi(response.data);
            }).catch(error => {
                console.log("error:", error);
            });
        }
    }

    const setClientDataFromApi = (client) => {
        setCurrentCli(client);

        setEmails(client.emails);
        setEmails(prev => ([client.email, ...prev]));

        setPhones(client.phones);
        setPhones(prev => ([client.phone, ...prev]));
    }


    const updateCurrentCli = (prop, value) => {
        setCurrentCli(prev => ({
            ...prev,
            [prop]: value
        }));
    }


    const setCurrentCliAddress = (prop, value) => {
        const a = { ...currentCli }
        a.address[prop] = value;
        setCurrentCli(a);
    }

    const updatePhones = (index, prop, value) => {
        let old = [...phones];
        old[index][prop] = value;
        setPhones(old);
        if (old[index] == currentCli.phone) { //if radio checked, also update value in Current client            
            updateCurrentCli('phone', old[index]);
        }
    }

    const requestSaveClient = (e) => {
        e.preventDefault();

        const payload = { ...currentCli };

        //Remove principal from emails/phones
        payload.emails = [...emails].filter(item => item != payload.email);
        payload.phones = [...phones].filter(item => item != payload.phone);

        console.log("payload", payload);

        api.post(BASE_CLIENT_URL, payload)
            .then(response => {
                console.log(response);
                setClientDataFromApi(response.data);
                Swal.fire(
                    'Salvo!',
                    'Cliente salvo.',
                    'success'
                );
            }).catch(error => {
                console.error(error);
            });

    }


    const renderEmailField = (email, index) => {
        return (
            <tr key={index}>
                <td>
                    <label className="sr-only" htmlFor={'email-' + (index)} >E-mail</label>
                    <input type="email" className="form-control" value={email}
                        id={'email-' + (index)}
                        onChange={e => {
                            let old = [...emails];
                            old[index] = e.target.value;
                            setEmails(old);
                            if (currentCli.email == email) { //if radio checked, also update value in Current client
                                updateCurrentCli('email', e.target.value);
                            }
                        }} />
                </td>
                <td className="text-center">
                    <input name="email-principal" type="radio" id={'email' + (index)}
                        checked={email == currentCli.email}
                        value={email}
                        onChange={e => updateCurrentCli('email', email)}
                    />
                    <label className="sr-only" htmlFor={'email-principal' + (index)} >Principal</label>
                </td>
                <td className="text-center">
                    <button type="button" className="btn btn-outline-danger"
                        onClick={() => { if (emails.length > 1) setEmails(emails.filter((item, i) => i != index)) }}>
                        <i className="bi bi-trash"><span className="sr-only">Remover</span></i>
                    </button>
                </td>
            </tr>
        );
    }

    let phoneTypes = ['CELULAR', 'RESIDENCIAL', 'COMERCIAL'];
    const renderPhoneField = (phone, index) => {
        return (
            <tr key={index}>
                <td>
                    <input type="hidden" readOnly value={phone.id} />
                    <PhoneInput type="tel" className="form-control" value={phone.number}
                        onChange={e => { updatePhones(index, 'number', e.target.value) }}
                    />
                </td>
                <td className="text-center">
                    <select className="form-control" value={phone.type || ""}
                        onChange={
                            e => { updatePhones(index, 'type', e.target.value) }
                        }>
                        <option value="" disabled>Selecione</option>
                        {phoneTypes.map((item, i) => {
                            return (<option value={item} key={i}>{item.toLocaleLowerCase()}</option>);
                        })}
                    </select>
                </td>
                <td className="text-center">
                    <input name="telefone-principal" type="radio" id={'phone' + (index)}
                        checked={phone == currentCli.phone}
                        value={phone}
                        onChange={e => updateCurrentCli('phone', phone)}
                    />
                    <label className="sr-only" htmlFor={'phone' + (index)} >Principal</label>
                </td>
                <td className="text-center">
                    <button type="button" className="btn btn-outline-danger"
                        onClick={() => { if (phones.length > 1) setPhones(phones.filter(item => item != phone)) }}>
                        <i className="bi bi-trash "><span className="sr-only">Remover</span></i>
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <>
            <Header title="Cliente" />
            <div className="client content container">
                <form onSubmit={e => requestSaveClient(e)}>
                    <div className="form-row">
                        <input type="hidden" id="id" readOnly value={currentCli.id} />
                        <div className="form-group col-md-10">
                            <label htmlFor="name">Nome</label>
                            <input type="text" className="form-control" id="name" placeholder="Nome" value={currentCli.name}
                                onChange={e => { updateCurrentCli('name', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-2">
                            <label htmlFor="document">CPF</label>
                            <InputMask mask='999.999.999-99' type="tel" className="form-control" id="document" placeholder="CPF" value={currentCli.document}
                                onChange={e => { updateCurrentCli('document', e.target.value) }} />
                        </div>
                    </div>
                    <div className="form-row">
                        <input type="hidden" id="address.id" readOnly value={currentCli.address.id} />
                        <div className="form-group col-md-2">
                            <label htmlFor="address.cep">CEP</label>
                            <InputMask mask='99.999-999' type="tel" className="form-control" id="address.cep" placeholder="CEP"
                                value={currentCli.address.cep}
                                onChange={e => { setCurrentCliAddress('cep', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="address.logradouro">Logradouro</label>
                            <input type="text" className="form-control" id="address.logradouro" placeholder="Logradouro" value={currentCli.address.logradouro}
                                onChange={e => { setCurrentCliAddress('logradouro', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="address.complemento">Complemento</label>
                            <input type="text" className="form-control" id="address.complemento" placeholder="Complemento" value={currentCli.address.complemento || ''}
                                onChange={e => { setCurrentCliAddress('complemento', e.target.value) }} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-5">
                            <label htmlFor="address.bairro">Bairro</label>
                            <input type="text" className="form-control" id="address.bairro" placeholder="Bairro" value={currentCli.address.bairro}
                                onChange={e => { setCurrentCliAddress('bairro', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="address.cidade">Cidade</label>
                            <input type="text" className="form-control" id="address.cidade" placeholder="Cidade" value={currentCli.address.cidade}
                                onChange={e => { setCurrentCliAddress('cidade', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-1">
                            <label htmlFor="address.uf">UF</label>
                            <input type="text" className="form-control" id="address.uf" placeholder="UF" value={currentCli.address.uf}
                                onChange={e => { setCurrentCliAddress('uf', e.target.value) }} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-6">
                            <table className="table">
                                <caption>E-mails</caption>
                                <thead>
                                    <tr>
                                        <th>E-mail</th>
                                        <th className="text-center">Principal</th>
                                        <th className="text-center">Remover</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emails.map((email, index) => {

                                        return renderEmailField(email, index);
                                    })}
                                </tbody>
                            </table>
                            <button type="button" className="btn btn-secondary" onClick={
                                () => { setEmails(prev => ([...prev, ""])); }
                            }>Adicionar e-mail</button>

                        </div>
                        <div className="col">
                            <table className="table">
                                <caption>Telefones</caption>
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th className="text-center">Tipo</th>
                                        <th className="text-center">Principal</th>
                                        <th className="text-center">Remover</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {phones.map((phone, index) => {
                                        return renderPhoneField(phone, index);
                                    })}
                                </tbody>
                            </table>
                            <button type="button" className="btn btn-secondary" onClick={
                                () => { setPhones(prev => ([...prev, { id: "", number: "", type: "" }])); }
                            }>Adicionar telefone</button>
                        </div>
                    </div>
                    <nav className="navbar client fixed-bottom navbar-light bg-light">
                        <div className="container justify-content-start">
                            <div className="col-sm-2">
                                <button type="submit" className="btn btn-block btn-success">Salvar</button>
                            </div>
                            <div className="col-1">
                                <button type="button" className="btn btn-sm btn-danger"
                                    onClick={(e) => {
                                        Swal.fire({
                                            title: 'Tem certeza que deseja remover?',
                                            text: "Essa ação não pode ser desfeita",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Sim, remover'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                api.delete(BASE_CLIENT_URL + '/' + currentCli.id).then(response => {
                                                    setEmails([""]);
                                                    setPhones([emptyPhone]);
                                                    setCurrentCli(emptyClient);
                                                    Swal.fire(
                                                        'Removido!',
                                                        'Cliente removido.',
                                                        'success'
                                                    );
                                                }).catch(error => {
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Oops...',
                                                        text: 'Algo deu errado!'
                                                    })
                                                })
                                            }
                                        });
                                    }}
                                >Excluir</button>
                            </div>
                        </div>
                    </nav>
                </form>
            </div >
        </>
    );
}

export default Client;