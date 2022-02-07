// SELECTORS
const auth = "563492ad6f91700001000001d7e8ce304ae34fc28fe8b9c054a5aa40";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let fetchLink;
let searchValue;
let page = 1;
const more = document.querySelector(".more");
let currentSearch;

// EVENT LISTENERS
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});
more.addEventListener("click", loadMore);

// UPDATE INPUT
function updateInput(e) {
  searchValue = e.target.value;
}

// FETCH API
async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

// GENERATE PHOTOS
function generatePictures(data) {
  data.photos.forEach(photo => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
      <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href="https://www.pexels.com/photo/${photo.id}/download">Download</a>
      </div>
      <img src="${photo.src.large}" width="${photo.width}" height="${photo.height}" srcset="${photo.src.large} 1x, ${photo.src.large2x}">
    `;
    gallery.appendChild(galleryImg);
  })
}

// CREATED PHOTOS
async function createdPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

createdPhotos()

// CLEAR
function clear() {
  gallery.innerHTML = "";
  searchInput.innerHTML = "";
}

// SEARCH PHOTOS
async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

// LOAD MORE
async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}
