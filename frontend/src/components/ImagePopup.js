import React from "react";
import usePopupClose from '../hooks/usePopupClose';



export default function ImagePopup(props) {

  // вызов хука
  usePopupClose(props?.card, props.onClose);

  return (

    <section className={`popup popup-zoom ${props.card._id ? 'popup_opened' : ''}`} aria-label="изменение масштаба изображения">
      <figure className="popup-zoom__picture">
        <button onClick={props.onClose ? props.onClose : undefined} className="popup-zoom__btn-close" aria-label="Закрыть"></button>
        <img className="popup-zoom__image" src={props.card.link} alt={props.card.name} />
        <figcaption className="popup-zoom__text">{props.card.name}</figcaption>
      </figure>
    </section>
    
  );

}