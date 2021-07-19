import { useHistory, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { Question } from '../components/Question'
import { RoomHeader } from '../components/RoomHeader'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import '../styles/room.scss'

type AdminRoomParams = {
  id: string;
}

export const AdminRoom = () => {
  // const { user } = useAuth()
  const history = useHistory();
  const params = useParams<AdminRoomParams>()
  const roomId = params.id
  
  const { questions, title } = useRoom(roomId)  

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });

  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }
  return (
    <div id="page-room">
      <RoomHeader 
        imgSrc={logoImg} 
        imgAlt="letmeask"
        roomId={params.id}
        onClick={handleEndRoom}  
      />

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length > 1 ? 'perguntas' : 'pergunta'}</span>}
        </div>

        <div className="questionList">
          {questions.map(question => (
            <Question 
              key={question.id} 
              content={question.content} 
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >

              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
              
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                </>      
              )}

              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="remover pergunta" />
              </button>
            </Question>
          ))}
        </div>

      </main>
    </div>
  )
}
