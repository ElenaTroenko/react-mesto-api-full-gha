import React from 'react';
import '../components/style/Login.css';
import { LoadingContext } from "../contexts/LoadingContext";

const Login = ({onLogin}) => {

  // подписка на контекст LoadingContext
  const isLoading = React.useContext(LoadingContext);
  // Текст кнопки сабмита
  const buttonText = isLoading ? 'Выполняется вход...' : 'Войти';

  // стэйт данных формы
  const [formValue, setFormValue] = React.useState({
    email: '',
    password: '',
  });

  // хэндлер изменения инпутов
  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  // Хэндлер сабмита
  const handleSubmit = (e) => {
    e.preventDefault();  // не перегружать страницу
    
    onLogin(formValue);
  }

  return (
    <section className="login">
      <h2 className="login__title">Вход</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <input onChange={handleChange} value={formValue.email} className="login__input login__email" name="email" type="email" placeholder="Email" required></input>
        <input onChange={handleChange} value={formValue.password} className="login__input login__password" name="password" type="password" placeholder="Пароль" required></input>
        <button className="login__button">{buttonText}</button>
      </form>
    </section>
  )
}

export default Login;