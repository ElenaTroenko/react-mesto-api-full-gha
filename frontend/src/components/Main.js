import React from "react";
import Card from "./Card.js";
import { UserContext } from "../contexts/CurrentUserContext.js";


export default function Main({onEditAvatar, onEditProfile, onAddPlace, cards, onCardClick, onCardLike, onCardDelete}) {
  
  // Подписка на контекст UserContext
  const currentUser = React.useContext(UserContext);

  return (

    <main className="content">
      <section className="profile">
        <div onClick={onEditAvatar} className="profile__wrap">
          <div className="profile__icon"></div>
          <img className="profile__foto" src={currentUser.avatar} alt="Фото профиля" />
        </div>
        <div className="profile__about-user">
          <div className="profile__main">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button onClick={onEditProfile} className="profile__btn-edit" type="button" aria-label="Редактировать профиль "></button>
          </div>
          <p className="profile__about-yourself">{currentUser.about}</p>
        </div>
        <button onClick={onAddPlace} className="profile__btn-place" type="button" aria-label="Добавить карточку"></button>
      </section>
      <section className="foto-card" aria-label="карточки с фотографиями">
        {cards.map((card) => {
            return (
              <Card 
                key={card._id}
                card={card}
                onCardClick={onCardClick}
                onCardLike={(card)=>onCardLike(card)}
                onCardDelete={(card)=>onCardDelete(card)}
              />
            )
          })
        }
      </section>
    </main>

  );
}