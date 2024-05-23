import styles from './CountryList.module.css';
import CountryItem from './CountryItem';
import Spinner from './Spinner';
import Message from './Message';

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message
        message={
          'You have not saved any Countries yet. Klick on a city of a Countrie on the map to add a Country to your list.'
        }
      />
    );

  /**
   * Reduces the `cities` array to an array of unique countries, including the country name and emoji.
   *
   * @param {Array<{ country: string, emoji: string }>} cities - The array of city objects to reduce.
   * @returns {Array<{ country: string, emoji: string }>} - An array of unique country objects.
   */
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
