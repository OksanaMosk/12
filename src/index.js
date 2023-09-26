import ApiService from './apiService';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const searchForm = document.querySelector('#search-form');

const imageApiService = new ApiService();
let per_page = 40;

searchForm.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onBtnLoadMore);

isHiddenBtnLoadMore();

async function onSearch(e) {
  try {
    e.preventDefault();
    cleanGallery();
    const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
    if (!searchQuery) {
      isHiddenBtnLoadMore();
      return;
    }

    imageApiService.query = searchQuery;
    imageApiService.page = 1;
    imageApiService.hits = 0;
    e.currentTarget.reset();
    const data = await imageApiService.fetchImage();

    if (data._id > 0) {
      isHiddenBtnLoadMore();
      return;
    }

    renderPhotoCard(data);

    if (data._id < 0) {
      isHiddenBtnLoadMore();
    } else visibleBtnLoadMore();
  } catch (error) {
    console.log('error', error);
  }
}

function cleanGallery() {
  galleryEl.innerHTML = '';
}

function visibleBtnLoadMore() {
  btnLoadMore.classList.remove('is-hidden');
  btnLoadMore.classList.add('visible');
}

function isHiddenBtnLoadMore() {
  btnLoadMore.classList.add('is-hidden');
  btnLoadMore.classList.remove('visible');
}

async function onBtnLoadMore() {
  try {
    const data = await imageApiService.fetchImage();

    renderPhotoCard(data);
    pageScrolling();
    imageApiService.hits += 40;

    const pageNum = Math.ceil(data.totalHits / per_page);
    if (imageApiService.page === pageNum + 1) {
      isHiddenBtnLoadMore();
      Notiflix.Notify.info('This is the end of search results.');
    }
  } catch (error) {
    console.log('error', error);
  }
}

function pageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function renderPhotoCard() {
  const markup = data => {
    data
      .map(element => {
        return `<div class="photo-card"> <a href="${element.drinkThumb}" class ="imageGalleryItem-image">
      <h2>${element.drink}</h2>
        <img src="${element.drinkThumb}" alt="${element._id}" class="image-src" loading="lazy"/></a>
        <div class="info image-info">
        <p class="info-item">
            <b>Likes</b> ${element.description}
        </p>
        </div>
    </div>`;
      })
      .join('');

    galleryEl.insertAdjacentHTML('beforeend', markup);

    new SimpleLightbox('.photo-card a', {
      captionDelay: 250,
    });
  };
}
