const body = document.querySelector('body');
const header = document.querySelector('.header');
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const anchors = document.querySelectorAll('a[href^="#"]');

// Smooth scroll
for (let anchor of anchors) {
  anchor.parentElement.addEventListener('click', function(e) {
      e.preventDefault();
      const blockID = anchor.getAttribute('href').slice(1);
      const element = document.getElementById(blockID);
      const y = element.getBoundingClientRect().top + window.scrollY;
      // - header.clientHeight добавить для fixed
      window.scrollTo({top: y, behavior: 'smooth'});
  })
}

// Mobile menu
burger.addEventListener('click', () => {
  menu.classList.toggle('mobile-menu');
  body.classList.toggle('stop-scroll');
});

const removeMobileMenu = () => {
  menu.classList.remove('mobile-menu');
  startScroll();
};

const stopScroll = () => {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollBarWidth) {
    body.style.marginRight = `${scrollBarWidth}px`;
  }
  body.classList.add('stop-scroll');
};

const startScroll = () => {
  body.style.marginRight = '';
  body.classList.remove('stop-scroll');
};

for (let anchor of anchors) {
  anchor.addEventListener('click', removeMobileMenu);
}

window.addEventListener('click', (e) => {
  if (menu.classList.contains('mobile-menu') && !e.composedPath().includes(burger)) {
    closeModal(e, menu, removeMobileMenu);
  }
});

function closeModal(event, path, callback) {
  const hasPath = event.composedPath().includes(path);
  if (!hasPath) callback();
}

// Carousel
const carousel = document.querySelector('.carousel');
const carouselBtnRight = document.querySelector('.carousel__button-right');
const carouselBtnLeft = document.querySelector('.carousel__button-left');
const pagginationWrappers = document.querySelectorAll('.pagination__item-wrapper');
let count = 0;

carouselBtnRight.addEventListener('click', () => carouselArrowHandler('right', 5));
carouselBtnLeft.addEventListener('click', () => carouselArrowHandler('left', 5));
window.addEventListener('resize', doOffset);

pagginationWrappers.forEach(wrapper => {
  wrapper.addEventListener('click', () => {
    setActivePagginationElement(wrapper);
    count = [...wrapper.parentElement.children].indexOf(wrapper);
    doOffset();
  })
});

function carouselArrowHandler(arrow, amountOfImg) {
  if (arrow === 'right') {
    count++;
    if (count >= amountOfImg) count = amountOfImg - 1;
  }
  if (arrow === 'left') {
    count--;
    if (count < 0) count = 0;
  }
  setActivePagginationElement(pagginationWrappers[count]);
  doOffset();
}

function setActivePagginationElement(parentElement) {
  const pagginationButtons = document.querySelectorAll('.pagination__item');
  pagginationButtons.forEach(btn => {
    btn.classList.remove('pagination__item_active');
    btn.removeAttribute('disabled');
  });
  const child = parentElement.firstElementChild;
  child.classList.add('pagination__item_active');
  // Inactive paggination elements
  child.setAttribute('disabled', '');
  carouselBtnRight.removeAttribute('disabled');
  carouselBtnLeft.removeAttribute('disabled');
  if (count === 0) carouselBtnLeft.setAttribute('disabled', '');
  if (count === 4) carouselBtnRight.setAttribute('disabled', '');
}

function doOffset() {
  if (document.documentElement.clientWidth > 1024 && count > 2) count = 2;
  setActivePagginationElement(pagginationWrappers[count]);
  const carouselItem = document.querySelector('.carousel__item');
  const carouselGap = parseInt(getComputedStyle(carousel).columnGap);
  const offset = carouselItem.clientWidth + carouselGap;
  carousel.style.transform = `translateX(-${offset * count}px)`;
}

// Auth state
let isAuthState = false;
const profileIconNoAuth = document.querySelector('.profile-btn__no-auth');
const profileIconAuth = document.querySelector('.profile-btn__auth');
const dropDownMenuCardNumber = document.querySelector('.drop-menu-profile__title');
const cardFormTitle = document.querySelector('.cards__form-title');
const userName = document.getElementById('check-user-name');
const cardNumber = document.getElementById('check-card-number');
const checkCardButton = document.querySelector('.button_cards-form');
const cardStatistics = document.querySelector('.statistics_card');
const signInTitle = document.querySelector('.sign-in__title');
const signInText = document.querySelector('.sign-in__text');
const signInButtonWrapper = document.querySelector('.sign-in__button-wrapper');
const myProfileNameShort = document.querySelector('.user-info__shortname');
const myProfileNameFull = document.querySelector('.user-info__fullname');
const myProfileCardNumber = document.querySelector('.profile-info__card-number');
const booksList = document.querySelector('.profile-info__rent-list');
const bookTitles = document.querySelectorAll('.book__title');

if (localStorage.hasOwnProperty('users')) {
  const getUsers = JSON.parse(localStorage.getItem('users'));
  const authUser = getUsers.find(user => user.isAuth);
  if (authUser) setAuthState(authUser);
} else {
  localStorage.setItem('users', JSON.stringify([]));
}

function setAuthState(user) {
  isAuthState = true;
  const userShortname = user.firstName[0] + user.lastName[0];
  const userFullname = `${user.firstName} ${user.lastName}`;
  // Profile icon
  profileIconNoAuth.style.display = 'none';
  profileIconAuth.style.display = 'block';
  profileIconAuth.textContent = userShortname;
  profileIconAuth.setAttribute('title', userFullname);
  // Dropdown menu
  dropDownMenuCardNumber.style.textTransform = 'uppercase';
  dropDownMenuCardNumber.style.fontSize = '12px';
  dropDownMenuCardNumber.textContent = user.cardNumber;
  // Favorite section - books
  initOwnButtons(user.books);
  // Library Card section
  cardFormTitle.textContent = 'Your Library card';
  userName.style.textTransform = 'capitalize';
  userName.value = userFullname;
  cardNumber.value = user.cardNumber;
  userName.setAttribute('disabled', '');
  cardNumber.setAttribute('disabled', '');
  showUserCardStatus();
  refreshUserCardStatus(user);
  signInTitle.textContent = 'Visit your profile';
  signInText.textContent = 'With a digital library card you get free access to the Library’s wide array of digital resources including e-books, databases, educational resources, and more.';
  signInButtonWrapper.classList.add('isAuth');
  // My profile
  myProfileNameShort.textContent = userShortname;
  myProfileNameFull.textContent = userFullname;
  myProfileCardNumber.textContent = user.cardNumber;
}

function setUnAuthState() {
  isAuthState = false;
  // Profile icon
  profileIconNoAuth.style.display = 'block';
  profileIconAuth.style.display = 'none';
  // Dropdown menu
  dropDownMenuCardNumber.style.textTransform = 'initial';
  dropDownMenuCardNumber.textContent = 'Profile';
  // Library Card section
  cardFormTitle.textContent = 'Find your Library card';
  userName.style.textTransform = 'initial';
  userName.value = '';
  cardNumber.value = '';
  userName.removeAttribute('disabled');
  cardNumber.removeAttribute('disabled');
  checkCardButton.style.display = 'inline-block';
  cardStatistics.style.display = 'none';
  signInTitle.textContent = 'Get a reader card';
  signInText.textContent = 'You will be able to see a reader card after logging into account or you can register a new account';
  signInButtonWrapper.classList.remove('isAuth');
}

function initOwnButtons(ownedBooks) {
  const myBooks = [];
  ownedBooks.forEach(book => myBooks.push(book.split(',')[0]));
  bookTitles.forEach(el => {
    if (myBooks.includes(el.textContent)) {
      const button = el.closest('.book').querySelector('button');;
      buyBook(button);
    }
  });
}

// Drop down profile menu
const profileButton = document.querySelector('.profile-btn');
const dropProfileMenu = document.querySelector('.drop-menu-profile');

function showDropDownMenu() {
  dropProfileMenu.classList.toggle('visible');
  const firstItem = document.querySelector('.drop-menu-profile__first-item');
  const secondItem = document.querySelector('.drop-menu-profile__second-item');
  if (isAuthState) {
    firstItem.textContent = 'My profile';
    secondItem.textContent = 'Log Out';
  } else {
    firstItem.textContent = 'Log In';
    secondItem.textContent = 'Register';
  }
}

profileIconNoAuth.addEventListener('click', showDropDownMenu);
profileIconAuth.addEventListener('click', showDropDownMenu);
window.addEventListener('click', (e) => {
  if (dropProfileMenu.classList.contains('visible') && !e.composedPath().includes(profileButton)) {
    closeModal(e, dropProfileMenu, () => dropProfileMenu.classList.remove('visible'));
  }
});

const modalRegister = document.querySelector('.register');
const modalLogIn = document.querySelector('.login');
const modalProfile = document.querySelector('.my-profile');
const dropMenuFirstItem = document.querySelector('.drop-menu-profile__first-item');
const dropMenuSecondItem = document.querySelector('.drop-menu-profile__second-item');

function refreshModal(modal) {
  const modalForm = document.querySelector(modal);
  const formInputs = modalForm.querySelectorAll('input');
  formInputs.forEach(input => {
    input.classList.remove('error');
    input.value = '';
  });
  const modalErrorText = document.querySelector('.invalid-modal-text');
  if (modalErrorText) modalForm.removeChild(modalErrorText);
}

// Modal LOG IN / MY PROFILE
dropMenuFirstItem.addEventListener('click', () => {
  if (isAuthState) {
    showRentedBooks();
    modalProfile.classList.add('visible');
    dropProfileMenu.classList.remove('visible');
    stopScroll();
  } else {
    modalLogIn.classList.add('visible');
    refreshModal('.login__form');
    dropProfileMenu.classList.remove('visible');
    stopScroll();
  }
});

// Modal REGISTER / LOG OUT
dropMenuSecondItem.addEventListener('click', () => {
  if (isAuthState) {
    const getUsers = JSON.parse(localStorage.getItem('users'));
    const authUser = getUsers.find(user => user.isAuth);
    for (let obj of getUsers) {
      if (obj.email === authUser.email) {
        obj.isAuth = false;
      }
    }
    const addUser = JSON.stringify(getUsers);
    localStorage.setItem('users', addUser);
    location.reload();
  } else {
    modalRegister.classList.add('visible');
    refreshModal('.register__form');
    dropProfileMenu.classList.remove('visible');
    stopScroll();
  }
});

// Check card button
checkCardButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (!localStorage.hasOwnProperty('users')) return;
  const getUsers = JSON.parse(localStorage.getItem('users'));
  for (let obj of getUsers) {
    if (obj.cardNumber === cardNumber.value.toLowerCase()) {
      const objName1 = `${obj.firstName.toLowerCase()} ${obj.lastName.toLowerCase()}`;
      const objName2 = `${obj.lastName.toLowerCase()} ${obj.firstName.toLowerCase()}`;
      const objName3 = obj.firstName.toLowerCase();
      const checkedName = userName.value.toLowerCase().trim();
      if (objName1 === checkedName || objName2 === checkedName || objName3 === checkedName) {
        userName.style.textTransform = 'capitalize';
        userName.value = `${obj.firstName} ${obj.lastName}`;
        cardNumber.value = obj.cardNumber;
        userName.setAttribute('disabled', '');
        cardNumber.setAttribute('disabled', '');
        showUserCardStatus();
        refreshUserCardStatus(obj);
        setTimeout(() => {
          if (!isAuthState) {
            userName.style.textTransform = 'none';
            checkCardButton.style.display = 'inline-block';
            cardStatistics.style.display = 'none';
            userName.value = '';
            cardNumber.value = '';
            userName.removeAttribute('disabled');
            cardNumber.removeAttribute('disabled');
          }
        }, 10000);
      }
    }
  }
});

function showUserCardStatus() {
  checkCardButton.style.display = 'none';
  cardStatistics.style.display = 'flex';
}

function refreshUserCardStatus(obj) {
  const visits = document.querySelectorAll('span[data-amount="visits"]');
  const bonuses = document.querySelectorAll('span[data-amount="bonuses"]');
  const books = document.querySelectorAll('span[data-amount="books"]');
  visits.forEach(el => el.textContent = obj.visits);
  bonuses.forEach(el => el.textContent = obj.bonuses);
  books.forEach(el => el.textContent = obj.books.length);
}

// Sign up button --- library card
const signUpButton = document.querySelector('.button-sign-up');
signUpButton.addEventListener('click', () => {
  modalRegister.classList.add('visible');
  refreshModal('.register__form');
  stopScroll();
});

// Sign up button --- modal login
const signUpModalButton = document.querySelector('.login__form .modal-subref');
signUpModalButton.addEventListener('click', () => {
  signUpModalButton.closest('.overlay').classList.remove('visible');
  modalRegister.classList.add('visible');
  refreshModal('.register__form');
  stopScroll();
});

// Profile button --- library card
const myProfileButton = document.querySelector('.button-profile');
myProfileButton.addEventListener('click', () => {
  showRentedBooks();
  modalProfile.classList.add('visible');
  stopScroll();
});

// Log in button --- library card
const logInButton = document.querySelector('.button-log-in');
logInButton.addEventListener('click', () => {
  modalLogIn.classList.add('visible');
  refreshModal('.login__form');
  stopScroll();
});

// Log in button --- modal register
const logInModalButton = document.querySelector('.register__form .modal-subref');
logInModalButton.addEventListener('click', () => {
  logInModalButton.closest('.overlay').classList.remove('visible');
  modalLogIn.classList.add('visible');
  refreshModal('.login__form');
  stopScroll();
});

// Modal close
const overlays = document.querySelectorAll('.overlay');
overlays.forEach(overlay => {
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('visible');
      startScroll();
    }
  });
});
const modalCloseButtons = document.querySelectorAll('.modal-close-button');
modalCloseButtons.forEach(closeBtn => {
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeBtn.closest('.overlay').classList.remove('visible');
    startScroll();
  });
});

// Section Favorites - Tabs
let season = '';
const books = document.querySelectorAll('.book');
const favoritesLabels = document.querySelectorAll('.favorites__form label');
favoritesLabels.forEach(label => {
  label.addEventListener('click', () => {
    const labelSeason = label.previousElementSibling.getAttribute('value');
    if (season === labelSeason) return;
    season = labelSeason;
    books.forEach(book => {
      if (getComputedStyle(book).opacity !== '0') book.style.opacity = '0';
      book.addEventListener('transitionend', fadeOut);
    });
  });
});

function fadeOut() {
  books.forEach(book => {
    book.removeEventListener('transitionend', fadeOut);
    book.style.display = book.dataset.season === season ? 'block' : 'none';
    setTimeout(() => book.style.opacity = '1');
  });
}

// Section Favorites - Filter background
const favoriteFilter = document.querySelector('.favorites__filter');
function addBackgroundFavoritesFilter() {
  if (document.documentElement.clientWidth <= 1260) {
    favoriteFilter.getBoundingClientRect().top <= 0
    ? favoriteFilter.style.backgroundColor = 'rgba(187, 148, 95, 0.7)'
    : favoriteFilter.style.backgroundColor = 'var(--color-light)';
  } else {
    favoriteFilter.style.backgroundColor = 'var(--color-light)';
  }
};

// Section Favorites - Buy book
const buyButton = document.querySelectorAll('.button_buy');
const modalBuyCard = document.querySelector('.abonement');
buyButton.forEach(button => {
  button.addEventListener('click', () => {
    if (isAuthState) {
      const getUsers = JSON.parse(localStorage.getItem('users'));
      const authUser = getUsers.find(user => user.isAuth);
      if (authUser.hasAbonement) {
        const title = button.closest('.book').querySelector('.book__title');
        const author = button.closest('.book').querySelector('.book__author');
        const listEl = `${title.textContent}, ${author.textContent.slice(3)}`;
        authUser.books.push(listEl);
        const addUser = JSON.stringify(getUsers);
        localStorage.setItem('users', addUser);
        refreshUserCardStatus(authUser);
        buyBook(button);
      } else {
        modalBuyCard.classList.add('visible');
        refreshModal('.buy-card__form');
        stopScroll();
      }
    } else {
      modalLogIn.classList.add('visible');
      refreshModal('.login__form');
      stopScroll();
    }
  });
});

function buyBook(button) {
  button.textContent = 'Own';
  button.classList.remove('button_buy');
  button.classList.add('button_own');
  button.setAttribute('disabled', '');
}

window.addEventListener('scroll', addBackgroundFavoritesFilter);

// Save user to localStorage
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('register-email');
const password = document.getElementById('register-password');
const toSignUpButton = document.querySelector('.register__form button');
const modalRegisterInputs = document.querySelectorAll('.register__form .modal-input');

toSignUpButton.addEventListener('click', (e) => {
  if (firstName.checkValidity() && lastName.checkValidity() && email.checkValidity() && password.checkValidity()) {
    e.preventDefault();
    if (isUserRegistered(email.value)) {
      email.insertAdjacentHTML('afterend', '<p class="invalid-modal-text">User with this e-mail is already signed up</p>');
    } else {
      modalRegisterInputs.forEach(input => input.classList.remove('error'));
      const currentUser = addUser();
      setAuthState(currentUser);
      toSignUpButton.closest('.overlay').classList.remove('visible');
      startScroll();
      firstName.value = '';
      lastName.value = '';
      email.value = '';
      password.value = '';
    }
  } else {
    modalRegisterInputs.forEach(input => input.classList.add('error'));
  }

  function isUserRegistered(email) {
    const getUsers = JSON.parse(localStorage.getItem('users'));
    for (let obj of getUsers) {
      if (obj.email === email) return true;
    }
  }

  function addUser() {
    const user = {
      isAuth: true,
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value,
      password: password.value,
      cardNumber: generateCardNumber(0, 68719476735),
      hasAbonement: false,
      visits: 1,
      bonuses: 1240,
      books: [],
    };
    const getUsers = JSON.parse(localStorage.getItem('users'));
    getUsers.push(user);
    const addUser = JSON.stringify(getUsers);
    localStorage.setItem('users', addUser);
    return user;
  }

  function generateCardNumber(min, max) {
    let rand = Math.floor(min + Math.random() * (max + 1 - min)).toString(16);
    while (rand.length < 9) {
      rand = '0' + rand; 
    }
    return rand;
  }
});

// LOG IN 
const loginInput = document.getElementById('login-input');
const loginPassword = document.getElementById('login-password');
const toLogInButton = document.querySelector('.login__form button');
const modalLogInInputs = document.querySelectorAll('.login__form .modal-input');
toLogInButton.addEventListener('click', (e) => {
  loginInput.value = loginInput.value.trim();
  if (loginInput.value && loginPassword.checkValidity()) {
    e.preventDefault();
    modalLogInInputs.forEach(input => input.classList.remove('error'));
    const currentUser = checkUser();
    if (currentUser) {
      setAuthState(currentUser);
      toLogInButton.closest('.overlay').classList.remove('visible');
      startScroll();
      loginInput.value = '';
      loginPassword.value = '';
    } else {
      const loginForm = document.querySelector('.login__form');
      const invalidText = document.querySelector('.invalid-modal-text');
      if (!loginForm.contains(invalidText)) {
        const invalidTextHTML = '<span class="invalid-modal-text">Incorrect email, card number or password.</span>';
        loginPassword.insertAdjacentHTML('afterend', invalidTextHTML);
      }
      loginInput.value = '';
      loginPassword.value = '';
    }
  } else {
    modalLogInInputs.forEach(input => input.classList.add('error'));
  }

  function checkUser() {
    const getUsers = JSON.parse(localStorage.getItem('users'));
    for (let obj of getUsers) {
      const condition = (obj.email === loginInput.value.trim() || obj.cardNumber === loginInput.value.toLowerCase().trim()) && obj.password === loginPassword.value;
      if (condition) {
        obj.isAuth = true;
        obj.visits += 1;
        const addUser = JSON.stringify(getUsers);
        localStorage.setItem('users', addUser);
        return obj;
      }
    }
    return false;
  }
});

// Rented books
function showRentedBooks() {
  booksList.innerHTML = '';
  const getUsers = JSON.parse(localStorage.getItem('users'));
  const authUser = getUsers.find(user => user.isAuth);
  authUser.books.forEach(book => {
    const li = document.createElement('li');
    li.className = 'rent-list__item';
    li.textContent = book;
    booksList.append(li);
  });
} 

// Copy card number at my profile
const myProfileCopyButton = document.querySelector('.copy-card-number');
myProfileCopyButton.onclick = function() {
  const cardNumber = this.previousElementSibling.textContent.toUpperCase();
  navigator.clipboard.writeText(cardNumber);
};

// BUY LIBRARY CARD
const buyCardForm = document.querySelector('.buy-card__form');
const bankCardNumber = document.getElementById('bank-card-number');
const bankCardExpirationMonth = document.getElementById('expiration-month');
const bankCardExpirationYear = document.getElementById('expiration-year');
const bankCardCVC = document.getElementById('cvc');
const bankCardCardholder = document.getElementById('cardholder');
const bankCardPostalCode = document.getElementById('postal-code');
const bankCardCity = document.getElementById('city');
const abonementBuyButton = document.querySelector('.button_buy-card');

bankCardNumber.addEventListener('input', cardNumberHandler);
bankCardExpirationMonth.addEventListener('input', inputOnlyDigits);
bankCardExpirationYear.addEventListener('input', inputOnlyDigits);
bankCardCVC.addEventListener('input', inputOnlyDigits);

function inputOnlyDigits() {
  this.value = this.value.replace(/\D/g, "");
}

function cardNumberHandler() {
  let result = '';
  const value = this.value.replace(/\D/g, "");
  for (let i = 0; i < value.length; i += 4) {
    const quarter = value.slice(i, i + 4);
    result += quarter.length < 4 ? quarter : quarter + ' ';
  }
  this.value = result.trim();
}

buyCardForm.addEventListener('input', () => {
  if (
    bankCardNumber.value.trim()
    && bankCardExpirationMonth.value.trim()
    && bankCardExpirationYear.value.trim()
    && bankCardCVC.value.trim()
    && bankCardCardholder.value.trim()
    && bankCardPostalCode.value.trim()
    && bankCardCity.value.trim()
  ) {
    abonementBuyButton.removeAttribute('disabled');
  } else {
    abonementBuyButton.setAttribute('disabled', '');
  }
});

const modalBuyCardInputs = document.querySelectorAll('.buy-card__form .modal-input');
abonementBuyButton.addEventListener('click', (e) => {
  if (
    bankCardNumber.checkValidity()
    && bankCardExpirationMonth.checkValidity()
    && bankCardExpirationYear.checkValidity()
    && bankCardCVC.checkValidity()
    && bankCardCardholder.checkValidity()
    && bankCardPostalCode.checkValidity()
    && bankCardCity.checkValidity()
    ) {
    e.preventDefault();
    modalBuyCardInputs.forEach(input => input.classList.remove('error'));
    const getUsers = JSON.parse(localStorage.getItem('users'));
    for (let obj of getUsers) {
      if (obj.isAuth) {
        obj.hasAbonement = true;
        const addUser = JSON.stringify(getUsers);
        localStorage.setItem('users', addUser);
        break;
      }
    }
    bankCardNumber.value = '';
    bankCardExpirationMonth.value = '';
    bankCardExpirationYear.value = '';
    bankCardCVC.value = '';
    bankCardCardholder.value = '';
    bankCardPostalCode.value = '';
    bankCardCity.value = '';
    abonementBuyButton.setAttribute('disabled', '');
    abonementBuyButton.closest('.overlay').classList.remove('visible');
    startScroll();
  } else {
    modalBuyCardInputs.forEach(input => input.classList.add('error'));
  }
});