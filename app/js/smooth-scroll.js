/**
* Smooth Scroll West
* @version 1.0.0
* @author Willian West [ @willianwest ]
* @GitHub https://github.com/willian-west/Smooth-Scroll-West
* @license The MIT License (MIT)
*/

var __Scroll = new Object();

/**
* Default options.
* @public
*/

__Scroll.scrollSpeed            = 1.2;    // Scroll Speed
__Scroll.wayPointPercShow       = 0.3;    // Adjust percentage to show elements on scroll
__Scroll.activeScrollPage       = true;   // Enable page scrolling
__Scroll.debug                  = false;  // Mode Debug
__Scroll.activeToggleMenuFixed  = true;   // Add or remove the class 'is-hide' on header tag


/**
* Do not change
*/

__Scroll.contentHeight;
__Scroll.containerHeight;
__Scroll.scrollPosition   = 0;
__Scroll.scrollContainer  = document.querySelector('.smooth-scroll-container');
__Scroll.scrollContent    = document.querySelector('.smooth-scroll-content');
__Scroll.menuOpen         = false;


// Document loaded
document.addEventListener('DOMContentLoaded', () => {

    // Detects if the device is mobile
    if (window.matchMedia("(pointer: coarse)").matches) return false; 

    // Check all required classes
    if( __Scroll.scrollContainer == null && __Scroll.scrollContent == null){
        console.log('Unable to launch Smooth Scroll without ".smooth-scroll-container" and ".smooth-scroll-content" elements.');
        return false;
    }

    let checkScroll;
    let scrollBar;
    let animationId;
    let timeDelayInitial        = 500;
    let isDragging              = false;
    let startY                  = 0;
    let startScrollBarPosition  = 0;
    let deltaOffSet             = 0;
    const waypoints             = document.querySelectorAll('.waypoint');
    const header                = document.querySelector('header');
    const parallaxItems         = document.querySelectorAll('.js-parallax');
    const parallaxLeftItems     = document.querySelectorAll('.js-paraleft');
    const smoothScrollLink      = document.querySelectorAll('.smooth-scroll-link');

    __Scroll.contentHeight      = __Scroll.scrollContent.scrollHeight;
    __Scroll.containerHeight    = __Scroll.scrollContainer.clientHeight;



    /**
    * Create Element ScrollBar.
    * @protected
    */
    function createScrollBar() {
        scrollBar = document.createElement('div');
        scrollBar.classList.add('smooth-scroll-bar-page');
        __Scroll.scrollContainer.appendChild(scrollBar);
    }
    

    /**
    * Check which waypoints are visible and add the 'animated' class.
    * @protected
    */
    function checkWayPoints() {
        waypoints.forEach(function(elm) {
            const elementTop      = elm.getBoundingClientRect().top + __Scroll.scrollPosition;
            const elementHeight   = elm.offsetHeight;
            const viewportTop     = __Scroll.scrollPosition;
            const viewportBottom  = __Scroll.scrollPosition + __Scroll.containerHeight;
            const activationPoint = elementTop + elementHeight * __Scroll.wayPointPercShow;

            if (viewportBottom >= activationPoint) {
                elm.classList.add('animated');
            }
        });
    }


    /**
    * Update scrollbar height based on content.
    * @protected
    */
    function updateScrollBar() {
        const scrollBarHeight       = (__Scroll.containerHeight / __Scroll.contentHeight) * __Scroll.containerHeight;
        const maxScrollBarPosition  = __Scroll.containerHeight - scrollBarHeight;
        const scrollBarPosition     = (__Scroll.scrollPosition / (__Scroll.contentHeight - __Scroll.containerHeight)) * maxScrollBarPosition;
        
        scrollBar.style.height      = `${scrollBarHeight}px`;
        scrollBar.style.transform   = `translateY(${scrollBarPosition}px)`;
    }


    /**
    * Apply transform translate x.
    * @protected
    */
    function applyTransform(value) {
        __Scroll.scrollContent.style.transform = `translateY(-${value}px)`;
    }


    /**
    * Add or remove the class 'is-hide' on header tag.
    * @protected
    */
    function toggleMenuFixed() {
        
        // Mode compact menu
        if (typeof IS_MOBILE !== 'undefined')
        {    
            if(!IS_MOBILE)
            {
                if( __Scroll.scrollPosition > 50 )
                {
                    header.classList.add('is-compact');

                    if( !__Scroll.activeToggleMenuFixed ) header.classList.add('is-hide');
                }else{
                    header.classList.remove('is-compact');

                    if( !__Scroll.activeToggleMenuFixed ) header.classList.remove('is-hide');
                }
            }
        }


        if( __Scroll.activeToggleMenuFixed ){

            // Show/hide menu with scroll
            let scrollPercent = (__Scroll.scrollPosition / (__Scroll.contentHeight - __Scroll.containerHeight));

            // Show / hide menu
            if( scrollPercent > checkScroll )
            {
                if( __Scroll.scrollPosition > 80 ){
                    if( !__Scroll.menuOpen ) header.classList.add('is-hide');
                }
            }else{
                header.classList.remove('is-hide');
            }

            checkScroll = scrollPercent;
        }
    }


    /**
    * Update position of scroll.
    * @param {Number} delta - Scroll direction, whether it is up(+) or down(-)
    * @protected
    */
    function updateScrollPosition(delta) {
        deltaOffSet = Math.abs(delta * __Scroll.scrollSpeed); // How much is offset on the wheel / ajust speed custom
        
        __Scroll.contentHeight = __Scroll.scrollContent.scrollHeight;

        if( __Scroll.activeScrollPage )
        {
            __Scroll.scrollPosition += delta * __Scroll.scrollSpeed;
            __Scroll.scrollPosition = Math.max(0, Math.min(__Scroll.scrollPosition, __Scroll.contentHeight - __Scroll.containerHeight));
            __Scroll.scrollPosition = Math.round(__Scroll.scrollPosition);

            applyTransform(__Scroll.scrollPosition);
            updateScrollBar();
            updateParallax();

            // Execute animation delay
            scrollTimeout = setTimeout(checkWayPoints, ((__Scroll.scrollSpeed * 1000) * 0.667)); // Time = 66% OF scrollSpeed 

            toggleMenuFixed();

            if( __Scroll.debug ) console.log('Scroll Page: '+__Scroll.scrollPosition);
            //console.log('delta: '+delta);
        }
    }


    /**
    * Listener for scrolling with mouse.
    * @public
    */
    __Scroll.scrollContainer.addEventListener('wheel', (e) =>
    {
        e.preventDefault();
        updateScrollPosition(e.deltaY);
    });


    /**
    * Listener for scrolling with keyboard arrows.
    * @protected
    */
    window.addEventListener('keydown', (e) =>
    {
        let delta = 0;

        if (e.key === 'ArrowUp') {
            delta = -100; 
        } else if (e.key === 'ArrowDown') {
            delta = 100;  
        } else {
            return;
        }

        e.preventDefault(); // Avoid default scrolling behavior with arrow keys
        __Scroll.activeScrollPage = true;
        updateScrollPosition(delta);
    });




    /**
    * Script for ScrollBar
    */

    createScrollBar();

    /**
    * Initial drag scroll bar - Event mouse down 
    * @protected
    */
    scrollBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY     = e.clientY;
        startScrollBarPosition = scrollBar.getBoundingClientRect().top - __Scroll.scrollContainer.getBoundingClientRect().top;
        e.preventDefault();

        scrollBar.classList.add('is-dragging');

        // Enable scroll smooth
        __Scroll.activeScrollPage = true;

        cancelAnimationFrame(animationId);
    });


    /**
    * Movement during dragging - Event mouse move
    * @protected
    */
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaY                = e.clientY - startY;
            const scrollBarHeight       = scrollBar.offsetHeight;
            const maxScrollBarPosition  = __Scroll.containerHeight - scrollBarHeight;

            let newScrollBarPosition = startScrollBarPosition + deltaY;
            newScrollBarPosition     = Math.max(0, Math.min(newScrollBarPosition, maxScrollBarPosition));

            const scrollRatio       = newScrollBarPosition / maxScrollBarPosition;
            __Scroll.scrollPosition = scrollRatio * (__Scroll.contentHeight - __Scroll.containerHeight);
            __Scroll.scrollPosition = Math.round(__Scroll.scrollPosition);


            updateScrollBar();
            checkWayPoints();
            toggleMenuFixed();
            updateParallax();

            requestAnimationFrame(() => {
                applyTransform(__Scroll.scrollPosition);
            });
        }
    });


    /**
    * End drag - Event mouse up 
    * @protected
    */
    document.addEventListener('mouseup', () => {
        isDragging = false;
        scrollBar.classList.remove('is-dragging');
    });




    /**
    * Script for Parallax
    */

    function updateParallax() {

        if (parallaxItems.length > 0) {

            parallaxItems.forEach(item =>
            {
                const rect       = item.getBoundingClientRect();
                const itemTop    = __Scroll.getOffsetTop(item);
                const itemHeight = rect.height;

                const start = parseInt(item.getAttribute('data-start'));
                const end   = parseInt(item.getAttribute('data-end'));

                let viewportStart = __Scroll.scrollPosition;
                let viewportEnd   = __Scroll.scrollPosition + __Scroll.containerHeight;

                if (viewportEnd > itemTop && viewportStart < itemTop + itemHeight)
                {
                    let progress = (viewportEnd - itemTop) / (__Scroll.containerHeight + itemHeight);

                    // AVOID PROGRESS BETWEEN 0 AND 1
                    progress = Math.min(Math.max(progress.toFixed(2), 0), 1);

                    let translateY = start + progress * (end - start);
                    translateY = Math.round(translateY);

                    item.style.transform = `translateY(${translateY}px)`;

                    if (__Scroll.debug) console.log('Parallax PosY [' + item.className + ']: ' + translateY);
                    if (__Scroll.debug) console.log('Progress [' + item.className + ']: ' + progress);

                } else if (viewportEnd <= itemTop) {
                    item.style.transform = `translateY(${start}px)`; // BEFORE ENTER VIEWPORT
                } else {
                    item.style.transform = `translateY(${end}px)`; // AFTER OUT VIEWPORT
                }
            });
        }


        if (parallaxLeftItems.length > 0) {

            parallaxLeftItems.forEach(item => {
                const start  = parseInt(item.getAttribute('data-start'));
                const end    = parseInt(item.getAttribute('data-end'));
                const offset = parseInt(item.getAttribute('data-offset'));

                if (__Scroll.scrollPosition >= (start - deltaOffSet) && __Scroll.scrollPosition <= (end + deltaOffSet))
                {
                    const progress = (__Scroll.scrollPosition - start) / (end - start); // PROGRESS BETWEEN 0 AND 1
                    let translateX = progress * offset; // CALCULATES DISPLACEMENT BASED ON PROGRESS
                    translateX     = Math.round(translateX);

                    item.style.transform = `translateX(-${translateX}px)`;

                    if( __Scroll.debug ) console.log('Paraleft PosX: '+translateX);
                }
            });
        }
    }


    function setStartParallaxLeft() {
        if (parallaxLeftItems.length > 0)
        {
            parallaxLeftItems.forEach(item =>
            {
                const itemHeight = outerHeight(item);
                const dataStart  = parseInt(__Scroll.getOffsetTop(item) - __Scroll.containerHeight - itemHeight);
                const dataEnd    = dataStart + __Scroll.containerHeight + itemHeight;

                item.setAttribute('data-start', dataStart);
                item.setAttribute('data-end', dataEnd);
            });
        }
    }


    function outerHeight(element) {
        const style        = window.getComputedStyle(element);
        const height       = element.getBoundingClientRect().height;
        const marginTop    = parseFloat(style.marginTop);
        const marginBottom = parseFloat(style.marginBottom);
        const totalHeight  = height + marginTop + marginBottom;

        return totalHeight;
    }





    // The delay is to give time to load images that change the size of the page

    setTimeout( () => {
        updateResizePage();
        updateScrollBar();
        scrollToHashElement();

        if( __Scroll.debug ) console.log('Smooth Scroll initialized.');

    }, timeDelayInitial);

    checkWayPoints();


   

    // Resize window
    window.addEventListener('resize', () => {
        setTimeout(updateResizePage, 1000);

        if( screen.width > 768 ) checkWayPoints();
    });


    function updateResizePage(){
        __Scroll.contentHeight     = __Scroll.scrollContent.scrollHeight;
        __Scroll.containerHeight   = __Scroll.scrollContainer.clientHeight;

        setStartParallaxLeft();
    }


    // Scrolls to the element matching the url hash
    function scrollToHashElement() {
        const hash = window.location.hash;

        if (hash) {
            const elementId = hash.slice(1);  // Remove '#' from the beginning of the hash
            const element   = document.getElementById(elementId);

            if (element) {
                __Scroll.smoothScrollTo(`#${elementId}`);  // Scrolls to the element with the id

                __Scroll.scrollPosition = __Scroll.getOffsetTop(`#${elementId}`);

                header.classList.add('is-hide');

                setTimeout( () => {
                    checkWayPoints();
                    updateScrollBar();
                }, 1100);
            }
        }
    }



    // Event click move to link
    if (smoothScrollLink.length > 0) {

        smoothScrollLink.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
        
                let link     = this.getAttribute('href');
                let attrLink = this.getAttribute('data-smooth-time-link');
                let timeLink = 2000;

        
                if (link)
                {
                    const elementId = link.slice(1);  // REMOVE '#' FROM THE BEGINNING OF THE HASH
                    const element   = document.getElementById(elementId);
        
                    if (element)
                    {
                        if( attrLink != null && attrLink != "" ) timeLink = attrLink;

                        let timeLinkSec = timeLink / 1000; // CONVERT SECONDS

                        // APPLY PROP CSS
                        scrollBar.style.setProperty('--time-scroll-page', timeLinkSec+'s');
                        scrollBar.classList.add('is-link');
                        __Scroll.scrollContent.style.setProperty('--time-scroll-page', timeLinkSec+'s');
                        __Scroll.scrollContent.classList.add('is-link');
                        header.classList.add('is-hide');


                        __Scroll.smoothScrollTo(`#${elementId}`);  // SCROLLS TO THE ELEMENT WITH THE ID
                        __Scroll.scrollPosition   = __Scroll.getOffsetTop(`#${elementId}`);
                        __Scroll.activeScrollPage = false; // DISABLE SCROLLING MOUSE
        
                        updateScrollBar();

                        setTimeout( () => {
                            checkWayPoints();
                            updateParallax();

                            // REMOVE PROP CSS
                            __Scroll.scrollContent.classList.remove('is-link');
                            __Scroll.scrollContent.style.removeProperty('--time-scroll-page');
                            scrollBar.style.removeProperty('--time-scroll-page');
                            scrollBar.classList.remove('is-link');

                            __Scroll.activeScrollPage = true; // ENABLE SCROLLING MOUSE

                        }, timeLink - (timeLink*0.2));
                    }
                }
            });
        });
    }
});



/**
* Get distance the of element until top.
* @public
* @param {String | DOM element} element - String of class or id [.class] [#id] | DOM element
* @return {Number} - The distance.
*/
__Scroll.getOffsetTop = function(element) {

    if (typeof element === 'string') {
        element = document.querySelector(element);
        if (!element) {
            console.log('Element not found for selector:', element);
            return null;
        }
    }

    let distance = 0;
    let currentElement = element;

    // SUM DISTANCE
    while (currentElement && currentElement !== __Scroll.scrollContent) {
        distance += currentElement.offsetTop;
        currentElement = currentElement.offsetParent;
    }

    return distance;
}


/**
* Get distance the of element until top.
* @public
* @param {String | DOM element} elm - String of class or id [.class] [#id] | DOM element
* @param {Number} offset - The amount of displacement.
*/
__Scroll.smoothScrollTo = function(elm, offset=0) {
    if( elm )
    {
        __Scroll.scrollContent.style.transform = `translateY(-${__Scroll.getOffsetTop(elm)+offset}px)`;
    } else return false;
}