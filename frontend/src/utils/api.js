class Api {
  // принимает объект данных настроек и коллбэк для вывода ошибок (опционально)
  constructor({baseUrls, headers}) {
    this._baseUrls = baseUrls;  // базовые url-ы
    this._headers = headers;    // стандартные заголовки запросов
  }

  _callError(){}
  
  _getResponseData(res, errMsg) {
      if (res.ok) {
        return res.json()
      }
      return Promise.reject(`${errMsg}: ${res.status}`);
    }

  // запросить карточки (требует коллбэк для передачи массива объектов-данных карточек)
  getInitialCards() {
    return fetch(this._baseUrls.cardsUrl, {
      method: 'GET',
      headers: this._headers,
    })
    .then((res) => this._getResponseData(res, 'Ошибка загрузки карточек мест'))
  }

  // запросить данные пользователя (требует колбэк для передачи объекта-данных и опциональный колбэк
  // для его вызова в случае успеха запроса данных пользователя)
  getUserInfo() {
    return fetch(this._baseUrls.userInfoUrl, {
      method: 'GET',
      headers: this._headers,
    })
    .then((res) => this._getResponseData(res, 'Ошибка загрузки информации о пользователе'))
  }

  // запросить пользовательский аватар (требует колбэк для передачи строки аватара)
  getUserAvatar() {
    return fetch(this._baseUrls.userAvatarUrl, {
      method: 'GET',
      headers: this._headers,
    })
    .then((res) => this._getResponseData(res, 'Ошибка загрузки аватара пользователя'))
  }

  // отправить изменения в профиле пользователя (требует объект данных профиля пользователя и 
  // коллбэк для отправки нового объекта данных пользователя, полученного от сервера)
  setUserInfo(data) {
    return fetch(this._baseUrls.userInfoUrl, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data),
    })
    .then((res) => this._getResponseData(res, 'Ошибка отправки информации о пользователе'))
  }

  // отправить новый аватар пользователя (требует строку для аватара пользователя и 
  // коллбэк для отправки новой строки объекта данных пользователя, полученного от сервера)
  setUserAvatar(avatarLink) {
    return fetch(this._baseUrls.userAvatarUrl, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({avatar: avatarLink}),
    })
    .then((res) => this._getResponseData(res, 'Ошибка отправки аватара пользователя'))
  }

  // отправить новую карту места (требует объект данных карты места и 
  // коллбэк для передачи нового объекта карты места, полученного в ответ с сервера)
  postCard(data) {
    return fetch(this._baseUrls.cardsUrl, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data),
    })
    .then((res) => this._getResponseData(res, 'Ошибка отправки информации о новом месте'))
  }

  // удалить карту места (требует Id карты места)
  deleteCard(cardId) {
    // сформировать url запроса
    const cardUrl = `${this._baseUrls.cardsUrl}/${cardId}`;

    return fetch(cardUrl, {
      method: 'DELETE',
      headers: this._headers,
    })
    .then((res) => this._getResponseData(res, 'Ошибка удаления карточки'))
  }

  // меняет статус лайка карточки (требует Id карты и булево лайка)
  changeLikeCardStatus(cardId, liked) {
    // сформировать url запроса
    const cardUrl = `${this._baseUrls.cardsUrl}/${cardId}/likes`;

    if (liked) {
      return fetch(cardUrl, {
        method: 'PUT',
        headers: this._headers,
      })
      .then((res) => this._getResponseData(res, 'Ошибка отправки лайка для карточки'))
    } else {
      return fetch(cardUrl, {
        method: 'DELETE',
        headers: this._headers,
      })
      .then((res) => this._getResponseData(res, 'Ошибка отзыва лайка для карточки'))
    }
  }
}


const api = new Api(
  {
    baseUrls: {
      cardsUrl: 'https://mesto.nomoreparties.co/v1/cohort-64/cards',
      userInfoUrl: 'https://nomoreparties.co/v1/cohort-64/users/me',
      userAvatarUrl: 'https://nomoreparties.co/v1/cohort-64/users/me/avatar',
    },
    headers: {
      authorization: '7fa7d08a-8e71-4306-afc1-47a65e80e1dc',
      'Content-Type': 'application/json'
    },
  }
);


export default api;