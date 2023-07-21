import React from 'react';
import '../components/style/InfoToolTip.css';


const InfoTooltip = ({isOpen, onClose, img, msg}) => {

  return (
    <section className={`popup popup_info ${isOpen ? 'popup_opened' : ''}`}>
      <div className='popup__container'>
        <button onClick={onClose ? onClose : undefined} className="popup__btn-close" type="button" aria-label="Закрыть"></button>
        <img className="image-error" src={img} alt='Иконка сообщения' />
        <h2 className="info-message">{msg}</h2>
      </div>
    </section>
  )

}

export default InfoTooltip;