import { useState, createContext, useEffect, Children } from "react";
import {auth,db} from "../services/firebaseConnection"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth"
import {doc, getDoc, setDoc} from "firebase/firestore"
import { useNavigate } from "react-router-dom";

import {toast} from "react-toastify"

export const AuthContext = createContext({})


export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading ,setLoading] = useState(true)

    const navigate = useNavigate()


    useEffect(() => {

        async function loadUser() {

            const storageUser = localStorage.getItem("@ticketsPRO")

            if(storageUser) {

                setUser(JSON.parse(storageUser))
                setLoading(false)

            }

            setLoading(false)

        }

        loadUser()

    }, [])


    async function signIn(email,password) {

        setLoadingAuth(true)
        await signInWithEmailAndPassword(auth, email, password).then(async (value) => {

            let uid = value.user.uid
            
            const docRef = doc(db, "users", uid)

            const docSnap = await getDoc(docRef)

            let data = {

                uid: uid,
                nome: docSnap.data().name,
                email: email,
                avatarUrl: docSnap.data().avatarUrl,

            }

            setUser(data)
            storageUser(data)
            setLoadingAuth(false)
            toast.success("Bem Vindo(a) de Volta!")
            navigate("/dashboard")

        }).catch( (err) => {

            if(err.code === "auth/invalid-credential") {

                toast.error("E-mail ou senha inválidos, por favor tente novamente")

            }
            console.log(err)
            setLoadingAuth(false)
            

        })

    }  


    //Cadastr um Novo User
    async function signUp(email,password,name) {

        setLoadingAuth(true)
        await createUserWithEmailAndPassword(auth, email, password).then( async (value) => {

            let uid = value.user.uid

            await setDoc(doc(db, "users", uid), {

                nome: name,
                avatarUrl: null

            }).then(() => {

                let data = {

                    uid: uid,
                    nome: name,
                    email: email,
                    avatarUrl: null,

                }

                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success("Seja Bem Vindo ao Sistema!")
                navigate("/dashboard")

            })

        }).catch( (err) => {

            if(err.code === "auth/email-already-in-use") {

                toast.error("E-mail já cadastrado")

            }else if(err.code === "auth/weak-password") {

                toast.error("Senha muito fraca.")

            }
            console.log(err)
            setLoadingAuth(false)
            


        })

    }


    function storageUser(data) {

        localStorage.setItem("@ticketsPRO", JSON.stringify(data))

    }

    async function logout() {

        await signOut(auth)
        localStorage.removeItem("@ticketsPRO")
        setUser(null)

    }

    return (

        <AuthContext.Provider 
        value={{
            signed: !!user,
            user,
            signIn,
            signUp,
            logout,
            loadingAuth,
            loading,
            storageUser,
            setUser
        }}
        
        >

            {children}

        </AuthContext.Provider>

    )

}