// script.js
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots-container');

    let currentSlide = 0;
    let slideInterval = null;
    const INTERVAL_TIME = 5000; // 5 секунд
    let isPaused = false;

    // Создаём точки
    function createDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Переход к конкретному слайду
    function goToSlide(index) {
        if (index === currentSlide) return;
        // Убираем активный класс у всех слайдов
        slides.forEach(s => s.classList.remove('active'));
        // Добавляем активному
        slides[index].classList.add('active');

        // Обновляем точки
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    // Следующий слайд
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    // Предыдущий слайд
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }

    // Запуск автопрокрутки
    function startAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, INTERVAL_TIME);
    }

    // Остановка автопрокрутки
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // Обработчики событий
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
            resetAutoPlay();
        }
    });

    // Сброс автопрокрутки при ручном вмешательстве
    function resetAutoPlay() {
        if (!isPaused) {
            startAutoPlay();
        }
    }

    // Пауза при наведении на слайдер
    slider.addEventListener('mouseenter', () => {
        isPaused = true;
        stopAutoPlay();
    });

    slider.addEventListener('mouseleave', () => {
        isPaused = false;
        startAutoPlay();
    });

    // Поддержка сенсорных свайпов (touch)
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50; // минимальное расстояние для свайпа
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoPlay();
        }
    }

    // Инициализация
    createDots();
    goToSlide(0); // гарантируем, что первый слайд активен
    startAutoPlay();

    // Дополнительно: если точек нет, скрываем контейнер
    if (slides.length <= 1) {
        dotsContainer.style.display = 'none';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
});
