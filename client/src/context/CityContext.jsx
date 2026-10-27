import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const CityContext = createContext(null);

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('imovies_city') || 'Mumbai';
  });

  const [availableCities, setAvailableCities] = useState([
    'Mumbai',
    'Delhi-NCR',
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Pune'
  ]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await API.get('/theatres/cities');
        if (res.data.cities && res.data.cities.length > 0) {
          setAvailableCities(res.data.cities);
        }
      } catch (err) {
        console.error('Failed to fetch cities list', err);
      }
    };
    fetchCities();
  }, []);

  const changeCity = (newCity) => {
    setSelectedCity(newCity);
    localStorage.setItem('imovies_city', newCity);
  };

  return (
    <CityContext.Provider value={{ selectedCity, changeCity, availableCities }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

