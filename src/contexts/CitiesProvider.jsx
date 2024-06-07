import { useEffect, useContext, createContext, useReducer } from 'react';

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:8000';

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'cities/loaded':
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case 'city/loaded':
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };
    case 'city/created':
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error('Invalid action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: 'loading' });

      try {
        const res = await fetch(`${BASE_URL}/cities`);

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }

        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        dispatch({ type: 'rejected', payload: err.message });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const data = await res.json();
      dispatch({ type: 'city/loaded', payload: data });
    } catch (err) {
      dispatch({ type: 'rejected', payload: err.message });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const data = await res.json();

      dispatch({ type: 'city/created', payload: data });
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      dispatch({ type: 'city/deleted', payload: id });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, error, getCity, createCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error('useCities must be used within a CitiesProvider Context');
  }
  return context;
}

export { CitiesProvider, useCities };
