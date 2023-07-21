// Базовый путь запросов
const BASE_URL = 'https://auth.nomoreparties.co';
// Заголовки
const headers = {
  'Content-Type': 'application/json',
}


const getResponseData = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(res.json())
}


// Запрос на сервер: РЕГИСТРАЦИЯ
export const register = ({password, email}) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      password: password,
      email: email,  
    }),
  })
  .then((res) => getResponseData(res))
}


// Запрос на сервер: АВТОРИЗАЦИЯ
export const login = ({password, email}) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      password: password,
      email: email,  
    }),
  })
  .then((res) => getResponseData(res))
}


// Запрос на сервер: ПРОВЕРКА ТОКЕНА
export const checkToken = (token) => {
  // добавить к заголовкам Bearer токен
  headers["authorization"] = `Bearer ${token}`;

  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: headers,
  })
  .then((res) => getResponseData(res))
}