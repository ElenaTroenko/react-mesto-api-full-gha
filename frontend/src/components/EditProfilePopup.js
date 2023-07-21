import React from "react";
import PopupWithForm from "./PopupWithForm";
import { UserContext } from "../contexts/CurrentUserContext";
import { LoadingContext } from "../contexts/LoadingContext";


export default function EditProfilePopup({isOpen, onUpdateUser, onClose}) {

  // подписка на контекст UserContext
  const currentUser = React.useContext(UserContext);
  // подписка на контекст LoadingContext
  const isLoading = React.useContext(LoadingContext);

  // переменные состояния
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  // жизненный цикл
  React.useEffect(() => {
    currentUser.name && setName(currentUser.name);
    currentUser.about && setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  // Хэндлер сабмита формы
  function handleSubmit(e) {
    e.preventDefault();  // не перегружать страницу
    
    onUpdateUser({
      name,
      about: description,
    });
  }

return (

    <PopupWithForm 
      name="edit_profile"
      title="Редактировать профиль"
      containerClassList="popup__container"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={isLoading ? 'Сохранение...' : 'Сохранить'}
      onSubmit={handleSubmit}
    >
      <input id="input-name" className="popup-form__input popup-form__input_profile_name" type="text" name="name"
        value={name} placeholder="Имя" minLength="2" maxLength="40" required autoComplete="off" onChange={(e) => setName(e.target.value)} />
      <span className="popup-form__input-error input-name-error">Вы пропустили это поле.</span>
      <input id="input-yourself" className="popup-form__input popup-form__input_profile_activity" type="text"
        name="yourself" value={description} placeholder="О себе" minLength="2" maxLength="200" required autoComplete="off" onChange={(e) => setDescription(e.target.value)}/>
      <span className="popup-form__input-error input-yourself-error">Вы пропустили это поле.</span>
    </PopupWithForm>

  )

}