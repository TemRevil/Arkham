// Targeting the nav element
const nav = document.querySelector('nav');

// Adding a transition effect to the nav element
nav.style.transition = 'backdrop-filter 1s ease';

// Defining a function to apply the change when scrolling down
window.addEventListener('scroll', function() {
    // Checking if the page has scrolled down by 50 pixels
    if (window.scrollY > 50) {
        // Adding backdrop-filter property with a value of blur(50px) to the nav
        nav.style.backdropFilter = 'blur(25px)';
        nav.style.backgroundColor = '#123fff50';
    } else {
        // Removing the backdrop-filter property when the page scrolls back up
        nav.style.backdropFilter = 'none';
        nav.style.backgroundColor = 'transparent';
    }
});
// ---------------------------------------------------------
// Header Slider Event
document.addEventListener("DOMContentLoaded", function() {
    var leftButton = document.getElementById('left');
    var rightButton = document.getElementById('right');
    var slider = document.querySelector('.slider-cards');
    var sliderView = document.getElementById('slider-img');
    var sliderDataElement = document.querySelector('.slider-data');
    var sliderAlign = sliderDataElement.querySelector('.align');
    var sliderTitle = sliderDataElement.querySelector('.title');
    var sliderTextContainer = sliderDataElement.querySelector('.slider-text');

    // Function to set active class to the clicked image
    function setActiveSlide(index) {
        var slides = slider.querySelectorAll('.card');
        slides.forEach(function(slide) {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
        updateSliderView(slides[index]);
        scrollToActiveSlide();
    }

    // Function to switch to the next slide
    function nextSlide() {
        var slides = slider.querySelectorAll('.card');
        var currentIndex = Array.from(slides).findIndex(function(slide) {
            return slide.classList.contains('active');
        });
        setActiveSlide((currentIndex + 1) % slides.length);
    }

    // Function to switch to the previous slide
    function prevSlide() {
        var slides = slider.querySelectorAll('.card');
        var currentIndex = Array.from(slides).findIndex(function(slide) {
            return slide.classList.contains('active');
        });
        setActiveSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    // Function to ensure that the active image is fully visible inside the slider
    function scrollToActiveSlide() {
        var activeSlide = slider.querySelector('.card.active');
        if (activeSlide) {
            var sliderRect = slider.getBoundingClientRect();
            var slideRect = activeSlide.getBoundingClientRect();
            if (slideRect.left < sliderRect.left || slideRect.right > sliderRect.right) {
                var scrollAmount = activeSlide.offsetLeft - slider.offsetLeft;
                slider.scroll({
                    left: slider.scrollLeft + scrollAmount,
                    behavior: 'smooth' // Enable smooth scrolling
                });
            }
        }
    }

    // Function to update the slider data text
    function updateSliderData(activeId) {
        var data = sliderData[activeId];
        if (data) {
            sliderAlign.textContent = data.align;
            sliderTitle.innerHTML = data.title;
            sliderTitle.style.backgroundColor = data.titleBgColor;
            sliderTextContainer.innerHTML = '';
            data.texts.forEach(function(text) {
                var p = document.createElement('p');
                p.classList.add('text');
                p.innerHTML = text;
                sliderTextContainer.appendChild(p);
            });
        }
    }

    // Function to update the slider-view with the active image
    function updateSliderView(activeCard) {
        var activeImage = activeCard.querySelector('img');
        var activeId = activeCard.id;
        if (activeImage) {
            sliderView.src = activeImage.src;
            sliderView.alt = activeImage.alt;
            // Restart animation
            sliderView.style.animation = 'none';
            sliderView.offsetHeight; // Trigger reflow
            sliderView.style.animation = null;
        }
        updateSliderData(activeId);
    }

    // Registering click events for left and right buttons
    leftButton.addEventListener('click', function() {
        prevSlide();
    });

    rightButton.addEventListener('click', function() {
        nextSlide();
    });

    // Adding click event to each card to set it as active when clicked
    var slides = slider.querySelectorAll('.card');
    slides.forEach(function(slide, index) {
        slide.addEventListener('click', function() {
            setActiveSlide(index);
        });
    });

    // Initial update of the slider-view
    updateSliderView(slider.querySelector('.card.active'));
});
// ---------------------------------------------------------
// Studios Slider
var copy = document.querySelector(".studios-logo-slide").cloneNode(true);
document.querySelector(".studios-slider").appendChild(copy);
// ---------------------------------------------------------
// Videos Slider Event
document.addEventListener("DOMContentLoaded", function() {
    var gameLogos = document.querySelectorAll(".game-logo");
    var videos = document.querySelectorAll(".vid video");
    var videoContainer = document.querySelector(".vid-slider");
    var sliderActive = document.querySelector(".vid-slider-active");
    var sliderPoints = document.querySelectorAll(".v-point");
    var leftButton = document.getElementById("vid-slider-left");
    var rightButton = document.getElementById("vid-slider-right");
    var scrollTimeoutId;
    var timeoutId;
    var currentIndex = 0;

    function showVideo(index) {
        if (videoContainer) {
            videoContainer.style.transform = `translateX(${-index * 100}%)`;
        }
        if (sliderActive) {
            sliderPoints.forEach(function(point, i) {
                if (i === index) {
                    point.classList.add("v-active");
                } else {
                    point.classList.remove("v-active");
                }
            });
        }
        // Mute all videos except the current one
        videos.forEach((video, i) => {
            if (i !== index) {
                video.pause();
                video.muted = true;
            }
        });
        
        // Ensure the game logo for the current video is displayed
        gameLogos.forEach(function(gameLogo, i) {
            if (i === index) {
                gameLogo.style.display = 'flex';
                gameLogo.classList.remove("fade-out");
            } else {
                gameLogo.style.display = 'none';
            }
        });
    }

    function handleIntersection(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.play(); // Start playing the video when it becomes visible
            } else {
                entry.target.pause(); // Pause the video when it is not visible
            }
        });
    }

    var observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

    videos.forEach(function(video) {
        observer.observe(video); // Observe each video element
    });

    gameLogos.forEach(function(gameLogo) {
        gameLogo.addEventListener("click", function() {
            gameLogo.classList.add("fade-out");
            setTimeout(function() {
                gameLogo.style.display = 'none';
                if (videos[currentIndex]) {
                    videos[currentIndex].muted = false; // Unmute the video
                }
            }, 1000); // Match the duration of the fadeOut animation
        });
    });

    videos.forEach(function(video) {
        video.addEventListener("mouseleave", function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                var gameLogo = gameLogos[currentIndex];
                if (gameLogo) {
                    gameLogo.style.display = 'flex';
                    gameLogo.classList.remove("fade-out");
                    gameLogo.classList.add("fade-in");
                    videos[currentIndex].muted = true; // Mute the video again
                }
            }, 60000);
        });

        video.addEventListener("mouseenter", function() {
            clearTimeout(timeoutId);
        });
    });

    gameLogos.forEach(function(gameLogo) {
        gameLogo.addEventListener("animationend", function() {
            if (gameLogo.classList.contains("fade-in")) {
                gameLogo.classList.remove("fade-in");
            }
        });
    });

    leftButton.addEventListener("click", function() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : videos.length - 1;
        showVideo(currentIndex);
    });

    rightButton.addEventListener("click", function() {
        currentIndex = (currentIndex < videos.length - 1) ? currentIndex + 1 : 0;
        showVideo(currentIndex);
    });

    // Add click event listener to slider points
    sliderPoints.forEach(function(point, index) {
        point.addEventListener("click", function() {
            currentIndex = index;
            showVideo(currentIndex);
        });
    });

    showVideo(currentIndex);

    // Add event listener for scroll to show the game logo if hidden after 0.5 seconds
    window.addEventListener("scroll", function() {
        clearTimeout(scrollTimeoutId);
        scrollTimeoutId = setTimeout(function() {
            var gameLogo = gameLogos[currentIndex];
            if (gameLogo && gameLogo.style.display === 'none') {
                gameLogo.style.display = 'flex';
                gameLogo.classList.remove("fade-out");
                gameLogo.classList.add("fade-in");
                videos[currentIndex].muted = true; // Mute the video again
            }
        }, 500); // 0.5 seconds delay
    });
});
// ---------------------------------------------------------
// News Slider Event
document.addEventListener("DOMContentLoaded", function() {
    var newsTitle = document.querySelector(".news-word .title-2");
    var newsText = document.querySelector(".news-word .text-2");
    var newsImg = document.querySelector(".news-img img");
    var timer = document.querySelector(".news-timer .timer");

    var newsButtons = document.querySelectorAll(".news-btn-box button");
    var newsPoints = document.querySelectorAll(".news-slider-active .n-point");

    var currentNewsIndex = 0;
    var newsDisplayDuration = 4000;
    var automaticMovementDelay = 1;

    var newsInterval; // Variable to store the interval for automatic movement

    function updateNews(index) {
        var news = newsData[index];

        // Apply fade-out effect to the image
        newsImg.classList.remove("fade-in");
        newsImg.classList.add("fade-out");

        setTimeout(() => {
            // Update text content without animation
            newsTitle.textContent = news.title;
            newsText.innerHTML = news.text;

            // Update image source
            newsImg.src = news.imgSrc;

            // Apply fade-in effect to the image
            newsImg.classList.remove("fade-out");
            newsImg.classList.add("fade-in");
        }, 150);

        // Update active n-point
        newsPoints.forEach((point, i) => {
            point.classList.toggle("n-active", i === index);
        });
    }

    function startTimer() {
        // Reset and animate the timer
        timer.style.transition = 'none';
        timer.style.width = '100%';
        setTimeout(() => {
            timer.style.transition = `width ${newsDisplayDuration}ms linear`;
            timer.style.width = '0%';
        }, 50); // Delay to ensure transition is applied
    }

    function resetTimer() {
        // Quickly reset the timer back to 100% before starting the next cycle
        setTimeout(() => {
            timer.style.transition = 'width 0.2s linear';
            timer.style.width = '100%';
        }, newsDisplayDuration);
    }

    // Initialize news display and timer
    updateNews(currentNewsIndex);
    startTimer();
    startAutomaticMovement();

    // Function to start the automatic movement interval
    function startAutomaticMovement() {
        clearInterval(newsInterval); // Clear any existing interval
        newsInterval = setInterval(() => {
            currentNewsIndex = (currentNewsIndex + 1) % newsData.length;
            updateNews(currentNewsIndex);
            resetTimer();
            startTimer();
        }, newsDisplayDuration + 200); // Add 200ms to account for the reset transition
    }

    // Button click handlers
    newsButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            clearInterval(newsInterval);
            if (this.id === "news-slider-left") {
                currentNewsIndex = (currentNewsIndex === 0) ? newsData.length - 1 : currentNewsIndex - 1;
            } else if (this.id === "news-slider-right") {
                currentNewsIndex = (currentNewsIndex + 1) % newsData.length;
            }
            updateNews(currentNewsIndex);
            resetTimer();
            startTimer();
            // Restart automatic movement after a delay
            setTimeout(startAutomaticMovement, automaticMovementDelay);
        });
    });

    // n-point click handlers
    newsPoints.forEach(function(point, index) {
        point.addEventListener("click", function() {
            clearInterval(newsInterval);
            currentNewsIndex = index;
            updateNews(currentNewsIndex);
            resetTimer();
            startTimer();
            // Restart automatic movement after a delay
            setTimeout(startAutomaticMovement, automaticMovementDelay);
        });
    });
});
