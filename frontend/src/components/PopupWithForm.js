import React from "react";
import usePopupClose from '../hooks/usePopupClose';


export default function PopupWithForm({isOpen, onClose, name, containerClassList, title, onSubmit, children, buttonText}) {

  // вызов хука
  usePopupClose(isOpen, onClose);

  return (
    <section className={`popup popup_${name} ${isOpen ? 'popup_opened' : ''}`}>
      <div className={containerClassList}>
        {title && <h2 className="popup__title">{title}</h2>}
        <button onClick={onClose ? onClose : undefined} className="popup__btn-close" type="button" aria-label="Закрыть"></button>
        <form className="popup-form" name={name} onSubmit={onSubmit}>
          {children}
          {buttonText && <button className="popup-form__btn" type="submit">{buttonText}</button>}
        </form>
      </div>
    </section>
  );
  
}