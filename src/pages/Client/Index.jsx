import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { CLIENT_LIST_URL } from '../../services/api';

const Index = () => {

    const [currentPage, setCurrentPage] = useState(0);
    const [page, setPage] = useState({});
    const fetchClients = () => {
        api.get(CLIENT_LIST_URL + '?page=' + currentPage).then(response => {
            console.log(response.data);
            setPage(response.data);
        }).catch(error => {
            console.error("error:", error);
        })
    };

    useEffect(() => {
        fetchClients();

    }, [currentPage]);

    const fillClientList = () => {

        if (page['content'] && page['content'].length) {
            return page.content.map(cli => {
                return (
                    <tr key={cli.id}>
                        <th scope="row">{cli.id}</th>
                        <td>{cli.name}</td>
                        <td>{cli.phone.number}</td>
                        <td>{cli.document}</td>
                        <td>{cli.email}</td>
                        <td><Link to={`/client/${cli.id}`}>ver</Link></td>
                    </tr>
                )
            });
        }
    }

    const renderPagination = () => {

        if (page['content'] && page['content'].length) {
            return (
                <nav aria-label="Page navigation client">
                    <ul className="pagination">
                        <li className={'page-item ' + (page.first ? 'disabled' : '')}>
                            <a className="page-link" href="#" onClick={() => setCurrentPage(currentPage - 1)}>Anterior</a>
                        </li>
                        {Array.apply(0, Array(page.totalPages)).map(function (x, i) {
                            return (
                                <li className={'page-item ' + (i == currentPage ? 'active' : '')} key={i} onClick={() => setCurrentPage(i)}>
                                    <a className="page-link" href="#">{i + 1}</a>
                                </li>
                            );
                        })}
                        <li className={'page-item ' + (page.last ? 'disabled' : '')}>
                            <a className="page-link" href="#" onClick={() => setCurrentPage(currentPage + 1)}>Próxima</a>
                        </li>
                    </ul>
                </nav>
            )
        }
    }


    return (
        <div className="clients content container">
            <table className="table table-striped table-hover">
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
            {renderPagination()}
        </div>
    );
}
export default Index;