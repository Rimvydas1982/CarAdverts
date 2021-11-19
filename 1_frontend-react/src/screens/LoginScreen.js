import React, { useState, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './../App';
import style from './LoginScreen.module.css';
import formstyle from './Form.module.css';

const LoginScreen = () => {
  //Hooks
  //--local state
  //----global
  const { dispatch } = useContext(UserContext);
  //----login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  //----signup form
  const [signupName, setSignupName] = useState('');
  const [signupSurname, setSignupSurname] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupErrorMessage, setSignupErrorMessage] = useState('');

  //--Refs
  const inputRef = useRef();
  const signupPasswordInputRef = useRef();
  const signupEmailInputRef = useRef();

  //--redirecting
  const history = useHistory();

  //Custom function
  const loginUser = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:5000/api/users/login', {
        email: loginEmail,
        password: loginPassword,
      })
      .then((response) => {
        const userId = response.data.userId;

        localStorage.setItem('user', userId);

        dispatch({ type: 'LOGIN', payload: userId });

        history.push('/my-account');
      })
      .catch((err) => {
        setLoginEmail('');
        setLoginPassword('');
        setLoginErrorMessage(err.response.data.message);

        inputRef.current.focus();
      });
  };

  const signupUser = (e) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      setSignupErrorMessage('Pasword do not match');

      setSignupPassword('');
      setSignupConfirmPassword('');

      signupPasswordInputRef.current.focus();

      return;
    }
    axios
      .post('http://localhost:5000/api/users/signup', {
        name: signupName,
        surname: signupSurname,
        email: signupEmail,
        password: signupPassword,
      })
      .then((response) => {
        if (response.data.registrationStatus === 'failed') {
          setSignupErrorMessage(response.data.message);
          setSignupEmail('');
          setSignupPassword('');
          setSignupConfirmPassword('');
          signupEmailInputRef.current.focus();
        } else if (response.data.registrationStatus) {
          localStorage.setItem('user', response.data.userId);
          dispatch({ type: 'REGISTER', payload: response.data.userId });
          history.push('./my-account');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <main>
      <div className={style.container}>
        <section>
          <h1 className={style.headline}>Sign up/ Log In</h1>
        </section>

        <div className={style.loginSignupContainer}>
          <section id='login' className={style.login}>
            <h2>
              <span>Have account?</span> Log In!
            </h2>

            <form
              id='logInForm'
              className={formstyle.form}
              onSubmit={loginUser}
            >
              <div className={formstyle.formControl}>
                <label className={formstyle.formLabel} htmlFor='loginEmail'>
                  Email
                </label>
                <input
                  className={formstyle.formInput}
                  type='email'
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  ref={inputRef}
                />
              </div>

              <div className={formstyle.formControl}>
                <label className={formstyle.formLabel} htmlFor='loginPassword'>
                  Password
                </label>
                <input
                  className={formstyle.formInput}
                  type='password'
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <div className={formstyle.formControl}>
                <input
                  type='submit'
                  value='Log In'
                  className={formstyle.btnSubmit}
                />
              </div>
            </form>
            {loginErrorMessage && (
              <p id='loginMessage' className={formstyle.formMessageDanger}>
                {loginErrorMessage}
              </p>
            )}
          </section>
          <section id='signup' className={style.signup}>
            <h2>
              <span>New user?</span> Sign Up!
            </h2>

            <form className='form' onSubmit={signupUser}>
              <div className={formstyle.formControl}>
                <label className={formstyle.formLabel} htmlFor='signUpName'>
                  Name
                </label>
                <input
                  className={formstyle.formInput}
                  type='text'
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>

              <div className={formstyle.formControl}>
                <label className={formstyle.formLabel} htmlFor='signUpSurname'>
                  Surname
                </label>
                <input
                  className={formstyle.formInput}
                  type='text'
                  required
                  value={signupSurname}
                  onChange={(e) => setSignupSurname(e.target.value)}
                />
              </div>

              <div className={formstyle.formControl}>
                <label className={formstyle.formLabel} htmlFor='signUpEmail'>
                  Email
                </label>
                <input
                  className={formstyle.formInput}
                  type='text'
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  ref={signupEmailInputRef}
                />
              </div>

              <div className={formstyle.formControl}>
                <label className={formstyle.formLabel} htmlFor='signUpPassword'>
                  Password
                </label>
                <input
                  className={formstyle.formInput}
                  type='password'
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  ref={signupPasswordInputRef}
                />
              </div>

              <div className={formstyle.formControl}>
                <label
                  className={formstyle.formLabel}
                  htmlFor='signUpConfirmPassword'
                >
                  Confirm Password
                </label>
                <input
                  className={formstyle.formInput}
                  type='password'
                  required
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                />
              </div>

              <div className={formstyle.formControl}>
                <input
                  type='submit'
                  value='Sign Up'
                  className={formstyle.btnSubmit}
                />
              </div>
            </form>
            {signupErrorMessage && (
              <p id='signUpMessage' className={formstyle.formMessageDanger}>
                {signupErrorMessage}
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginScreen;
