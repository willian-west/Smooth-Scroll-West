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

__Scroll.scrollAmountMove       = 1.2;    // {float} Changes the amount of page displacement when scrolling
__Scroll.scrollMoveTime         = 1100;   // {int}   Scroll movement time - in milliseconds
__Scroll.waypointPercShow       = 0.3;    // {float} Adjust percentage to show elements on scroll
__Scroll.timeCheckWayPoint      = 700;    // {int}   Time to check the waypoint class when the scroll movement stops
__Scroll.activeScrollPage       = true;   // {boolean} Enable page scrolling
__Scroll.debug                  = false;  // {boolean} Mode debug
__Scroll.activeToggleMenuFixed  = true;   // {boolean} Add or remove the class 'is-hide' on 'header' tag
__Scroll.localhost              = false;  // {boolean} Mode development
__Scroll.URLhashListener        = true;   // {boolean} Move page still the id element
__Scroll.activeWaypointAnim     = true;   // {boolean} Enable entry animations for elements that have the 'waypoint' class by adding the 'animated' class


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

    let IS_MOBILE = false;

    // Detects if the device is mobile
    if (window.matchMedia("(pointer: coarse)").matches) {
        IS_MOBILE = true;
    }

    // Check all required classes
    if( __Scroll.scrollContainer == null && __Scroll.scrollContent == null){
        console.warn('Unable to launch Smooth Scroll without ".smooth-scroll-container" and ".smooth-scroll-content" elements.');
        return false;
    }

    let checkScroll;
    let scrollBar;
    let animationId;
    let timeDelayInitial          = 500;
    let isDragging                = false;
    let startY                    = 0;
    let startScrollBarPosition    = 0;
    let deltaOffSet               = 0;
    let smoothScrollPage          = localStorage.getItem("smooth-scroll-page");
    let smoothScrollLocalPosition = parseFloat(localStorage.getItem("smooth-scroll-position")) || 0;
    const waypoints               = document.querySelectorAll('.waypoint');
    const headerTag               = document.querySelector('header');
    const parallaxItems           = document.querySelectorAll('.js-parallax');
    const parallaxHorizItems      = document.querySelectorAll('.js-parallax-h');
    const parallaxZoomItems       = document.querySelectorAll('.js-parallax-z');
    const smoothScrollLink        = document.querySelectorAll('.smooth-scroll-link');


    // Set height of container
    if( IS_MOBILE ){
        __Scroll.containerHeight = document.documentElement.clientHeight;
    } else {
        __Scroll.containerHeight = __Scroll.scrollContainer.clientHeight;
    }

    // Set height of content
    __Scroll.contentHeight = __Scroll.scrollContent.scrollHeight;


    // Check ENV localhost
    if ( window.location.href.includes("localhost") && !IS_MOBILE ) {
        __Scroll.localhost = true;
    }

    

    /**
    * Message Warning.
    * @protected
    */
    function warn(text) {
        console.warn(text);
    }


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

        if( __Scroll.activeWaypointAnim ){
            if (waypoints.length > 0) {
                waypoints.forEach(function(elm) {
                    const elementTop      = elm.getBoundingClientRect().top + __Scroll.scrollPosition;
                    const elementHeight   = elm.offsetHeight;
                    const viewportBottom  = __Scroll.scrollPosition + __Scroll.containerHeight;
                    const activationPoint = elementTop + elementHeight * __Scroll.waypointPercShow;

                    if (viewportBottom >= activationPoint) {
                        elm.classList.add('animated');
                    }
                });
            }
        }

    }


    /**
    * Update scrollbar height based on content.
    * @protected
    */
    function updateScrollBar() {
        if (!IS_MOBILE)
        {
            const scrollBarHeight       = (__Scroll.containerHeight / __Scroll.contentHeight) * __Scroll.containerHeight;
            const maxScrollBarPosition  = __Scroll.containerHeight - scrollBarHeight;
            const scrollBarPosition     = (__Scroll.scrollPosition / (__Scroll.contentHeight - __Scroll.containerHeight)) * maxScrollBarPosition;
            
            scrollBar.style.height      = `${scrollBarHeight}px`;
            scrollBar.style.transform   = `translateY(${scrollBarPosition}px)`;
        }
    }


    /**
    * Apply transform translate x.
    * @protected
    */
    function applyTransform(value) {
        __Scroll.scrollContent.style.transform = `translateY(-${value}px)`;
    }


    /**
    * Add or remove the class 'is-hide' on headerTag tag.
    * @protected
    */
    function toggleMenuFixed() {

        if( headerTag == null ) return false;

        // Mode compact menu
        if( __Scroll.scrollPosition > 50 )
        {
            headerTag.classList.add('is-compact');
            if( __Scroll.activeToggleMenuFixed ) headerTag.classList.add('is-hide');
        }else{
            headerTag.classList.remove('is-compact');
            if( __Scroll.activeToggleMenuFixed ) headerTag.classList.remove('is-hide');
        }



        if( __Scroll.activeToggleMenuFixed )
        {
            // Show/hide menu with scroll
            let scrollPercent = (__Scroll.scrollPosition / (__Scroll.contentHeight - __Scroll.containerHeight));

            // Show / hide menu
            if( scrollPercent > checkScroll )
            {
                if( __Scroll.scrollPosition > 80 ){
                    if( !__Scroll.menuOpen ) headerTag.classList.add('is-hide');
                }
            }else{
                headerTag.classList.remove('is-hide');
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
        deltaOffSet = Math.abs(delta * __Scroll.scrollAmountMove); // How much is offset on the wheel / ajust speed custom
        
        __Scroll.contentHeight = __Scroll.scrollContent.scrollHeight;

        if( __Scroll.activeScrollPage )
        {
            __Scroll.scrollPosition += delta * __Scroll.scrollAmountMove;
            __Scroll.scrollPosition = Math.max(0, Math.min(__Scroll.scrollPosition, __Scroll.contentHeight - __Scroll.containerHeight));
            __Scroll.scrollPosition = Math.round(__Scroll.scrollPosition);

            applyTransform(__Scroll.scrollPosition);
            updateScrollBar();
            updateParallax();

            if( __Scroll.localhost ) localStorage.setItem("smooth-scroll-position", __Scroll.scrollPosition);
            

            if( __Scroll.activeWaypointAnim ){
                // Execute 'checkWayPoints' for play in animation delay
                scrollTimeout = setTimeout(checkWayPoints, __Scroll.timeCheckWayPoint);
            }

            toggleMenuFixed();

            if( __Scroll.debug ) console.log('Scroll Page: '+__Scroll.scrollPosition);
            //console.log('delta: '+delta);
        }
    }


    /**
    * Handle Wheel, Keys Events
    */

    if( !IS_MOBILE )
    {
        __Scroll.scrollContainer.addEventListener('wheel', scrollContainerWheel);
        window.addEventListener('keydown', windowKeyDown);

    }else{

        // For Mobile
        window.addEventListener('scroll', () => {
            const scrollPosition    = window.scrollY;
            __Scroll.scrollPosition = scrollPosition;

            updateParallax();
            checkWayPoints();
            toggleMenuFixed();
        });

    }

    





    /**
    * Listener for scrolling with mouse.
    * @public
    */
    function scrollContainerWheel(e) {
        e.preventDefault();
        updateScrollPosition(e.deltaY);
    }


    /**
    * Listener for scrolling with keyboard arrows.
    * @protected
    */
    function windowKeyDown(e) {
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
    }




    /**
    * Script for ScrollBar
    */

    if( !IS_MOBILE ) {
        createScrollBar();

        /**
        * Handle Mouse Events
        */
    
        scrollBar.addEventListener('mousedown', scrollBarMouseDown);
        document.addEventListener('mousemove', documentMouseMove);
        document.addEventListener('mouseup', documentMouseUp);
    }


    


    /**
    * Initial drag scroll bar - Event mouse down 
    * @protected
    */
    function scrollBarMouseDown(e) {
        isDragging = true;
        startY     = e.clientY;
        startScrollBarPosition = scrollBar.getBoundingClientRect().top - __Scroll.scrollContainer.getBoundingClientRect().top;
        e.preventDefault();

        scrollBar.classList.add('is-dragging');

        // Enable scroll smooth
        __Scroll.activeScrollPage = true;

        cancelAnimationFrame(animationId);
    }


    /**
    * Movement during dragging - Event mouse move
    * @protected
    */
    function documentMouseMove(e) {
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
    }


    /**
    * End drag - Event mouse up 
    * @protected
    */
    function documentMouseUp() {
        isDragging = false;
        scrollBar.classList.remove('is-dragging');
    }





    /**
    * Script for Parallax
    */

    function updateParallax() {

        // VERTICAL
        if (parallaxItems.length > 0) {

            parallaxItems.forEach(item =>
            {
                const rect       = item.getBoundingClientRect();
                const itemTop    = __Scroll.getOffsetTop(item);
                const itemHeight = rect.height;

                let start = parseInt(item.getAttribute('data-start'));
                let end   = parseInt(item.getAttribute('data-end'));

                if( isNaN(start) ){
                    start = -50;
                    warn("Element '"+ item.className +"' is missing the required 'data-start' attribute.");
                }

                if( isNaN(end) ){
                    end = 50;
                    warn("Element '"+ item.className +"' is missing the required 'data-end' attribute.");
                }


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


        // HORIZONTAL
        if (parallaxHorizItems.length > 0)
        {
            parallaxHorizItems.forEach(item => {
                let direction  = "left";
                const start    = parseInt(item.getAttribute('data-start'));
                const end      = parseInt(item.getAttribute('data-end'));
                let offset     = parseInt(item.getAttribute('data-offset'));
                let attrDirect = item.getAttribute('data-direction');

                if( attrDirect == "right" ) direction = "right";

                if( isNaN(offset) ){
                    offset = 100;
                    warn("Element '"+ item.className +"' is missing the required 'data-offset' attribute.");
                }

                if (__Scroll.scrollPosition >= (start - deltaOffSet) && __Scroll.scrollPosition <= (end + deltaOffSet))
                {
                    if (IS_MOBILE) offset = offset / 2; // Reduces displacement by half

                    const progress = (__Scroll.scrollPosition - start) / (end - start); // Progress between 0 and 1
                    let translateX = progress * offset; // Calculates displacement based on progress
                    translateX     = Math.round(translateX);

                    if( direction == "left" ){
                        item.style.transform = `translateX(-${translateX}px)`;
                    }else{
                        item.style.transform = `translateX(${translateX}px)`;
                    }

                    if( __Scroll.debug ) console.log('Parallax PosX: '+translateX);
                }
            });
        }


        // ZOOM
        if (parallaxZoomItems.length > 0)
        {
            parallaxZoomItems.forEach(item => {
                const start = parseInt(item.getAttribute('data-start'));
                const end   = parseInt(item.getAttribute('data-end'));
                let zoom    = parseInt(item.getAttribute('data-zoom'));

                if( isNaN(zoom) ){
                    zoom = 20;
                    warn("Element '"+ item.className +"' is missing the required 'data-zoom' attribute. Value between 1 and 100");
                }

                if (__Scroll.scrollPosition >= (start - deltaOffSet) && __Scroll.scrollPosition <= (end + deltaOffSet))
                {
                    const progress = (__Scroll.scrollPosition - start) / (end - start); // Progress between 0 and 1
                    let scale = (progress * (zoom/100)) + 1; // Calculates zoom based on progress

                    item.style.transform = `scale(${scale})`;

                    if( __Scroll.debug ) console.log('Parallax Scale: '+scale);
                }
            });
        }
    }


    /**
    * Set 'data-start' and 'data-end' for 'parallax-h' class.
    * @protected
    */
    function setStartParallaxHoriz() {
        if (parallaxHorizItems.length > 0)
        {
            parallaxHorizItems.forEach(item =>
            {
                const itemHeight = outerHeight(item);
                const dataStart  = parseInt(__Scroll.getOffsetTop(item) - __Scroll.containerHeight - itemHeight);
                const dataEnd    = dataStart + __Scroll.containerHeight + itemHeight;

                item.setAttribute('data-start', Math.round(dataStart));
                item.setAttribute('data-end', Math.round(dataEnd));
            });
        }

        if (parallaxZoomItems.length > 0)
        {
            parallaxZoomItems.forEach(item =>
            {
                const itemHeight = outerHeight(item);
                const dataStart  = parseInt(__Scroll.getOffsetTop(item) - __Scroll.containerHeight - itemHeight);
                const dataEnd    = dataStart + __Scroll.containerHeight + itemHeight;

                item.setAttribute('data-start', Math.round(dataStart));
                item.setAttribute('data-end', Math.round(dataEnd));
            });
        }
    }


    /**
    * Get height of element.
    * @param {element DOM} element
    * @protected
    */
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
        
        if( __Scroll.URLhashListener ) scrollToHashListener();

        if( __Scroll.localhost ) scrollToHistoric();

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

        if( IS_MOBILE ){
            __Scroll.containerHeight  = document.documentElement.clientHeight;
        } else {
            __Scroll.containerHeight  = __Scroll.scrollContainer.clientHeight;
        }

        setStartParallaxHoriz();
    }




    // Scrolls to the element matching the url hash
    function scrollToHistoric() {

        if( smoothScrollPage !== window.location.href )
        {
            localStorage.setItem("smooth-scroll-page", window.location.href);
        }
        else
        {
            if (!isNaN(smoothScrollLocalPosition))
            {
                __Scroll.scrollPosition = smoothScrollLocalPosition;
                applyTransform(smoothScrollLocalPosition);
                updateScrollBar();

                setTimeout( checkWayPoints(), __Scroll.scrollMoveTime);
            }
        }
    }




    // Scrolls to the element matching the url hash
    function scrollToHashListener() {
        const hash = window.location.hash;

        if (hash) {
            const elementId = hash.slice(1);  // Remove '#' from the beginning of the hash
            const element   = document.getElementById(elementId);

            if (element) {
                __Scroll.smoothScrollTo(`#${elementId}`);  // Scrolls to the element with the id

                __Scroll.scrollPosition = __Scroll.getOffsetTop(`#${elementId}`);

                if( headerTag != null ) headerTag.classList.add('is-hide');

                setTimeout( () => {
                    checkWayPoints();
                    updateScrollBar();
                }, __Scroll.scrollMoveTime);
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
                        
                        if( headerTag != null ) headerTag.classList.add('is-hide');


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