import classnames from 'classnames'
import { ButtonHTMLAttributes } from 'react'

import styles from './styles.module.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
}

export const Button = ({ 
  isOutlined = false,
  className,
  ...props 
}: ButtonProps) => {
  return (
    <button 
      className={classnames(className, 
          isOutlined 
            ? `${styles.button} ${styles.outLined}` 
            : styles.button)
        } 
      {...props}
    ></button>
  )
}