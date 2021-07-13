import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'
import { Link, useHistory } from 'react-router-dom'

import { Banner } from '../components/Banner'
import { FormNewRoom } from '../components/FormNewRoom'

import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'

export const NewRoom = () => {
  const { user } = useAuth()
  const history = useHistory()
  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms')

    const firebaseRoom = roomRef.push({
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <Banner />
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <FormNewRoom 
            onSubmit={handleCreateRoom} 
            onChange={setNewRoom} 
            inputValue={newRoom} 
            inputPlaceholder="Nome da sala"
            btnText="Criar sala" 
            className="formCreateRoom"
            />
          <span>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></span>
        </div>
      </main>
    </div>
  )
}