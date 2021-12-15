import { logout, getUserName } from '../../services/auth'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import './Header.css';

const Header = (props) => {
    let navigate = useNavigate();
    return (
        <>
            <nav className="navbar top navbar-light bg-light">
                <a className="navbar-brand mb-0 h1">Desafio</a>
                <span className="navbar-text">
                    Olá {getUserName()}!
                    <a className="btn btn-link"
                        onClick={e => {
                            Swal.fire({
                                title: "Logout?",
                                text: "Você será redirecionado para página de login",
                                confirmButtonText: 'Sim, sair',
                                cancelBtnText: 'Cancelar',
                                showCancelButton: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    logout();
                                    navigate("/login");
                                }
                            });
                        }}
                    >Logout</a>
                </span>
            </nav>
            {
                props.title ?
                    <h2 className="page-title text-center">{props.title}</h2>
                    :
                    ''
            }
        </>
    );
}

export default Header;