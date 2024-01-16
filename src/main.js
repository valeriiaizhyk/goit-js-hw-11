import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

const modal = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', toSearchImages);

function toSearchImages(event) {
  event.preventDefault();
  gallery.innerHTML = '';

  const userSearch = form.search.value.trim();

  const url = new URL('https://pixabay.com/api/');
  url.searchParams.append('key', '41839077-17381d035cc7abc60580c609c');
  url.searchParams.append('q', userSearch);
  url.searchParams.append('image_type', 'photo');
  url.searchParams.append('orientation', 'horizontal');
  url.searchParams.append('safesearch', true);

  loader.classList.remove('hide');

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Your request is not ok!');
      }
      return response.json();
    })
    .then(images => {
      if (images.hits.length === 0) {
        iziToast.error({
          title: 'Nothing found!',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      }
      gallery.innerHTML = '';
      gallery.innerHTML = images.hits.reduce(
        (
          acc,
          {
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }
        ) =>
          acc +
          `<li class='gallery-item'>
              <a class='gallery-link' href='${largeImageURL}'>
                <img
                    class='gallery-image'
                    src='${webformatURL}'
                    alt='${tags}'
                    width='360'
                    height='200'
                    />
              </a>
              <ul class='gallery-statistic'>
                  <li><p class='statistic'> ❤️ Likes <span>${likes}</span></p></li>
                  <li><p class='statistic'> 👀 Views <span>${views}</span></p></li>
                  <li><p class='statistic'> 🗨️ Comments <span>${comments}</span></p></li>
                  <li><p class='statistic'> 📩 Downloads <span>${downloads}</span></p></li>
              </ul>
            </li>`,
        ''
      );

      modal.refresh();
    })
    .catch(error => console.log(error))
    .finally(() => {
      loader.classList.add('hide');
      form.reset();
    });
}
