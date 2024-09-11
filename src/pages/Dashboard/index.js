import { AuthContext } from "../../contexts/auth";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";

import "./dashboard.css";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { format } from "date-fns";

const listRef = collection(db, "chamados");

export default function Dashboard() {
    const { logout } = useContext(AuthContext);
    const [cliente, setCliente] = useState("")
    const [isClick, setIsClick] = useState(false)
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState({})

    useEffect(() => {
        async function loadChamados() {
            const q = query(listRef, orderBy("created", "desc"), limit(5));
            const querySnapshot = await getDocs(q);
            setChamados([]);
            await updateState(querySnapshot);
            setLoading(false);
        }

        loadChamados();

        return () => {};
    }, []);

    useEffect(() => {

        async function verifyClient() {

            if(cliente == "") {

                const q = query(listRef, orderBy("created", "desc"), limit(5));
                const querySnapshot = await getDocs(q);
                setChamados([]);
                await updateState(querySnapshot);
                setLoading(false);
                setIsEmpty(false)
    
            }

        }

        verifyClient()

    }, [cliente])

    useEffect(() => {

        async function verifyClient() {

            if(chamados.length == 0) {

                const q = query(listRef, orderBy("created", "desc"));
                const querySnapshot = await getDocs(q);
                setChamados([]);
                await updateState(querySnapshot);
                setLoading(false);
            }


        }       
        
        verifyClient()

    }, [chamados])

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                });
            });

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastDocs(lastDoc);

            setChamados((prevChamados) => [...prevChamados, ...lista]);
        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className="content">
                    <Title name="Tickets">
                        <FiMessageSquare size={25} />
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando Chamados......</span>
                    </div>
                </div>
            </div>
        );
    }

    async function handleMore() {
        setLoadingMore(true);
        const q = query(listRef, orderBy("created", "desc"), startAfter(lastDocs), limit(5));
        const querySnapshot = await getDocs(q);

        await updateState(querySnapshot);
    }

    function toggleModal(item) {

        setShowPostModal(!showPostModal)
        setDetail(item)
        
    }

    async function handleUpdate(e) {

        setCliente(e.target.value)
        
        if(!isClick) {

            setChamados([])
            const querySnapshot = await getDocs(listRef)
            updateState(querySnapshot)
        }
        setIsClick(true)
        setIsEmpty(true)


        var item = chamados.filter(i =>  i.cliente.toLowerCase().startsWith(e.target.value.toLowerCase()))
        setChamados(item)
        
        

    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Tickets">
                    <FiMessageSquare size={25} />
                </Title>
                <>                              
                <div className="search">
                    <FiSearch className="icon-search" size={38} color="#fff" />
                        <input
                        value={cliente}
                        onChange={handleUpdate}
                        placeholder="Digite o cliente que deseja pesquisar"
                        type="text" 
                         />
                </div>

                    {chamados.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum Chamado Encontrado...</span>
                            <Link className="new" to="/new">
                                <FiPlus color="#fff" size={25} />
                                Novo Chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            
                            <Link className="new" to="/new">
                                <FiPlus color="#fff" size={25} />
                                Novo Chamado
                            </Link>
                            

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.cliente}</td>
                                                <td data-label="Assunto">{item.assunto}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{ backgroundColor: item.status === "Aberto" ? "#5cb85c" : "#999"}}>{item.status}</span>
                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormat}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{ backgroundColor: "#3584f6" }}>
                                                        <FiSearch onClick={() => toggleModal(item)} color="#fff" size={17} />
                                                    </button>

                                                    <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: "#f6a935" }}>
                                                        <FiEdit2 color="#fff" size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {loadingMore && <h3>Buscando mais Chamados....</h3>}
                            {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar Mais</button>}
                        </>
                    )}
                </>
            </div>
            {showPostModal && <Modal conteudo={detail} close={() => setShowPostModal(!showPostModal)} /> }
        </div>
    );
}
