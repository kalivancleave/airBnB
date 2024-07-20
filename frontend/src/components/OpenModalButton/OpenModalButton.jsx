import { useModal } from "../../context/Modal"

function OpenModalButton({modalComponenet, buttonText, onButtonClick, onModalClose}) {
  const {setModalContent, setOnModalClose} = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponenet);
    if (typeof onButtonClick === 'function') onButtonClick();
  };

  return (
    <button onClick={onClick}>{buttonText}</button>
  )
}

export default OpenModalButton;