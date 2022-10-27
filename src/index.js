import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

document.body.style.backgroundColor = '#F2DADF';
inputCountry.style.backgroundColor = "#DDC0B4";

const clearSearch = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};

const searchCountry = event => {
  const findCountry = event.target.value.trim();
  if (!findCountry) {
    clearSearch();
    return;
  }

  fetchCountries(findCountry)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearSearch();
        return;
      } else if (countries.length === 1) {
        clearSearch(countryList.innerHTML);
        generateCountryInfo(countries);
      } else if (countries.length > 1 && countries.length <= 10) {
        clearSearch(countryInfo.innerHTML);
        generateCountryList(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearSearch();
      return error;
    });
};

//szczegoly kraju
const generateCountryInfo = country => {
  const elementShow = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<section>
        
      <h1>
      <img src="${flags.svg}" alt="${name.official}"width="200" height="120"> ${
        name.official
      }
      </h1>
      <p><b>Capital:</b> ${capital},</p>
      <p><b>Population:</b> ${population},</p>
      <p><b>Languages:</b> ${Object.values(languages)}.</p><section>`;
    })
    .join('');

  countryInfo.innerHTML = elementShow;
};

//wyswietlanie listy krajow
const generateCountryList = countries => {
  const elementShow = countries
    .map(({ name, flags }) => {
      return `
      <li>
      <img src="${flags.svg}" alt="${name.official}" width="200" height="120">
      <p><b>${name.official}</b></p>
      </li>`;
    })
    .join('');

  countryList.innerHTML = elementShow;
};
inputCountry.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
document.addEventListener("DOMContentLoaded", function() {
  Notiflix.Notify.success("Content Loaded");
});