

/* eslint eqeqeq: 0 */
/* eslint no-unused-vars: 0 */

/* v4.0/w create fullscreen*/


(function($){
    "use strict";
    $.fn.vitGallery = function( options) {
        //Default settings
        var settings = $.extend({
            debag: false,
            galleryHeight: 'auto',
            imgBlockClass: 'gallery__img-block',
            controls: 'thumbnails', // points thumbnails
            controlsClass: 'gallery__controls',
            thumnailWidth: 90,
            thumnaiHeight: 60,
            thumbnailMargin: 15,
            thumbnailAnimation: true,
            thumnailAnimationSpeed: 1000,
            animateSpeed: 1000,
            description: true,
            imgPadding: 15,
            autoplay: false,
            autoplayDelay: 5000,
            fullscreen: false,
            transition: 'slide' // slide crossfade slide-blur

        }, options);


        //Default variables
        var $this = $(this) // .gallery
          , $galleryBlock // .gallery__block
          , $imgBlock = $this.find('.'+ settings.imgBlockClass) // .gallery__img-block
          , $controlsBlock = $this.find('.'+ settings.controlsClass) // .gallery__controls
          , $prevButton // .gallery .prev
          , $nextButton // .gallery .next
          , $controlsItem // .gallery__controls__item
          , $galleryInner // .gallery__inner
          , $descriptionBlock // .gallery__description-block
          , galleryInnerPosition // css left of gallery inner
          , $currentBlock // .gallery__img-block.current
          , currentBlockIndex // index of current block
          , $galleryControlsUl
          , $centerThumbnail
          , $currentControlItem
          , $galleryControlsInner
          , controlsInnerPosition
          , $fullscreenWrap
          ;


        //Classess
        var _galleryInnerClass = 'gallery__inner'
          , _galleryDescriptionClass = 'gallery__description-block'
          , _thumbnailImgClass = 'gallery__thumbnail'
          , _controlsClass = 'gallery__controls'
          , _fullscreenWrapClass = 'gallery__fullscreen__wrap'
          , _fullscreenButtonClass = 'gallery__fullscreen__bt'
          , _fullscreenExitClass =  'gallery__fullscreen__exit'
          ;

        //Timer
        var sliderTimer;

        function updatevariables(functionName) {
            //console.log(functionName);
            $controlsBlock = $this.find('.' + settings.controlsClass);
            $galleryBlock = $this.find('.gallery__block');
            $prevButton = $this.find('.prev');
            $nextButton = $this.find('.next');
            $controlsItem = ( $this.find('.gallery__thumbnail').length > 0 ) ? $this.find('.gallery__thumbnail') : $this.find('.gallery__controls__item');
            $galleryInner = $this.find('.gallery__inner');
            $currentBlock = $galleryInner.find('.gallery__img-block.current');
            $descriptionBlock = $imgBlock.find('.gallery__description-block__description');
            currentBlockIndex = $currentBlock.index();
        }

        function updateSlideVariables() {
            $currentBlock = $galleryInner.find('.gallery__img-block.current');
            currentBlockIndex = $currentBlock.index();
            $descriptionBlock = $imgBlock.find('.gallery__description-block__description');
            $currentControlItem = $('.' + _controlsClass).find('.current');

            if (settings.controls == 'thumbnails') {
                controlsInnerPosition = parseInt($galleryControlsInner.css('left'));
            }
        }

        function addClasses () {
            $imgBlock.each(function(){
                $(this).find('span').addClass('gallery__description-block__description');
                $(this).find('img').addClass('gallery__img-block__img')
            })
            updatevariables();
        }

        function addWrapper() {
            $imgBlock.wrapAll('<div class="gallery__block"><div class="' + _galleryInnerClass + '"></div></div>');
            updatevariables();
        }

        function getFullWidth() {
            var imgBlockWidth = 0;
            if (settings.imgPadding && settings.imgPadding != 0) {
                imgBlockWidth = ($imgBlock.length - 1) * settings.imgPadding;
            }
            $imgBlock.each(function(){
                imgBlockWidth = imgBlockWidth + $(this).outerWidth();
            })

            updatevariables();
            return imgBlockWidth;
        }

        function setInnerWidth() {
            var inner = $this.find('.' + _galleryInnerClass);
            inner.css('width', getFullWidth());

            updatevariables();
        }

        function setImgBlockWidth() {
            $imgBlock.css('width', $this.width());
            updatevariables('setImgBlockWidth');
        }

        function setGalleryHeight() {

            $imgBlock.each(function(){
                var img = $(this).find('.gallery__img-block__img');
                $(this).addClass('load');


                img.bindImageLoad(function () { //Plugin for load image (look at the end of page)

                    var img = $(this);
                    setTimeout(function () {
                        img.parent().removeClass('load');
                        // обнуляем переменную, чтобы GC сделал свою работу
                        img = null;
                    }, 100);

                });
            })

            updatevariables('setGalleryHeight');
        }

        function createControlsButton() {
            var prev = '<span class="prev"></span>'
              , next = '<span class="next"></span>'
              , buttonBlock = '<div class="gallery__controls-buttons"></div>'
              ;

            var newItem = $galleryBlock.append($(buttonBlock));

            newItem.find('.gallery__controls-buttons').append($(prev)).append($(next))
        }

        function createFullscreen() {
            var $body = $('body')
              , fullscreenButton = '<span class="' + _fullscreenButtonClass + '"></span>'
              , fullscreenWrap = '<div class="' + _fullscreenWrapClass + ' ' + 'fullscreen_' + $this.attr('class') + '"></div>'
              , fullscreenClose = '<span class="' + _fullscreenExitClass + '"></span>'
              , fakeBlock = '<div class="gallery__fake"></div>'
              , fullScreenControls = '<div class="gallery__fullscreen__controls"><span class="prev"></span><span class="next"></span></div>'
              ;

            $galleryBlock.append(fullscreenButton);

            $this.append(fullscreenWrap);

            $fullscreenWrap = $body.find('.fullscreen_' + $this.attr('class')).append(fullscreenClose);
            $fullscreenWrap.append(fakeBlock);
            $fullscreenWrap.append(fullScreenControls);

            //$controlsBlock.clone().appendTo($fullscreenWrap);

            var fullscreenThumbnailsBlock = $fullscreenWrap.find('.' + settings.controlsClass).addClass('fullscreen');
        }

        function openCurrentImage () {
            var currentImageSrc = $currentBlock.find('img').attr('src');

            $fullscreenWrap.append('<img src="' + currentImageSrc + '" class="gallery__fullscreen__img">');
        }

        function changeFullscreenImg(where, index) {
            var $currentImage = $fullscreenWrap.find('.gallery__fullscreen__img');

            switch (where) {
                case 'next':
                    var nextImgSrc = $currentBlock.next().find('img').attr('src');
                    $currentImage.attr('src', nextImgSrc);
                    break;

                case 'prev':
                    var prevImgSrc = $currentBlock.prev().find('img').attr('src');
                    $currentImage.attr('src', prevImgSrc);
                    break;

                case 'goTo':
                    var goToImgSrc = $('.gallery__img-block').eq(index).find('img').attr('src');
                    $currentImage.attr('src', goToImgSrc);
                    break;
            }
        }

        function createControls() {
            if (settings.controls) {
                $controlsBlock = $this.find('.' + settings.controlsClass);

                var item = '<li class="gallery__controls__item"></li>';

                for (var i=0; $imgBlock.length > i; i++) {
                    var newItem = $controlsBlock.append(item);

                }

                $('.gallery__controls__item').each(function(index){
                    $(this).addClass('item_' + index)
                })

                $controlsBlock.append(newItem);
                var galleryUl = $(newItem).find('li').wrapAll('<ul class="gallery__controls__ul"></ul>');

            }

            //getCurrentSlide();
            updatevariables('createControls');
        }

        function createThumbnails() {
            var controlInner = '<div class="gallery__controls__inner"></div>'
              , controlsThumbnailul = '<div class="gallery__controls__thumbnails-ul"></div>'
              , newItem
              ;

            if (settings.controls) {
                $controlsBlock = $this.find('.' + settings.controlsClass);

                var $galleryUl = $controlsBlock.append(controlsThumbnailul);
                $galleryUl.find('.gallery__controls__thumbnails-ul').append(controlInner);
                $galleryControlsUl = $galleryUl.find('.gallery__controls__thumbnails-ul');
                $galleryControlsInner = $('.gallery__controls__inner');


                $imgBlock.each(function() {
                    var $thumnailImg = $(this).find('img');
                    var thumnailImgUrl = $thumnailImg.attr('alt');

                    newItem = document.createElement('img');
                    newItem.src = thumnailImgUrl;
                    $(newItem).css('width', '100%')
                    $galleryControlsInner.append($(newItem));
                })

                $galleryControlsInner.find('img').wrap('<span class="'+_thumbnailImgClass+'"></span>');

                $('.' + _thumbnailImgClass).width(settings.thumnailWidth)
                                           .height(settings.thumnaiHeight)
                                           .css('margin-right', settings.thumbnailMargin)
                                           .attr('data-index', $(this).index())
                                           .last().css('margin-right', 0)
                                           ;
                $('.' + _thumbnailImgClass).append('<i></i>')

                $galleryControlsInner.css({
                    width: ( $('.' + _thumbnailImgClass).outerWidth() + settings.thumbnailMargin ) * $('.' + _thumbnailImgClass).length - settings.thumbnailMargin,
                    left: 0
                });

                updatevariables('createThumbnails');
            }
        }

        function getCenterThumbnail() {
            var containerWidth = $galleryControlsUl.outerWidth()
              , $thumnail = $('.gallery__thumbnail')
              , thumnailWidth = $thumnail.outerWidth()
              , countThumbInCont = Math.round( containerWidth / thumnailWidth ) / 2
              ;

            countThumbInCont = Math.round(countThumbInCont)
            $centerThumbnail = $thumnail.eq(countThumbInCont - 1);
            $centerThumbnail.addClass('center');
        }

        function createDescription() {
            $galleryBlock.append('<div class="' + _galleryDescriptionClass + '"></div>');

            //console.log(currentBlockIndex);
            $descriptionBlock.each(function() {
                $('.' + _galleryDescriptionClass).append($(this));
            })

            $descriptionBlock.eq(currentBlockIndex).addClass('current');

            updatevariables('createDescription');
        }

        function changeDescription(currentIndex, index) {
            $descriptionBlock = $this.find('.gallery__description-block__description');
            $descriptionBlock.eq(currentIndex).removeClass('current');
            $descriptionBlock.eq(index).addClass('current');
        }

        function showImg() {
            $imgBlock.each(function(index){
                if (index != 0) {
                    $(this).css('display', 'inline-block');
                }
            })
            updatevariables('showImg');
        }

        function animateThumbnail (direction, currentIndex) {

            switch (direction) {
                case 'next':
                    $controlsItem.eq(currentIndex)
                        .find('i').css({left: 'auto', width: '100%'})
                        .animate({width: 0}, settings.thumbnailAnimationSpeed, function() {
                            $(this).css({left: '', width: ''});
                        });

                    $controlsItem.eq(currentIndex + 1)
                        .find('i').css({right: 'auto', width: '0'})
                        .animate({width: '100%'}, settings.thumbnailAnimationSpeed, function() {
                            $(this).css({right: '', width: ''});
                        });
                    break;

                case 'prev':
                    $controlsItem.eq(currentIndex)
                        .find('i').css({right: 'auto', width: '100%'})
                        .animate({width: '0'}, settings.thumbnailAnimationSpeed, function() {
                            $(this).css({right: '', width: ''});
                        });
                    $controlsItem.eq(currentIndex - 1)
                        .find('i').css({left: 'auto', width: '0'})
                        .animate({width: '100%'}, settings.thumbnailAnimationSpeed, function() {
                            $(this).css({left: '', width: ''});
                        });
                    break;
            }
        }

        function nextSlide(callback) {
            if (!$currentBlock.is(':last-child')) {

                if (settings.transition == 'slide'){
                    $galleryInner.animate({
                        left: galleryInnerPosition - $imgBlock.width()
                    }, settings.animateSpeed);
                    galleryInnerPosition = galleryInnerPosition - $imgBlock.width();
                } else if (settings.transition == 'crossfade') {
                    $currentBlock.animate({
                        opacity: 0
                    }, 150);

                    $currentBlock.animate({
                        opacity: 1
                    }, 150);
                } else if (settings.transition == 'slide-blur') {

                    $galleryInner.animate({
                        left: galleryInnerPosition - $imgBlock.width()
                    }, settings.animateSpeed, function() {
                        $imgBlock.removeClass('do-transition');
                    });

                    galleryInnerPosition = galleryInnerPosition - $imgBlock.width();

                    $currentBlock.addClass('do-transition').next().addClass('do-transition');

                    $currentBlock.animate({
                        opacity: 1
                    }, 150);
                }

                if (settings.fullscreen) {
                    changeFullscreenImg('next')
                }

                $currentBlock.removeClass('current');
                $currentBlock.next().addClass('current');
                $controlsItem.eq(currentBlockIndex).removeClass('current');
                $controlsItem.eq(currentBlockIndex + 1).addClass('current');

                if (settings.thumbnailAnimation) {
                    animateThumbnail ('next', currentBlockIndex);
                }

                if (settings.autoplay ) {
                    clearInterval(sliderTimer);
                    autoplay();
                }

                changeDescription(currentBlockIndex , currentBlockIndex + 1);
                updateSlideVariables();
                getCurrentSlide();

                if (callback) {
                    callback();
                }

                checkLastSlide(currentBlockIndex);
            }
            return currentBlockIndex;
        }

        function prevSlide(callback) {
            if (!$currentBlock.is(':first-child')) {

                if (settings.transition == 'slide'){
                    $galleryInner.animate({
                        left: galleryInnerPosition + $imgBlock.width()
                    }, settings.animateSpeed);
                    galleryInnerPosition = galleryInnerPosition + $imgBlock.width();
                } else if (settings.transition == 'crossfade') {
                    $currentBlock.animate({
                        opacity: 0
                    }, 150);

                    $currentBlock.animate({
                        opacity: 1
                    }, 150);
                } else if (settings.transition == 'slide-blur') {

                    $galleryInner.animate({
                        left: galleryInnerPosition + $imgBlock.width()
                    }, settings.animateSpeed, function() {
                        $imgBlock.removeClass('do-transition');
                    });

                    galleryInnerPosition = galleryInnerPosition + $imgBlock.width();

                    $currentBlock.addClass('do-transition').prev().addClass('do-transition');

                    $currentBlock.animate({
                        opacity: 1
                    }, 150);
                }

                if (settings.fullscreen) {
                    changeFullscreenImg('prev')
                }

                $currentBlock.removeClass('current');
                $currentBlock.prev().addClass('current');

                $controlsItem.eq(currentBlockIndex).removeClass('current');
                $controlsItem.eq(currentBlockIndex - 1).addClass('current');

                if (settings.thumbnailAnimation) {
                    animateThumbnail ('prev', currentBlockIndex);
                }

                if (settings.autoplay ) {
                    clearInterval(sliderTimer);
                    autoplay();
                }

                changeDescription(currentBlockIndex, currentBlockIndex - 1);
                updateSlideVariables();
                getCurrentSlide();

                if (settings.controls == 'thumbnails'){
                    var containerOffsetBegin = $galleryControlsUl.offset().left;
                    var firstItemOffset = $controlsItem.first().offset().left;
                }

                if (callback) {
                    callback();
                }

                checkLastSlide(currentBlockIndex);
            }
        }

        function goToSlide(thisIndex) {
            if (settings.transition == 'slide'){
                if (currentBlockIndex < thisIndex) {
                    $galleryInner.animate({
                        left: galleryInnerPosition - ( $imgBlock.width() * ( thisIndex -  currentBlockIndex))
                    }, settings.animateSpeed);

                    galleryInnerPosition = galleryInnerPosition - ( $imgBlock.width() * ( thisIndex -  currentBlockIndex))

                } else {
                    $galleryInner.animate({
                        left: - ( $imgBlock.width() * ( thisIndex +  currentBlockIndex) +  galleryInnerPosition)
                    }, settings.animateSpeed);

                    galleryInnerPosition = - ( $imgBlock.width() * ( thisIndex +  currentBlockIndex) +  galleryInnerPosition)
                }
            } else if (settings.transition == 'crossfade') {
                $galleryInner.find('.current').animate({
                    opacity: 0
                }, 150);

                $galleryInner.find('.current').animate({
                    opacity: 1
                }, 150);
            } else if (settings.transition == 'slide-blur'){
                if (currentBlockIndex < thisIndex) {
                    $galleryInner.animate({
                        left: galleryInnerPosition - ( $imgBlock.width() * ( thisIndex -  currentBlockIndex))
                    }, settings.animateSpeed, function() {
                        $imgBlock.removeClass('do-transition');
                    });

                    $imgBlock.addClass('do-transition');

                    galleryInnerPosition = galleryInnerPosition - ( $imgBlock.width() * ( thisIndex -  currentBlockIndex))

                } else {
                    $galleryInner.animate({
                        left: - ( $imgBlock.width() * ( thisIndex +  currentBlockIndex) +  galleryInnerPosition)
                    }, settings.animateSpeed, function() {
                        $imgBlock.removeClass('do-transition');
                    });

                    $imgBlock.addClass('do-transition');

                    galleryInnerPosition = - ( $imgBlock.width() * ( thisIndex +  currentBlockIndex) +  galleryInnerPosition)
                }
            }

            changeDescription($galleryInner.find('.current').index(), thisIndex);

            $galleryInner.find('.current').removeClass('current');
            $imgBlock.eq(thisIndex).addClass('current');

            if (settings.thumbnailAnimation) {
                $controlsBlock.find('.current').find('i').css({width: '', left: '', right: ''})

                if (currentBlockIndex - thisIndex == -1) {
                    animateThumbnail ('next', currentBlockIndex);
                } else if (currentBlockIndex - thisIndex == 1) {
                    animateThumbnail ('prev', currentBlockIndex);
                }
            }

            $controlsBlock.find('.current').removeClass('current');


            $controlsItem.eq(thisIndex).addClass('current');


            getCurrentSlide();
            updateSlideVariables();

            if (settings.autoplay ) {
                clearInterval(sliderTimer);
                autoplay();
            }

            if (settings.fullscreen) {
                changeFullscreenImg('goTo', $galleryInner.find('.current').index());
            }

            checkLastSlide(currentBlockIndex);
        }

        function checkLastSlide(index) {
            var itemLength = $controlsItem.length;

            if (index == $controlsItem.length - 1) {
                $this.find('.next').addClass('hide');
            } else {
                $this.find('.next').removeClass('hide');
            }
            if (index == 0) {
                $this.find('.prev').addClass('hide');
            } else {
                $this.find('.prev').removeClass('hide');
            }
        }

        function scrollControls(direction) {

            var controlsInnerPosition = parseInt($galleryControlsInner.css('left'));

            if (direction == 'back') {
                $galleryControlsInner.animate({
                    left: controlsInnerPosition - ( $controlsItem.outerWidth() + settings.thumbnailMargin)
                }, settings.animateSpeed)
            } else if (direction == 'forward') {
                $galleryControlsInner.animate({
                    left: controlsInnerPosition + ( $controlsItem.outerWidth() + settings.thumbnailMargin)
                }, settings.animateSpeed)
            }

            updateSlideVariables();
        }

        function autoplay() {
            var countSlides = $imgBlock.length;
            //console.log('autoplay');
            sliderTimer = setInterval(function() {

                if ( (currentBlockIndex + 1) / countSlides  == 1  ) {
                    clearInterval(sliderTimer);

                    setTimeout(function() {
                        goToSlide(0)
                    }, settings.autoplayDelay / 2);
                }

                nextSlide();

            }, settings.autoplayDelay);

        }

        function bindEvents() {
            galleryInnerPosition = parseInt($galleryInner.css('left'));
            currentBlockIndex = $currentBlock.index();
            var clickCount = 0;

            $prevButton.on('click', function(){
                if (!$(this).hasClass('hide')){
                    clickCount++;
                    $currentBlock = $galleryInner.find('.gallery__img-block.current');
                    prevSlide();
                }
            })

            $nextButton.on('click', function(){
                if (!$(this).hasClass('hide')){
                    $currentBlock = $galleryInner.find('.gallery__img-block.current');
                    nextSlide();
                }
            })


            $controlsItem.on('click', function() {
                goToSlide($(this).index());

            })

            if (settings.fullscreen) {
                var $fullscreenButton = $this.find('.' + _fullscreenButtonClass)
                  , $fullscreenExitButton = $('.fullscreen_' + $this.attr('class')).find('.' + _fullscreenExitClass)
                  ;

                $fullscreenButton.on('click', function() {
                    $fullscreenWrap.addClass('open');
                    $controlsBlock.appendTo($fullscreenWrap);
                    if (settings.controls == 'thumbnails') {
                        $('.gallery__thumbnail.center').removeClass('center');
                        getCenterThumbnail();
                    }
                    openCurrentImage();

                })

                $fullscreenExitButton.on('click', function() {
                    $fullscreenWrap.removeClass('open');
                    $controlsBlock.appendTo($this);
                    if (settings.controls == 'thumbnails') {
                        $('.gallery__thumbnail.center').removeClass('center');
                        getCenterThumbnail();
                    }
                    getCurrentSlide();

                    $fullscreenWrap.find('.gallery__fullscreen__img').remove();
                })
            }

            if (settings.controls == 'thumbnails'){
                $galleryControlsInner.on('mousedown', function( e ) {
                    var clickPosition = e.pageX
                      , startPosition = $galleryControlsInner.css('left')
                      , offsetLeft = $(this).offset().left
                      , offsetRight = $(this).offset().left + $(this).outerWidth()
                      , oldX
                      , newX
                      ;

                    $(window).on('mousemove', function(e) {

                        var delta = clickPosition - e.pageX;
                        var oldX = e.pageX;

                        (function() {
                            setTimeout(function() {
                                newX = e.pageX
                            }, 50)
                        })()

                        if (oldX > newX ) {
                            $galleryControlsInner.css('left', parseInt(startPosition) - delta);
                        }

                        if (oldX < newX){
                            $galleryControlsInner.css('left', parseInt(startPosition) - delta);
                        }

                        e.preventDefault();
                    }).on('mouseup', function(e) {

                        e.preventDefault();

                        if ($galleryControlsInner.offset().left >= $galleryControlsInner.parent().offset().left) {
                            $galleryControlsInner.addClass('go-back').css('left', 0)
                            setTimeout(function() {
                                $galleryControlsInner.removeClass('go-back')
                            },300)
                        }

                        if ($galleryControlsInner.offset().left + $galleryControlsInner.outerWidth()  <= $galleryControlsInner.parent().offset().left + $galleryControlsInner.parent().outerWidth()) {
                            $galleryControlsInner.addClass('go-back').css('left', $galleryControlsInner.parent().outerWidth() - $galleryControlsInner.outerWidth())
                            setTimeout(function() {
                                $galleryControlsInner.removeClass('go-back')
                            },300)
                        }
                        $(this).unbind('mousemove');
                    })
                    e.preventDefault();
                })
            }

            $(window).on('resize', function() {
                if (settings.autoplay ) {
                    clearInterval(sliderTimer);
                }
                setGalleryHeight();
                setImgBlockWidth();
                setInnerWidth();
                updateSlideVariables();

                $galleryInner.css('left', - (currentBlockIndex * $currentBlock.width()));
                galleryInnerPosition = - (currentBlockIndex * $currentBlock.width())
                if (settings.autoplay ) {
                    autoplay();
                }
            })
        }

        function getCurrentSlide() {
            var index = 0;

            if ($this.find('.current').length > 0) {
                index = $this.find('.current').index();


                if (settings.controls == 'thumbnails'){
                    var curentItemOffset = $controlsItem.eq(index).offset().left + (($controlsItem.outerWidth() + settings.thumbnailMargin) / 2)
                      , centerItemOffset = $centerThumbnail.offset().left + (($controlsItem.outerWidth() + settings.thumbnailMargin) / 2)
                      ;

                    if ($controlsItem.eq(index).index() > $centerThumbnail.index() - 1 && $controlsItem.eq(index).index() <= $controlsItem.length - $centerThumbnail.index() - 2) {
                        $galleryControlsInner.animate({
                            left: -(curentItemOffset - centerItemOffset)
                        }, 300)

                    }
                }

                $controlsItem.eq(index).addClass('current');
                $galleryInner.css('left', - (index * $imgBlock.width()));



            } else {
                $imgBlock.first().addClass('current');
                $controlsItem.first().addClass('current');
            }

            updatevariables('getCurrentSlide');
            updateSlideVariables();

            return index;
        }

        function init() {
            addClasses();
            addWrapper();
            createControlsButton();

            setGalleryHeight();
            setImgBlockWidth();
            setInnerWidth();
            showImg();


            if (settings.controls == 'points'){
                createControls();
            } else if (settings.controls == 'thumbnails') {
                createThumbnails();
                getCenterThumbnail();
            }

            if (settings.fullscreen) {
                createFullscreen();
            }

            getCurrentSlide();

            if (settings.description) {
                createDescription();
            }

            bindEvents();

            if (settings.autoplay ) {
                autoplay();
            }
        }

        init();

    }
})(jQuery);
(function ($) {
    "use strict";
    $.fn.bindImageLoad = function (callback) {
        function isImageLoaded(img) {
            if (!img.complete) {
                return false;
            }
            if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        }

        return this.each(function () {
            var ele = $(this);
            if (ele.is("img") && $.isFunction(callback)) {
                ele.one("load", callback);
                if (isImageLoaded(this)) {
                    ele.trigger("load");
                }
            }
        });
    };
})(jQuery);