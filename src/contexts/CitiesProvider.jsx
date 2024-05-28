import { useEffect, useState, useContext, createContext } from 'react';

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:8000';

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);
  return <CitiesContext.Provider value={{ cities, isLoading }}>{children}</CitiesContext.Provider>;
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error('useCities must be used within a CitiesProvider Context');
  }
  return context;
}

export { CitiesProvider, useCities };
