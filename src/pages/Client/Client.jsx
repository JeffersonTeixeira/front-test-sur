import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import api, { BASE_CLIENT_URL } from '../../services/api';
import './Client.css';
import Swal from 'sweetalert2'
import Header from '../../components/Header/Index';
import { getRoles } from '../../services/auth'
import CepInput from '../../components/CepInput';
import { IMaskInput } from 'react-imask';

const Client = () => {
    let params = useParams();
    let isReadOnly = getRoles().indexOf("ADMIN") == -1;

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
                console.error(error);
                if (error.response && error.response.data['details']) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        html: '<ul>' +
                            error.response.data.details.map(err => {
                                return '<li>' + err + '</li>'
                            }).join('')
                            + '</ul>'
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo deu errado, tente novamente'
                    })
                }
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
        if (!isReadOnly) {
            setCurrentCli(prev => ({
                ...prev,
                [prop]: value
            }));
        }
    }


    const setCurrentCliAddress = (prop, value) => {
        if (!isReadOnly) {
            const a = { ...currentCli }
            a.address[prop] = value;
            setCurrentCli(a);
        }
    }

    const updatePhones = (index, prop, value) => {
        if (!isReadOnly) {
            let old = [...phones];
            old[index][prop] = value;
            setPhones(old);
            if (old[index] == currentCli.phone) { //if radio checked, also update value in Current client            
                updateCurrentCli('phone', old[index]);
            }
        }
    }

    const requestSaveClient = (e) => {
        e.preventDefault();

        const payload = { ...currentCli };

        //Remove principal from emails/phones
        payload.emails = [...emails].filter(item => item != payload.email);
        payload.phones = [...phones].filter(item => item != payload.phone);


        api.post(BASE_CLIENT_URL, payload)
            .then(response => {

                setClientDataFromApi(response.data);
                Swal.fire(
                    'Salvo!',
                    'Cliente salvo.',
                    'success'
                );
            }).catch((error) => {
                if (error.response && error.response.status === 409) {
                    Swal.fire({
                        title: "Dados desatualizados",
                        confirmButtonText: 'Carregar aqui',
                        cancelBtnText: 'Cancelar',
                        showDenyButton: true,
                        denyButtonText: 'Abrir em nova aba',
                        showCancelButton: true,
                        html: '<p><strong>Não foi possível salvar.</strong> Os dados desta página parecem ter sido modificados após ela ser carregada</p>' +
                            '<strong>O que você pode fazer:</strong>' +
                            '<ul><li>' +
                            '<p>Recarregar os dados novos nessa página (os dados do formulário serão perdidos)</p></li>' +
                            '<li><p>Abrir a versão atualizada em uma nova aba</p></li></ul>'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetchClient();
                        } else if (result.isDenied) {
                            window.open(window.location.href, "_blank")?.focus();
                        }
                    });
                } else if (error.response && error.response.data['details']) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Campo(s) inválido(s)...',

                        html: '<ul>' +
                            error.response.data.details.map(err => {
                                return '<li>' + err + '</li>'
                            }).join('')
                            + '</ul>'
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo deu errado!'
                    })
                }


                console.error(error);
            });

    }


    const renderEmailField = (email, index) => {
        return (
            <tr key={index}>
                <td>
                    <label className="sr-only" htmlFor={'email-' + (index)} >E-mail</label>
                    <input type="email" required className="form-control" value={email}
                        id={'email-' + (index)}
                        onChange={e => {
                            if (isReadOnly) {
                                return;
                            }

                            let old = [...emails];
                            old[index] = e.target.value;
                            setEmails(old);
                            if (currentCli.email == email) { //if radio checked, also update value in Current client
                                updateCurrentCli('email', e.target.value);
                            }
                        }} />
                </td>
                <td className="text-center">
                    <input name="email-principal" type="radio" required id={'email' + (index)}
                        checked={email == currentCli.email}
                        value={email}
                        onChange={e => updateCurrentCli('email', email)}
                    />
                    <label className="sr-only" htmlFor={'email-principal' + (index)} >Principal</label>
                </td>
                <td className="text-center">
                    <button type="button" className="btn btn-outline-danger"
                        onClick={() => { if (emails.length > 1 && !isReadOnly) setEmails(emails.filter((item, i) => i != index)) }}>
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
                    <IMaskInput mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} type="tel" required className="form-control" value={phone.number}
                        onChange={e => { updatePhones(index, 'number', e.target.value) }}
                    />
                </td>
                <td className="text-center">
                    <select className="form-control" required value={phone.type || ""}
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
                    <input name="telefone-principal" required type="radio" id={'phone' + (index)}
                        checked={phone == currentCli.phone}
                        value={phone}
                        onChange={e => updateCurrentCli('phone', phone)}
                    />
                    <label className="sr-only" htmlFor={'phone' + (index)} >Principal</label>
                </td>
                <td className="text-center">
                    <button type="button" className="btn btn-outline-danger"
                        onClick={() => { if (phones.length > 1 && !isReadOnly) setPhones(phones.filter(item => item != phone)) }}>
                        <i className="bi bi-trash "><span className="sr-only">Remover</span></i>
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <>
            <Header title="Cliente" />
            {
                isReadOnly ?
                    <div className="alert alert-warning text-center">
                        <span>Você só possui permissão de visualização, não é possível alterar os dados.</span>
                    </div>
                    : ""
            }

            <div className="client content container">
                <form onSubmit={e => requestSaveClient(e)}>
                    <div className="form-row">
                        <input type="hidden" id="id" readOnly value={currentCli.id} />
                        <div className="form-group col-md-10">
                            <label htmlFor="name">Nome</label>
                            <input type="text" className="form-control" id="name" placeholder="Nome" required minLength="3" maxLength="100"
                                value={currentCli.name}
                                onChange={e => { updateCurrentCli('name', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-2">
                            <label htmlFor="document">CPF</label>
                            <IMaskInput mask='000.000.000-00' required type="tel" className="form-control" id="document" placeholder="CPF" value={currentCli.document}
                                onChange={e => { updateCurrentCli('document', e.target.value) }} />
                        </div>
                    </div>
                    <div className="form-row">
                        <input type="hidden" id="address.id" readOnly value={currentCli.address.id} />
                        <div className="form-group col-md-2">
                            <label htmlFor="address.cep">CEP</label>

                            <CepInput type="tel" required className="form-control" id="address.cep" placeholder="CEP"
                                responsecep={(r) => {
                                    setCurrentCliAddress('logradouro', r.logradouro);
                                    setCurrentCliAddress('bairro', r.bairro);
                                    setCurrentCliAddress('uf', r.uf);
                                    setCurrentCliAddress('cidade', r.localidade);
                                    setCurrentCliAddress('complemento', r.complemento);
                                }}
                                value={currentCli.address.cep}
                                onChange={e => { setCurrentCliAddress('cep', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="address.logradouro">Logradouro</label>
                            <input type="text" className="form-control" required id="address.logradouro" placeholder="Logradouro" value={currentCli.address.logradouro}
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
                            <input type="text" className="form-control" required id="address.bairro" placeholder="Bairro" value={currentCli.address.bairro}
                                onChange={e => { setCurrentCliAddress('bairro', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="address.cidade">Cidade</label>
                            <input type="text" className="form-control" required id="address.cidade" placeholder="Cidade" value={currentCli.address.cidade}
                                onChange={e => { setCurrentCliAddress('cidade', e.target.value) }} />
                        </div>
                        <div className="form-group col-md-1">
                            <label htmlFor="address.uf">UF</label>
                            <input type="text" className="form-control" required maxLength="2" id="address.uf" placeholder="UF" value={currentCli.address.uf}
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
                                () => {
                                    if (!isReadOnly) {
                                        setEmails(prev => ([...prev, ""]));
                                    }
                                }
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
                                () => {
                                    if (!isReadOnly) {
                                        setPhones(prev => ([...prev, emptyPhone]));
                                    }
                                }
                            }>Adicionar telefone</button>
                        </div>
                    </div>
                    <nav className="navbar client fixed-bottom navbar-light bg-light">
                        <div className="container justify-content-start">
                            <div className="col-sm-2">
                                <button type="submit" className="btn btn-block btn-success" disabled={isReadOnly}>Salvar</button>
                            </div>
                            <div className="col-1">
                                <button type="button" className="btn btn-sm btn-danger" disabled={isReadOnly}
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
                                                    console.error(error);
                                                    if (error.response && error.response.data['details']) {
                                                        Swal.fire({
                                                            icon: 'error',
                                                            title: 'Oops...',

                                                            html: '<ul>' +
                                                                error.response.data.details.map(err => {
                                                                    return '<li>' + err + '</li>'
                                                                }).join('')
                                                                + '</ul>'
                                                        });

                                                    } else {
                                                        Swal.fire({
                                                            icon: 'error',
                                                            title: 'Oops...',
                                                            text: 'Algo deu errado, tente novamente'
                                                        })
                                                    }
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