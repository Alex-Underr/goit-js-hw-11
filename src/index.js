import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import card from './partials/templates/card.hbs';
import { fetchImages } from './fetch';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('.container__form');

let page = 1;
let lightbox = null;
let searchQuery = null;

const searchFormSubmit = async event => {
  event.preventDefault();

  page = 1;
  searchQuery = event.currentTarget.elements.searchQuery.value;
  try {
    const { data } = await fetchImages(searchQuery, page);
    if (!data.totalHits) {
      galleryList.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images!`);
    galleryList.innerHTML = card(data.hits);
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 300,
    });
    if (data.hits.length === 40) {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
};

const onButtonClick = async () => {
  page += 1;
  try {
    const { data } = await fetchImages(searchQuery, page);
    if (data.hits.length < 40) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    galleryList.insertAdjacentHTML('beforeend', card(data.hits));
    lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.5,
    behavior: 'smooth',
  });
};
searchBtn.addEventListener('submit', searchFormSubmit);
loadMoreBtn.addEventListener('click', onButtonClick);
