import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import style from './Header.module.css';

const Header = () => {
  //Hooks
  //--state
  const { state, dispatch } = useContext(UserContext);
  //--side effects
  useEffect(() => {
    //if user is loged in
    if (localStorage.getItem('user')) {
      dispatch({
        type: 'LOGIN',
        payload: localStorage.getItem('user'),
      });
    } else {
      console.log('user not founded');
    }
  }, [dispatch]);
  return (
    <header className={style.header}>
      <div className={style.container}>
        <div>Cars Shop</div>
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            {state.user ? (
              <li>
                <Link to='/my-account'>My Account</Link>
              </li>
            ) : (
              <li>
                <Link to='/login'>Log in / Sign Up</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
