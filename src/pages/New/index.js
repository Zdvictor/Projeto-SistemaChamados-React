import Header from "../../components/Header"
import Title from "../../components/Title"
import {FiPlusCircle} from "react-icons/fi"
import "./new.css"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"
import { auth, db } from "../../services/firebaseConnection"
import {collection, getDocs, getDoc, doc, addDoc, updateDoc} from "firebase/firestore"
import { toast } from "react-toastify"


const listRef = collection(db, "customers")

export default function New() {

    const [customers, setCustomers] = useState([])
    const [loadCustomer, setLoaderCustomer] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(0)
    const [complemento, setComplemento ] = useState("")
    const [assunto, setassunto ] = useState("Suporte")
    const [status, setStatus ] = useState("Aberto")
    const {user} = useContext(AuthContext)
    const [idCustomer, setIdCustomer] = useState(false)

    const {id} = useParams()
    const navigate = useNavigate()


    useEffect(() => {

        

        async function loadCustomers() {

            const querySnapshot = await getDocs(listRef).then((snapshot) => {

               let lista = []
               snapshot.forEach((doc) => {

                    lista.push({

                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia

                    })

               })

               if(snapshot.docs.size === 0) {

                    console.log("Nenhuma Empresa Encontrada")
                    setCustomers([{id: "1", nomeFantasia: "FREELA"}])
                    setLoaderCustomer(false)
                    return

               }

               if(id) {

                 loadId(lista)
                 

               }

               setCustomers(lista)
               setLoaderCustomer(false)

            }).catch(err => {

                console.log(err)
                setLoaderCustomer(false)
                setCustomers([{id: "1", nomeFantasia: "FREELA"}])

            })
        }

        loadCustomers()

    
    } , [id])


    async function loadId(lista) {

        const docRef = doc(db, "chamados", id)

        await getDoc(docRef).then( (snapshot) => {
            
            setassunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex( item => item.id == snapshot.data().clienteId)
            console.log(index)
            setCustomerSelected(index)
            setIdCustomer(true)


        }).catch(err => {

            console.log(err)
            setIdCustomer(false)

        })

    }

    function handleOptionChange(e) {

        setStatus(e.target.value)

    }

    function handleChangeSelect(e) {

        setassunto(e.target.value)

    }

    function handleChangeCustomer(e) {

        setCustomerSelected(e.target.value)
        console.log(customers[e.target.value])


    }

    async function handleRegister(e) {

        e.preventDefault();

        if(idCustomer) {

            const docRef = doc(db, "chamados", id)
            await updateDoc(docRef, {

                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid

            }).then(() => {

                toast.info("Chamado Atualizado com Sucesso!")
                setComplemento("")
                setCustomerSelected(0)
                navigate("/dashboard")
    
            }).catch(err => {
    
                toast.error("Ops Erro ao Atualizar, Tente mais Tarde!")
                console.log(err)
    
            })

            return

        }

        await addDoc(collection(db, "chamados"), {

            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid

        }).then(() => {

            toast.success("Chamado Registrado!")
            setComplemento("")
            setCustomerSelected(0)

        }).catch(err => {

            toast.error("Ops Erro ao Registrar, Tente mais Tarde!")
            console.log(err)

        })
        

    }


    return (

        <div>
            <Header />

            <div className="content">

                <Title name={idCustomer ? "Editando Chamado" : "Novo Chamado"}>

                    <FiPlusCircle size={25} />

                </Title>


                <div className="container">

                    <form classname="form-profile" onSubmit={handleRegister}>

                        <label>Clientes</label>



                            {loadCustomer ? (

                                <input type="text" disabled={true} value="Carregando ..." />

                            ) : (

                                <select value={customerSelected} onChange={handleChangeCustomer}>

                                    {customers.map((item, index) => {

                                        return(

                                            <option value={index} key={index}>
                                                {item.nomeFantasia}
                                            </option>

                                        )

                                    })}

                                </select>

                            )}

                        

                        <label>Assunto</label>

                        <select value={assunto} onChange={handleChangeSelect}>

                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>

                        </select>

                        <label>Status</label>
                        <div className="status">

                            <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={status === "Aberto"} />
                            <span>Em Aberto</span>

                            <input checked={status === "Progresso"} onChange={handleOptionChange} type="radio" name="radio" value="Progresso" />
                            <span>Progresso</span>

                            <input checked={status === "Atendido"}  onChange={handleOptionChange} type="radio" name="radio" value="Atendido" />
                            <span>Atendido</span>



                        </div>

                        <label>Complemento</label>
                        <textarea value={complemento} onChange={(e) => setComplemento(e.target.value)} type="text" placeholder="Descreva seu Problema (Opcional)"  />
                        
                        {idCustomer ? (<button type="submit">Editar</button>) : (<button type="submit">Registrar</button>)}
                        


                    </form>

                </div>

            </div>

        </div>

    )


}