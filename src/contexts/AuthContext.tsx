import firebase from "firebase";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  //Passamos uma Promise<void> porque a função signInWithGoogle é uma função assíncrona. 
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    //vai ficar monitorando os dados do usuário e quando tiver uma alteração ele irá executar todo o código abaixo. 
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
        throw new Error('Está faltando informação da conta do Google. ')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }

      // é uma boa prática sempre que tiver event listener dentro de um useEffect, nós limparmos este event listener ao final, pois pode acontecer alguns erros, como por exemplo se o component não estiver em tela, o event listener continuará tentando achar o componente e irá apressentar um erro falando que aqueles dados são undefined.
      return () => {
        unsubscribe();
      }
    })
  },[])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Está faltando informação da conta do Google. ')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }
  
  return (
    <AuthContext.Provider value={{user, signInWithGoogle}}>
      {children}
    </AuthContext.Provider>

  )
}