import React from 'react';
import { Route, Routes } from "react-router-dom";
import '../index.css';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import { register, login, checkToken } from '../utils/auth';
import InfoTooltip from './InfoTooltip';
import { useNavigate } from 'react-router-dom';
import errorImage from '../images/icons/msgError.svg';
import okImage from '../images/icons/msgOk.svg';
import { Navigate, useHistory } from 'react-router-dom';
import { UserContext } from '../contexts/CurrentUserContext';
import { LoadingContext } from '../contexts/LoadingContext';
import api from "../utils/api.js";
import AddPlacePopup from './AddPlacePopup';


function App() {
  // переменные состояния
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);  // булево "попап открыт" (редакт. проф.)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);        // булево "попап открыт" (добавить новое место)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);    // булево "попап открыт" (редакт. аватар)
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);            // булево "попап открыт" (Сообщение)
  const [selectedCard, setSelectedCard] = React.useState({});                         // текучая (выбранная) карта
  const [currentUser, setCurrentUser] = React.useState({});                           // текущий пользователь
  const [isLoading, setIsLoading] = React.useState(false);                            // булево процесса загрузки
  const [cards, setCards] = React.useState([]);                                       // массив карточек мест
  const [loggedIn, setLoggedIn] = React.useState(false);                              // булево "пользователь залогинился"
  const [email, setEmail] = React.useState('');                                       // стэйт email пользователя
  const [toolTipMessage, setToolTipMessage] = React.useState('');                     // сообщение в infoToolTip
  const [toolTipImage, setToolTipImage] = React.useState('');                         // картинка в infoToolTip
  const [redirectPath, setRedirectPath] =React.useState('');                          // путь для редиректа при закрытии infoToolTip

  // хук useNavigate
  const navigate = useNavigate();

  // жизненный цикл
  React.useEffect(() => {
    Promise.all([
      api.getUserInfo(),
      api.getInitialCards(),
    ])
    .then(([userData, defaultItems]) => {
      // установить информацию о пользователе
      setCurrentUser(userData);

      // рендеринг всех карточек с сервера
      setCards(defaultItems);
    })
    .catch((err) => {
      handleError(err);
    });

    const token = getUserToken();
    if (token) {
      checkToken(token)
      .then((res) => {
        if (res.data && res.data.email) {
          setEmail(res.data.email);
          setLoggedIn(true);
          navigate('/');
        }
      })
      .catch((err) => {
        handleError(err);
      });
    }
  }, []);

  // Устанавливает email (стэйт), запрашивая данные на сервере
  const setUserEmailbyToken = (token) => {
    checkToken(token)
    .then((res) => {
      if (res.data && res.data.email) {
        setEmail(res.data.email);
      }
    })
    .catch((err) => {
      handleError(err);
    })
  }

  // хэндлер выхода пользователя из системы
  const handleUserExit = () => {
    localStorage.removeItem('userToken');
    setCurrentUser({});
    setLoggedIn(false);
    navigate('/signin');
  }

  // получить токен. Возвращает токен из localStorage
  const getUserToken = () => {
    return localStorage.getItem('userToken');
  }

  // Сохранить токен. Сохраняет токен в localStorage
  const saveUserToken = (token) => {
    localStorage.setItem('userToken', token);
  }
    
  // Хэндлер логина
  const handleLogin = (data) => {
    setIsLoading(true);

    login(data)
    .then((data) => {
      if (data.token) {
        saveUserToken(data.token);
        setUserEmailbyToken(data.token);
        setLoggedIn(true);
        navigate('/');
      } 
    })
    .catch((err) => {
      err.then((res)=>{
        showToolTip({
          message: res.error ? res.error : (res.message ? res.message : 'Что-то пошло не так! Попробуйте еще раз.'),
          image: errorImage,
          redirectTo: '',
        });
      })
    })
    .finally(() => {
      setIsLoading(false)
    });
  }

  // Хэндлер закрытия попапа infoToolTip
  const handleInfoToolTipClose = () => {
    closeAllPopups();
    
    // Если стэйт redirectPath есть, то редиректить на путь, указанный в этом стэйте
    // с помощью navigate и обнулить стэйт redirectPath
    if (redirectPath) {
      const redirectTo = redirectPath;
      setRedirectPath('');
      
      navigate(redirectTo);
    }
  }

  // Хэндлер регистрации
  const handleRegister = (data) => {
    setIsLoading(true);

    register(data)
    .then((data) => {
      if (data.data && data.data._id) {
        showToolTip({
          message: 'Вы успешно зарегистрировались!',
          image: okImage,
          redirectTo: '/signin',
        });
      }
    })
    .catch((err) => {
      err.then((res)=>{
        showToolTip({
          message: res.error ? res.error : (res.message ? res.message : 'Что-то пошло не так! Попробуйте еще раз.'),
          image: errorImage,
          redirectTo: '',
        });
      })
    })
    .finally(() => {
      setIsLoading(false)
    });
  }

  // Показать попап infoToolTip
  const showToolTip = ({message, image, redirectTo}) => {
    setToolTipMessage(message);
    setToolTipImage(image);
    setRedirectPath(redirectTo);

    setIsInfoToolTipOpen(true);
  }

  // хэндлер лайка карточки
  function handleCardLike(card) {
    // Проверяем, есть ли лайк пользователя на этой карточке
    const isLiked = card.likes.some( user => user._id === currentUser._id);
    
    // Отправляем запрос в API и получаем обновлённые данные карточки
    // card - текущая карта (по сердечку которой кликнули)
    // newCard (новая карта, которую вернул сервер)
    // cardElement (существующий элемент массива карт в стэйте, карта)
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards(cards.map((cardElement) => cardElement._id === card._id ? newCard : cardElement));
    })
    .catch((err) => {
      handleError(err);
    })
  }

  // хэндлер удаления карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      setCards(cards.filter((cardElement) => cardElement._id !== card._id))
    })
    .catch((err) => {
      handleError(err);
    })
  }

  // хэндлер добавления нового места
  function handleAddPlaceSubmit(placeData) {
    setIsLoading(true);

    api.postCard(placeData)
    .then((newData) => {
      setCards([newData, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      setIsLoading(false)
    });
  }

  // хэндлер обновления данных пользователя
  function handleUpdateUser(data) {
    setIsLoading(true);

    api.setUserInfo(data)
    .then((newData) => {
      setCurrentUser(newData);
      closeAllPopups();
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      setIsLoading(false)
    });
  }

  // хэндлер обновления аватара пользователя
  function handleUpdateAvatar(data, ref) {
    setIsLoading(true);

    api.setUserAvatar(data.avatar)
    .then((newData) => {
      setCurrentUser(newData);
      ref.current.value='';
      closeAllPopups();
    })
    .catch((err) => {
      handleError(err);
    })
    .finally(() => {
      setIsLoading(false)
    });
  }

  // хэндлер клика по кнопке редактирования аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  // хэндлер клика по кнопке редактирования профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  // хэндлер клика по кнопке добавления нового места
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  // хэндлер закрытия всех попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard({});
  }

  // хэндлер клика по карточке
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // хэндлер ошибки
  function handleError(err) {
  // определить, err - это строка или нет (нет может возникнуть при отсутствии интернета, тогда это будет объект)
  if (typeof(err) != 'string') {
    err = 'Неизвестная ошибка. Проверьте соединение с Интернетом.'
  }
  
  console.log(err);
}

  return (
    <UserContext.Provider value={currentUser}>
      <LoadingContext.Provider value={isLoading}>
        <div className="page">
          <Routes>
            <Route path="/" element={<ProtectedRoute element={({...props})=>
              <>
                <Header email={email} onSignOut={handleUserExit} {...props}/>
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                />
                <Footer />
              </>
            } loggedIn={loggedIn} />} />
            <Route path="/signup" element={
              <>
                <Header
                  loggedIn={loggedIn}
                  showLogin={true}
                  onSignOut={handleUserExit}
                  email={email}
                />
                <Register 
                  onRegister={handleRegister}
                />
              </> 
            } />
            <Route path="/signin" element={ 
                <>
                  <Header
                    loggedIn={loggedIn}
                    showRegister={true}
                    onSignOut={handleUserExit}
                    email={email}
                  />
                  <Login
                    onLogin={handleLogin}
                  />
                </>
            } />
            <Route path="*" element={<Navigate to="/" />}/>
          </Routes>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen} 
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen} 
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <PopupWithForm
            name="class_confirmation"
            title="Вы уверены?"
            containerClassList="popup__container popup__container_type_confirmation"
            isOpen={false}
            onClose={closeAllPopups}
            buttonText='Да'
          >
          
          </PopupWithForm>

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

          <InfoTooltip 
            isOpen={isInfoToolTipOpen} 
            onClose={handleInfoToolTipClose}
            msg={toolTipMessage}
            img={toolTipImage}
          />

        </div>

      </LoadingContext.Provider>
    </UserContext.Provider>
  );
}


export default App;