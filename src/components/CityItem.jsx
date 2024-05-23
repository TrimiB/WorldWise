import styles from './CityItem.module.css';

function CityItem({ city }) {
  return <div>{city.cityName}</div>;
}

export default CityItem;
