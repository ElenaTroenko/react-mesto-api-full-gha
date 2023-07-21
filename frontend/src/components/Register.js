import React from 'react';
import '../components/style/Register.css'
import { Link } from 'react-router-dom';
import { LoadingContext } from "../contexts/LoadingContext";


const Register = ({onRegister}) => {

  // подписка на контекст LoadingContext
  const isLoading = React.useContext(LoadingContext);
  // Текст кнопки сабмита
  const buttonText = isLoading ? 'Регистрация...' : 'Зарегистрироваться';
  // стэйт полей формы
  const [formValue, setFormValue] = React.useState({
      email: '',
      password: '',
  });

  // хэндлер изменений инпутов
  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  // хэндлер сабмита
  const handleSubmit = (e) => {
    e.preventDefault();  // не перегружать страницу
    
    onRegister(formValue);
  }

    return (

      <section className="register">
        <h2 className="register__title">Регистрация</h2>
        <form className="register__form" onSubmit={handleSubmit}>
          <input value={formValue.email} onChange={handleChange} className="register__input register__email" name="email" type="email" placeholder="Email" required></input>
          <input value={formValue.password} onChange={handleChange} className="register__input register__password" name="password" type="password" placeholder="Пароль" required></input>
          <button className="register__button">{buttonText}</button>
        </form>
        <p className="register__question-text">Уже зарегистрированы? <Link className="register__question-link" to="/signin">Войти</Link></p>
      </section>

  )
}

export default Register;