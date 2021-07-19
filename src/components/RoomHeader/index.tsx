import { Button } from "../Button/Button"
import { RoomCode } from "./RoomCode"

interface RoomHeaderProps {
  imgSrc: string;
  imgAlt: string;
  roomId: string;
  onClick?: () => void;
}

export const RoomHeader = ({
  imgSrc,
  imgAlt,
  roomId,
  onClick
}: RoomHeaderProps) => {
  return (
    <header>
      <div className="content">
        <img src={imgSrc} alt={imgAlt} />
        <div>
          <RoomCode code={roomId}/>
          {onClick && (
            <Button isOutlined onClick={onClick}>
              Encerrar sala
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}