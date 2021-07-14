import { useState, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'

import '../styles/room.scss'
import { LikeButton } from '../components/LikeButton'

type RoomParams = {
  id: string;
}

export const Room = () => {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState('')
  const roomId = params.id
  
  const { questions, title } = useRoom(roomId)  

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
    // Adicionar toast para esses erros
      throw new Error('You mnust be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('');

  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      })
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div><RoomCode code={params.id}/></div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length > 1 ? 'perguntas' : 'pergunta'}</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="userInfo">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button></span>
            )}
            <Button className="whitespace-nowrap" type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        <div className="questionList">
          {questions.map(question => (
            <Question 
              key={question.id} 
              content={question.content} 
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}  
            >
              <LikeButton 
                onHandleClick={() => handleLikeQuestion(question.id, question.likeId)} 
                likeCount={question.likeCount}
                isLiked={question.likeId}
              />
            </Question>
          ))}
        </div>

      </main>
    </div>
  )
}
