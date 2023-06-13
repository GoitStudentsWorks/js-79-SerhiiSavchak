import axios from 'axios';
import Vimeo from '@vimeo/player';
import { selectMovie } from './modal';
import img from '../../images/home-page/hero-home@1x-desc.jpg';
import { async } from '@vimeo/player';

import { BASE_URL } from '../api/apiKey';
const END_POINT = 'trending/movie/day?language=en-US';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDBhNDQ5OWUzZjBiMDM2MDI1ZDEyNTk1Mzk3MjI3YSIsInN1YiI6IjY0N2YxZDM3Y2FlZjJkMDEzNjJjZDBjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.04GEOyHwNXnOZB4gUWNaiyPlLlOZ0z9Ttfl7T5UFMuk',
  },
};

let intervalId = null;
const heroSectionRef = document.querySelector('.hero-section');
const heroCont = document.querySelector('.hero-container');
const btnCloseRef = document.querySelector('.hero-modal-close');
const backdropModalRef = document.querySelector('.hero-backdrop');
const modalWrapRef = document.querySelector('.modal-wrap');

window.addEventListener('load', onPageLoad);

btnCloseRef.addEventListener('click', onBtnCloseClick);

// LISTENERS

function onPageLoad() {
  fetchTranding(BASE_URL, END_POINT, options).then(res => {
    const markup = createMarkup(res);
    addMarkup(heroCont, markup);
    const heroBtnTrailer = document.querySelector('.js-open-video');
    iFrameRef = document.querySelector('.iframe-hero');
    heroBtnTrailer.addEventListener('click', onBtnOpenClick);
  });
}

function onBtnCloseClick(evt) {
  backdropModalRef.classList.add('visuality-hidden');
}

function onBtnOpenClick(evt) {
  backdropModalRef.classList.remove('visuality-hidden');
  console.log(evt.target.dataset.id);

  fetchVideo(evt.target.dataset.id, options).then(res => {
    const markup = createVideoMarkup(res);
    console.log(markup);

    addMarkup(modalWrapRef, markup);
  });
}

// FETCH

async function fetchTranding(BASE_URL, END_POINT, options) {
  try {
    const response = await fetch(`${BASE_URL}${END_POINT}`, options);
    const data = await response.json();

    return data.results[Math.floor(Math.random() * (20 - 1 + 1)) + 1];
  } catch (error) {
    console.log(error.message);
    stopInterval(intervalId);
  }
}

async function fetchVideo(id, options) {
  try {
    const response = await fetch(
      `
  ${BASE_URL}movie/${id}/videos`,
      options
    );
    const data = await response.json();

    return data.results[0].key;
  } catch (error) {
    console.log(error);
  }
}

// MARKUP
function createMarkup(data) {
  heroSectionRef.style.backgroundImage = `linear-gradient(
    86.77deg, #111111 30.38%, rgba(17, 17, 17, 0) 65.61%), url("https://image.tmdb.org/t/p/original/${data.backdrop_path}")`;

  return `  <h1 class="hero-title-resp">${data.title}</h1>
  <p class="hero-text-resp">
  ${data.overview.split('').slice(0, 150).join('') + '...'}
</p>
  <p class="hero-text-big-resp">
    ${data.overview.split('').slice(0, 225).join('') + '...'}
  </p>
  <button type="button" class="hero-btn-resp js-open-video" data-id="${
    data.id
  }" >Watch trailer</button> <button type="button"  class="hero-btn-black link" data-id="${
    data.id
  }">More details</button>`;
}

function createVideoMarkup(key) {
  const videoUrl = `https://www.youtube.com/embed/${key}`;
  return `<iframe  class="iframe-hero" width="250" height="150"  src="${videoUrl}"></iframe>`;
}

function addMarkup(element, markup) {
  element.innerHTML = markup;
}
