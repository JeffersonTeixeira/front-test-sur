import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { CLIENT_LIST_URL } from '../../services/api';
import Header from '../../components/Header/Index'
import './Client.css';
import { IMaskInput } from 'react-imask';
import Swal from 'sweetalert2'

const Index = () => {

    const [currentPage, setCurrentPage] = useState(0);
    const [page, setPage] = useState({});
    const fetchClients = () => {
        api.get(CLIENT_LIST_URL + '?page=' + currentPage).then(response => {
            console.log(response.data);
            setPage(response.data);
        }).catch(error => {
            console.error(error);
            if (error.response && error.response.data['details']) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',

                    html: '<ul>' +
                        error.response.data.details.map(err => {
                            return '<li>' + err + '</li>'
                        })
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
    };

    useEffect(() => {
        fetchClients();

    }, [currentPage]);

    const fillClientList = () => {
        return page.content.map(cli => {
            return (
                <tr key={cli.id}>
                    <th scope="row">{cli.id}</th>
                    <td>{cli.name}</td>
                    <td><IMaskInput className="form-control-plaintext" mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} value={cli.phone.number} readOnly={true} /></td>
                    <td><IMaskInput mask='000.000.000-00' type="text" className="form-control-plaintext" value={cli.document} readOnly /></td>
                    <td>{cli.email}</td>
                    <td><Link to={`/client/${cli.id}`}>ver</Link></td>
                </tr>
            );
        });
    }

    const renderPagination = () => {
        return (
            <nav aria-label="Page navigation client">
                <ul className="pagination">
                    <li className={'page-item ' + (page.first ? 'disabled' : '')}>
                        <a className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Anterior</a>
                    </li>
                    {Array.apply(0, Array(page.totalPages)).map(function (x, i) {
                        return (
                            <li className={'page-item ' + (i == currentPage ? 'active' : '')} key={i} onClick={() => setCurrentPage(i)}>
                                <a className="page-link" >{i + 1}</a>
                            </li>
                        );
                    })}
                    <li className={'page-item ' + (page.last ? 'disabled' : '')}>
                        <a className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Próxima</a>
                    </li>
                </ul>
            </nav>
        );
    }


    const renderTableClients = () => {
        return (
            <>
                <table className="table clients table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Telefone principal</th>
                            <th scope="col">CPF</th>
                            <th scope="col">E-mail principal</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody >
                        {fillClientList()}
                    </tbody>
                </table>
                { renderPagination()}
            </>
        )
    }


    return (
        <>
            <Header title="Clientes" />
            <div className="clients content container">
                {
                    page['content'] && page['content'].length ?
                        renderTableClients()
                        :
                        <div className="alert alert-warning" role="alert">
                            Nenhum cliente encontrado
                        </div>
                }
                <div className="bg-light" >
                    <Link className="btn btn-primary" to={`/client`}>Adicionar Cliente</Link>
                </div>

            </div>
        </>
    );
}
export default Index;