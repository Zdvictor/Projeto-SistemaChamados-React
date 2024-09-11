import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"
import avatarImg from "../../assets/avatar.png"
import "./header.css"

import { Link } from "react-router-dom"
import {FiHome, FiUser, FiSettings} from "react-icons/fi"


export default function Header() {

    const {user} = useContext(AuthContext)

    return (

        <div className="sidebar">

            <div className="">
                <img src={user.avatarUrl == null ? avatarImg  : user.avatarUrl} alt="foto do usuario" />
            </div>

            <Link to="/dashboard">
                <FiHome color="#fff" size={24} />
                Chamados
            </Link>

            <Link to="/customers">
                <FiUser color="#fff" size={24} />
                Clientes
            </Link>

            <Link to="/profile">
                <FiSettings color="#fff" size={24} />
                Perfil
            </Link>

        </div>

    )

}