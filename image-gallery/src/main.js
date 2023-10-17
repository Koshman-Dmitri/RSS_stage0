const main = document.querySelector('.main');
const input = document.querySelector('.filter__input');
const deleteBtn = document.querySelector('.filter__icon-delete');
const searchBtn = document.querySelector('.filter__icon-search');
const nextBtn = document.querySelector('.filter__next');
const pageWrapper = document.querySelector('.page-wrapper');
const pageCount = document.getElementById('page-count');
const totalCount = document.getElementById('total-count');

let isFirstLoad = true;
let prevSearch = '';
let pageNum = 1;
let totalPage;

function getData(query) {
  if (prevSearch !== input.value) pageNum = 1;
  if (!input.value && !isFirstLoad) {
    input.value = query = 'Random';
  }
  prevSearch = input.value;

  const url = isFirstLoad
    ? `https://api.unsplash.com/photos/random?count=12&orientation=landscape`
    : `https://api.unsplash.com/search/photos?query=${query}&page=${pageNum}&per_page=12&orientation=landscape`;
  
    fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Client-ID 3WTZOK5FVIYp5uM5nrZLRhJ1Tv0A0T4PAfDxwGQKyzQ',
    },
  })
    .then(res => res.json())
    .then(data => showData(data))
    .catch(() => alert('Error: Rate limit exceeded, try again later\nОшибка: число запросов превышено, попробуйте позже'))
    .finally(() => isFirstLoad = false);
}

function showData(data) {
  if (!isFirstLoad) {
    totalPage = data.total_pages;
    pageCount.textContent = `Total: ${data.total_pages}`;
    if (data.total_pages === 0) pageNum = '0';
    totalCount.textContent = `Page: ${pageNum}`;
    pageWrapper.classList.add('visible');
  }
  const photos = isFirstLoad ? data : data.results;
  main.innerHTML = '';
  for (let el of photos) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    div.className = 'photo';
    img.src = el.urls.regular;
    img.alt = el.alt_description;
    div.append(img);
    main.append(div);
  }
}

function startSearch() {
  getData(input.value);
}

input.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) startSearch();
});
searchBtn.addEventListener('click', startSearch);
deleteBtn.addEventListener('click', () => {
  input.value = '';
  input.focus();
});
nextBtn.addEventListener('click', () => {
  if (pageNum === totalPage) return;
  pageNum++;
  getData(prevSearch);
});

getData();