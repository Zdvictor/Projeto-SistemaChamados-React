import logo from "../../assets/logo.png"
import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"


export default function SignIn() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {signUp, loadingAuth} = useContext(AuthContext)

    async function handleSubmit(e) {

        e.preventDefault()

        if(name !== "" && email != "" && password !== "") {

           await signUp(email,password,name)

        }

    }

    return (

        <div className="container-center">

            <div className="login">

                <div className="login-area">

                    <img src={logo} alt="Logo do Sistema de Chamados" />

                </div>

                <form onSubmit={handleSubmit}>

                    <h1>Nova Conta</h1>

                    <input
                    type="text"
                    placeholder="Seu Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />

                    <input
                    type="text"
                    placeholder="email@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                    type="password"
                    placeholder="*******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />


                    <button type="submit">{loadingAuth ? "Carregando..." : "Cadastrar"}</button>

                    
                </form>

                <Link to="/">Ja possui uma Conta ? Faça Login</Link>



            </div>

        </div>

    )


}