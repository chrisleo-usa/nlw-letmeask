import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"


type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

// Para dizer que o tipo é um objeto chamamos de Record e nesse caso recebe 2 parâmetros, primeiro string, que é o Id da room e o segundo outro objeto, que é questions. Por saber quais são as propriedades dentro de questions, podemos representar este objeto por {}
type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

export const useRoom = (roomId: string) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(()=>{
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => { //once e val são do firebase. once quer dizer ouvir o evento apenas uma vez, se houvessem mais vezes seria on. E o val é para buscar os valores que estão ali. 
      const databaseRoom = room.val() // Caso a aplicação cresça, é necessário utilizar outras regras do firebase (child added, child changed, removed...) ao invés do val, por questões de performance. 
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    // remove o listener 
    return () => {
      roomRef.off('value')
    }

  }, [roomId, user?.id])

  return { questions, title }
}