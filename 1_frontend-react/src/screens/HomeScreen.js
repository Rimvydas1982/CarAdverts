import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './HomeScreen.module.css';

const HomeScreen = () => {
  //Hooks
  //--state
  const [cars, setCars] = useState([]);

  //--Side effects
  useEffect(() => {
    axios
      .get('https://car-adverts-simulation.herokuapp.com/api/cars')
      .then((response) => {
        setCars(response.data);
      });
  }, []);

  return (
    <main className={style.main}>
      <h3>All cars</h3>

      <section className={style.section}>
        {cars.map((item) =>
          item.cars.map((car) => (
            <div key={car._id}>
              <h4>
                {car.make}-{car.model}
              </h4>
              <p>Year: {car.year}</p>
              <p>Price: {car.price}</p>
              <p>
                Seller: {item.name} {item.surname}
              </p>
              <p>Email:{item.email}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default HomeScreen;
