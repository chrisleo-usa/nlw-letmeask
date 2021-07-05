import { ReactNode } from 'react'
import styles from './styles.module.scss'

interface QuestionProps {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children?: ReactNode;
}

export const Question = ({ 
  content, 
  author, 
  children 
}: QuestionProps) => {
  return (
    <div className={styles.question}>
      <p>{content}</p>
      <footer>
        <div className={styles.userInfo}>
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>

        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}