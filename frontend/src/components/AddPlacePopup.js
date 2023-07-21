import React from "react";
import PopupWithForm from "./PopupWithForm";
import { LoadingContext } from "../contexts/LoadingContext";


export default function AddPlacePopup({isOpen, onAddPlace, onClose}) {

  // подписка на контекст LoadingContext
  const isLoading = React.useContext(LoadingContext);

  // переменные состояния
  const [placeName, setPlaceName] = React.useState('');
  const [placeLink, setPlaceLink] = React.useState('');
  

  // жизненный цикл
  React.useEffect(() => {
    setPlaceName('');
    setPlaceLink('');
  }, [isOpen]);

  // Хэндлер сабмита формы
  function handleSubmit(e) {
    e.preventDefault();  // не перегружать страницу

    const placeData = {name: placeName, link: placeLink}
    onAddPlace(placeData);
  }

  return (

    <PopupWithForm
      name="new_place"
      title="Новое место"
      containerClassList="popup__container"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={isLoading ? 'Создание...' : 'Создать'}
      onSubmit={handleSubmit}
    >
      <input value={placeName} id="input-place" className="popup-form__input popup-form__input_place_name" type="text" name="placename"
        placeholder="Название" minLength="2" maxLength="30" required onChange={(e) => setPlaceName(e.target.value)} />
      <span className="popup-form__input-error input-place-error">Вы пропустили это поле.</span>
      <input value={placeLink} id="input-url" className="popup-form__input popup-form__input_place_link " type="url" name="placelink"
        placeholder="Ссылка на картинку" required onChange={(e) => setPlaceLink(e.target.value)} />
      <span className="popup-form__input-error input-url-error">Введите адрес сайта.</span>
    </PopupWithForm>

  )
}