import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { UserContext } from './../App';
import Button from '../components/Button';
import style from './MyAccountScreen.module.css';

const MyAccountScreen = () => {
  //API
  const host = 'http://localhost:5000';
  const GET_USER_URI = `${host}/api/users/`;
  const DELETE_CAR_URI = `${host}/api/cars/delete/`;
  const ADD_CAR_URI = `${host}/api/cars/add/`;

  //Hooks
  //--global
  const { dispatch } = useContext(UserContext);
  //--state
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState([]);
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
  });
  const [message, setMessage] = useState('');

  //--redirecting
  const history = useHistory();

  //--side effects
  useEffect(() => {
    let userFromLocalStorageId = localStorage.getItem('user');
    setUserId(userFromLocalStorageId);

    return axios
      .get(GET_USER_URI + userFromLocalStorageId)
      .then((response) => setUserData(response.data))
      .catch((err) => console.log(err));
  }, [GET_USER_URI]);
  //--Custom functions
  const logOutUser = () => {
    dispatch({ type: 'LOGOUT', user: '' });
    localStorage.removeItem('user');
    history.push('/login');
  };

  const deleteUserCar = (Id) => {
    return axios
      .delete(DELETE_CAR_URI + Id)
      .then(() => window.location.reload(false));
  };
  const addNewCar = (e) => {
    e.preventDefault();
    if (newCar.make && newCar.model && newCar.year && newCar.price) {
      axios
        .put(ADD_CAR_URI + userId, newCar)
        .then(() => window.location.reload(false))
        .catch((err) => console.log(err));
      setMessage('New car added');
    } else {
      setMessage('Please fill all fields');
    }
  };
  return (
    <main>
      <h4>Welcome,{userData.name}</h4>
      <div className={style.user}>
        <div className={style.userInfo}>
          <h3>
            {userData.name} {userData.surname}
          </h3>
          <p>{userData.email}</p>
          <p>
            Your Cars:
            {userData.cars ? userData.cars.length : `User have no cars`}
          </p>
          <Button text='Logout' action={logOutUser} />
        </div>
      </div>
      <div className={style.userCars}>
        <table>
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.cars ? (
              userData.cars.map((item) => (
                <tr key={item._id}>
                  <td>{item.make}</td>
                  <td>{item.model}</td>
                  <td>{item.year}</td>
                  <td>{item.price}</td>
                  <td>
                    <Button
                      text='Delete'
                      action={() => deleteUserCar(item._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>This user have no cars</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={style.addNewCar}>
        <form>
          <label htmlFor='make'>Make</label>
          <input
            type='text'
            value={newCar.make}
            onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
          />
          <label htmlFor='model'>Model</label>
          <input
            type='text'
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
          />
          <label htmlFor='year'>Year</label>
          <input
            type='number'
            value={newCar.year}
            onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
          />
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            value={newCar.price}
            onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
          />
          <Button text='Add new car' action={addNewCar} />
        </form>
        {message && <p>{message}</p>}
      </div>
    </main>
  );
};

export default MyAccountScreen;
