// Плавная прокрутка
const anchors = document.querySelectorAll('a[href^="#"]');
const nav = document.querySelector('.nav');

for (let anchor of anchors) {
    anchor.parentElement.addEventListener('click', function(e) {
        e.preventDefault();
        let y = 0;
        nav.classList.remove('active'); 
        const blockID = anchor.getAttribute('href').slice(1);
        const element = document.getElementById(blockID);
        const elPadding = parseInt(window.getComputedStyle(element).paddingTop);
        const elMargin = parseInt(window.getComputedStyle(element).marginTop);
        if (window.innerWidth <= 800) {
            const navTop = parseInt(window.getComputedStyle(nav).top);
            y = element.getBoundingClientRect().top + window.scrollY - navTop + elPadding + elMargin;
        } else {
            y = element.getBoundingClientRect().top + window.scrollY - nav.clientHeight + elPadding + elMargin;
        }
        window.scrollTo({top: y, behavior: 'smooth'});
    })
}

// Кнопка мобильной навигации
const mobileNavBtn = document.querySelector('.mobileNav');

mobileNavBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
})
