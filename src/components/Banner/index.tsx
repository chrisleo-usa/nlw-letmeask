import illustrationImg from '../../assets/images/illustration.svg'

import styles from './styles.module.scss'

export const Banner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
      </div>
      <div className={styles.content}>
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </div>
    </div>
  )
}