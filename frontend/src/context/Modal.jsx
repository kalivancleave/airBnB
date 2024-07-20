import {useRef, createContext, useState, useContext} from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = createContext();

export function ModalProvider({children}) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null); //clear the modal contents
    //if callback function is truthy call the callback function and reset it to null
    if(typeof onModalClose === 'function'){
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef, //reference to modal div
    modalContent, //react component to render inside modal
    setModalContent, //function to set the react component to render inside modal
    setOnModalClose, //function to set the callback function to be callend with the modal is closing
    closeModal //function to close the modal
  };

  return(
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  )
}

export function Modal() {
  const {modalRef, modalContent, closeModal} = useContext(ModalContext);
  //if there is no div referenced by the modalRef or modalContent is not a truthy value, render nothing
  if(!modalRef || !modalRef.current || !modalContent) return null;

  //render the following component to the div referenced by the modalRef
  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">{modalContent}</div>
    </div>,
    modalRef.current
  )
}

export const useModal = () => useContext(ModalContext)