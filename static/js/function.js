$(document).ready(function() {
    "use strict";

    /* shop grid list */
    $(".display-mode-default > button").on("click", function() {
        $(this).addClass('active').siblings().removeClass('active');;

        if ($(this).hasClass('btn-grid')) {
            $(".products").addClass("product-grid");
            $(".products").removeClass("product-list");

            $(".products .item").removeClass("col-lg-12 col-md-12 col-sm-12");
            $(".products .item").addClass("col-lg-3 col-md-6 col-sm-6");
        }
        if ($(this).hasClass('btn-list')) {
            $(".products").addClass("product-list");
            $(".products").removeClass("product-grid");

            $(".products .item").removeClass("col-lg-3 col-md-6 col-sm-6");
            $(".products .item").addClass("col-lg-12 col-md-12 col-sm-12");
        }
    });

    $(".display-mode-full > button").on("click", function() {
        $(this).addClass('active').siblings().removeClass('active');;

        if ($(this).hasClass('btn-grid')) {
            $(".products").addClass("product-grid");
            $(".products").removeClass("product-list");

            $(".products .item").removeClass("col-lg-12 col-md-12 col-sm-12");
            $(".products .item").addClass("col-lg-5 col-md-5 col-sm-6");
        }
        if ($(this).hasClass('btn-list')) {
            $(".products").addClass("product-list");
            $(".products").removeClass("product-grid");

            $(".products .item").removeClass("col-lg-5 col-md-5 col-sm-6");
            $(".products .item").addClass("col-lg-12 col-md-12 col-sm-12");
        }
    });

    /* close quickview */
    $(".newsletter-close").on("click", function() {
        $('.newsletter').hide();-
        $('.newsletter').removeClass('open');
        $('.newsletter-modal').removeClass('show');
    });

    /*masonry*/
    $('#container').each(function() {
        $('#container').masonry();
    });

    /*lightbox*/
    $('.lightbox').each(function() {
        $('.lightbox').littleLightBox();
    });
    /*menu-dropdow*/
    $('.navbar a.dropdown-toggle').on('click', function(e) {
        var $el = $(this);
        var $parent = $(this).offsetParent(".dropdown-menu");
        $(this).parent("li").toggleClass('open');

        if (!$parent.parent().hasClass('nav')) {
            $el.next().css({
                "top": $el[0].offsetTop,
                "left": $parent.outerWidth() - 4
            });
        }

        $('.nav li.open').not($(this).parents("li")).removeClass("open");

        return false;
    });
    /*end/menu-dropdow*/
    /*owlCarousel*/
    $('#index12').owlCarousel({
        loop: true,
        nav: true,
        center: true,
        margin: 30,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 3
            }
        }
    });
    $('#index122').owlCarousel({
        loop: true,
        nav: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });
    $('#index121').owlCarousel({
        loop: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },  
            1000: {
                items: 1
            }
        }
    });
    $('.js-owl-brand').owlCarousel({
        margin: 30,
        autoplay: false,
        autoplayTimeout: 3000,
        loop: true,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'></span>", "<span class='fa fa-angle-right'></span>"],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 3
            },
            1024: {
                items: 5
            },
            1200: {
                items: 5
            }
        }
    });
    /*owlCarousel/
    /* Modal-video*/
    $(".btn-play").on("click", function(event) {
        var target = $(this).attr('href'),
            url = $(target).data('video');

        var has_query_string = url.split('?', url);
        if (typeof has_query_string[1] == 'string') {
            url += '&' + $(target).data('query-string');
        } else {
            url += '?' + $(target).data('query-string');
        }
        $(target).find('iframe').attr('src', url);

        $(target).addClass('opened');
        $(target).on("click", function() {
            $(this).removeClass('opened').attr('src', '');
        });

        event.preventDefault();
    });
    /*end/modal video*/

    /*  Show/hidden-password*/

    $(".toggle-password").on("click", function() {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("data-toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    /* end/ Show/hidden-password*/

    /*check-uot*/
    $('.dropdown-menu li').on("click", function() {
        $('#selected').text($(this).text());
        $('li ').removeClass("active");
        $(this).addClass("active");
    });
    $('.dropdown-menu li').on("click", function() {
        $('#selected1').text($(this).text());
        $('li ').removeClass("active");
        $(this).addClass("active");
    });

    /*end/check-uot*/

  
    // ENGO_CountDown
    $.fn.ENGO_CountDown = function(options) {
        return this.each(function() {
            new $.ENGO_CountDown(this, options);
        });
    }
    $.ENGO_CountDown = function(obj, options) {
        var ddiff, gsecs;
        this.options = $.extend({
            autoStart: true,
            LeadingZero: true,
            DisplayFormat: "<div><span>%%D%% :</span> Days</div><div><span>%%H%% :</span> Hours</div><div><span>%%M%% :</span> Mins</div><div><span>%%S%% :</span> Secs</div>",
            FinishMessage: "Expired",
            CountActive: true,
            TargetDate: null
        }, options || {});
        if (this.options.TargetDate == null || this.options.TargetDate == '') {
            return;
        }
        this.timer = null;
        this.element = obj;
        this.CountStepper = -1;
        this.CountStepper = Math.ceil(this.CountStepper);
        this.SetTimeOutPeriod = (Math.abs(this.CountStepper) - 1) * 1000 + 990;
        var dthen = new Date(this.options.TargetDate);
        var dnow = new Date();
        if (this.CountStepper > 0) {
            ddiff = new Date(dnow - dthen);
        } else {
            ddiff = new Date(dthen - dnow);
        }
        gsecs = Math.floor(ddiff.valueOf() / 1000);
        this.CountBack(gsecs, this);
    };
    $.ENGO_CountDown.fn = $.ENGO_CountDown.prototype;
    $.ENGO_CountDown.fn.extend = $.ENGO_CountDown.extend = $.extend;
    $.ENGO_CountDown.fn.extend({
        calculateDate: function(secs, num1, num2) {
            var s = ((Math.floor(secs / num1)) % num2).toString();
            if (this.options.LeadingZero && s.length < 2) {
                s = "0" + s;
            }
            return "<b>" + s + "</b>";
        },
        CountBack: function(secs, self) {
            var DisplayStr;
            if (secs < 0) {
                self.element.innerHTML = '<div class="labelexpired"> ' + self.options.FinishMessage + "</div>";
                return;
            }
            clearInterval(self.timer);
            DisplayStr = self.options.DisplayFormat.replace(/%%D%%/g, self.calculateDate(secs, 86400, 100000));
            DisplayStr = DisplayStr.replace(/%%H%%/g, self.calculateDate(secs, 3600, 24));
            DisplayStr = DisplayStr.replace(/%%M%%/g, self.calculateDate(secs, 60, 60));
            DisplayStr = DisplayStr.replace(/%%S%%/g, self.calculateDate(secs, 1, 60));
            self.element.innerHTML = DisplayStr;
            if (self.options.CountActive) {
                self.timer = null;
                self.timer = setTimeout(function() {
                    self.CountBack((secs + self.CountStepper), self);
                }, (self.SetTimeOutPeriod));
            }
        }

    });

    function init_countdown() {
        /** Countdown **/
        $('[data-countdown="countdown"]').each(function(index, el) {
            var $this = $(this);
            var $date = $this.data('date').split("-");
            $this.ENGO_CountDown({
                TargetDate: $date[0] + "/" + $date[1] + "/" + $date[2] + " " + $date[3] + ":" + $date[4] + ":" + $date[5],
                DisplayFormat: "<li><p>%%D%% <span></span> </p><span>days</span></li><li><p>%%H%% <span></span></p><span>HOURS</span></li><li><p>%%M%% <span></span> </p><span>mins</span></li><li><p>%%S%% </p><span>secs</span></li>",
                FinishMessage: "Expired"
            });
        });

    }

    function init_countdown_prd() {
        $('[data-countdown="countdown_prd"]').each(function(index, el) {
            var $this = $(this);
            var $date = $this.data('date').split("-");
            $this.ENGO_CountDown({
                TargetDate: $date[0] + "/" + $date[1] + "/" + $date[2] + " " + $date[3] + "-" + $date[4] + "-" + $date[5],
                DisplayFormat: "<li><p>%%D%% <span>-</span> </p></li><li><p>%%H%% <span>-</span></p></li><li><p>%%M%% <span>-</span> </p</li><li><p>%%S%% </p></li>",
                FinishMessage: "Expired"
            });
        });

    }
    init_countdown_prd();
    init_countdown();
    // End/ENGO_CountDown

    /*select*/
    aweSelect();

    function aweSelect() {
        $('.awe-select').each(function(index, el) {
            $(this).selectpicker();
        });

    }

    /*end/select*/

    /*datepicker*/
    $(function() {
        $('#datepicker').each(function() {
            $(this).datepicker({
                autoclose: true,
                todayHighlight: true
            }).datepicker('update', new Date());
        });
        $('#datepickeri').each(function() {
            $(this).datepicker({
                autoclose: true,
                todayHighlight: true
            }).datepicker('update', new Date());
        });

        $('#datepicker1').each(function() {
            $("#datepicker1").datepicker({
                dateFormat: 'mm/dd/yy',
                changeMonth: true,
                changeYear: true,
                yearRange: '-100y:c+nn',
                maxDate: '-1d'
            });
        });

        $('#datepicker2').each(function() {
            $("#datepicker2").datepicker({
                dateFormat: 'mm/dd/yy',
                changeMonth: true,
                changeYear: true,
                yearRange: '-100y:c+nn',
                maxDate: '-1d'
            });
        });

    });

    /*end/datepicker*/

    /*STATISTICS Count Number*/
    StatisticsCount();

    function StatisticsCount() {
        if ($('.item .count').length) {

            $('.item').appear(function() {

                var count_element = $('.count', this).html();
                $(".count", this).countTo({
                    from: 0,
                    to: count_element,
                    speed: 2000,
                    refreshInterval: 50,
                });
            });
        }
    }

    /*click-hamburger*/

    $('[data-toggle="offcanvas"], .btn-offcanvas').on("click", function(event) {
        event.stopPropagation();
        $('body').toggleClass('menu-open');
        $("#pbr-off-canvas").toggleClass("active");
    })

    $(document).bind("mouseup touchend", function(e) {
        var container = jQuery("#pbr-off-canvas");
        if (!container.is(e.target) // if the target of the click isn't the container...
            &&
            container.has(e.target).length === 0) // ... nor a descendant of the container
        {
           $("#pbr-off-canvas").removeClass("active");
           $('body').removeClass('menu-open');
        }
    });

    $('.burger-menu').on("click", function(event){
        $(this).toggleClass('active');
        $('.header-v2').toggleClass('menu-popup-open');
        $('#content_menu_popup').toggleClass('menu-popup-open');
        $('.logo').toggleClass('active');
        $('.header-right').toggleClass('active');
    })
    /*end/hamburger*/

    /*sidebar fixed*/
    $('[data-toggle="filter"]').on("click", function(event) {
        event.stopPropagation();
        $('body').toggleClass('filter-open');
        $(".sidebar-fixed").toggleClass("filter-active");
    })
    $(document).bind("mouseup touchend", function(e) {
        var container = jQuery(".sidebar-fixed");
        if (!container.is(e.target) // if the target of the click isn't the container...
            &&
            container.has(e.target).length === 0) // ... nor a descendant of the container
        {
           $(".sidebar-fixed").removeClass("filter-active");
           $('body').removeClass('filter-open');
        }
    });

    //fixed cart home 4
    $('.btn-fix-cart').on("click", function(event) {
        event.stopPropagation();
        $('body').toggleClass('cart-open');
        $("#content-cart").toggleClass("active");
    })

    var day, month, year;

    /*owlCarousel-events*/
    $('#events').owlCarousel({
        loop: true,
        nav: true,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 9000,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });
    $('#events-v2').owlCarousel({
        loop: true,
        nav: true,
        margin: 30,
        autoplay: true,
        autoplayTimeout: 9000,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });
    $('#v6').owlCarousel({
        loop: true,
        nav: true,
        margin: 30,
        autoplay: true,
        autoplayTimeout: 9000,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 4
            }
        }
    })
    /*end-owlCarousel-events*/

    /*owlCarousel-testimonials*/
    $('#testimonials').owlCarousel({
        loop: true,
        nav: true,
        margin: 30,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });
    /*end-owlCarousel-testimonials*/
    /*owlCarousel-rooms*/
    $('#rooms').owlCarousel({
        loop: true,
        nav: true,
        margin: 5,
        touchDrag  : false,
        mouseDrag  : false,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2,
                touchDrag  : true,
                mouseDrag  : true
            },
            768: {
                items: 3
            },
            1200: {
                items: 5
            }
        }
    });
    /*end-owlCarousel-rooms*/
    $('ul li a').on("click", function() {
        $('li a').removeClass("active");
        $(this).addClass("active");
    });
    /*scroll-top*/
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').on("click", function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    //Slick slide
    $('.js-fullw').slick({
        autoplay: true,
        dots: true,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                }
            }

        ]
    });

    $('.js-multiple-row').slick({
        autoplay: true,          
        arrows: true,
        dots: false,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    autoplaySpeed: 2000,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                    arrows: false,
                    infinite: true,
                    autoplaySpeed: 2000,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    infinite: true,
                    arrows: false,
                    autoplaySpeed: 2000,
                }
            }

        ]
    });

    $('#slider').slick({
        autoplay: true,          
        arrows: true,
        dots: true,    
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        daptiveHeight: true,   
    });

    $('.carousel-slide').slick({
        autoplay: true,          
        arrows: true,
        dots: false,    
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        daptiveHeight: true,   
    });

    $('#pro_related').slick({
        autoplay: true,          
        arrows: false,
        dots: false,    
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
        daptiveHeight: true,   
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    arrows: false,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    arrows: false,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    arrows: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    arrows: false,
                }
            }

        ]
    });

    $('.carousel-slide01').slick({
        autoplay: true,
        dots: false,
        arrows: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                }
            }

        ]
    });
    $('.js-slide-pro-h8').slick({
        centerMode: true,
        autoplay: false,
        dots: true,
        arrows: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    arrows: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                    dots: true,
                }
            }

        ]
    });

    (function($) {
        /* Gallery Isotope */
        function GalleryIsotope() {
            if ($('.gallery').length) {
                $('.gallery').each(function(index, el) {
                    var $this = $(this),
                        $isotope = $this.find('.gallery-isotope'),
                        $filter = $this.find('.gallery-cat');

                    if ($isotope.length) {
                        var isotope_run = function(filter) {
                            $isotope.isotope({
                                itemSelector: '.item-isotope',
                                filter: filter,
                                percentPosition: true,
                                masonry: {
                                    columnWidth: '.item-size'
                                },
                                transitionDuration: '0.6s',
                                hiddenStyle: {
                                    opacity: 0
                                },
                                visibleStyle: {
                                    opacity: 1
                                }
                            });
                        }

                        $filter.on('click', 'a', function(event) {
                            event.preventDefault();
                            $(this).parents('ul').find('.active').removeClass('active');
                            $(this).parent('li').addClass('active');
                            isotope_run($(this).attr('data-filter'));
                        });

                        isotope_run('*');
                    }
                });
            }
        }

        $(window).load(function() {
            $('#preloader').delay(1000).fadeOut('400', function() {
                $(this).fadeOut()
            });
            $('body').append('<div class="awe-popup-overlay" id="awe-popup-overlay"></div><div class="awe-popup-wrap" id="awe-popup-wrap"><div class="awe-popup-content"></div><span class="awe-popup-close" id="awe-popup-close"></div>');
            GalleryIsotope();
        });

    })(jQuery);

    /*MAP*/
    function init() {

        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(40.6933804, -74.0196236),
            styles: [{
                "featureType": "administrative.province",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{
                    "saturation": -100
                }, {
                    "lightness": 65
                }, {
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{
                    "saturation": -100
                }, {
                    "lightness": 51
                }, {
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{
                    "saturation": -100
                }, {
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [{
                    "saturation": -100
                }, {
                    "lightness": 30
                }, {
                    "visibility": "on"
                }]
            }, {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [{
                    "saturation": -100
                }, {
                    "lightness": 40
                }, {
                    "visibility": "on"
                }]
            }, {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{
                    "saturation": -100
                }, {
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "transit",
                "elementType": "geometry.fill",
                "stylers": [{
                    "visibility": "on"
                }]
            }, {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "hue": "#ffff00"
                }, {
                    "lightness": -25
                }, {
                    "saturation": -97
                }]
            }, {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "on"
                }, {
                    "lightness": -25
                }, {
                    "saturation": -100
                }]
            }]
        };
        var mapElement = document.getElementById('map');
        var map = new google.maps.Map(mapElement, mapOptions);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(40.6933804, -74.0196236),
            map: map,
            title: 'Snazzy!'
        });
    }
    if ($('#map').length > 0) {
        google.maps.event.addDomListener(window, 'load', init);

    }
    /*END/MAP*/

    /*datepicker*/
    $(".carousel-search li a").on("click", function() {
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText);
    });
    /*end/datepicker*/

    // Js product single slider
    $('.js-product-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      arrows: false,
      fade: true,
      asNavFor: '.js-carousel-product'
    });
    $('.js-carousel-product').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '.js-product-slider',
      dots: false,
      arrows: false,
      infinite: true,
      centerMode: true,
      focusOnSelect: true
    });

    // Js product single quantity
    $('.plus').click(function () {
        if ($(this).prev().val() < 100) {
        $(this).prev().val(+$(this).prev().val() + 1);
        }
    });
    $('.minus').click(function () {
        if ($(this).next().val() > 1) {
        if ($(this).next().val() > 1) $(this).next().val(+$(this).next().val() - 1);
        }
    });
    // star rating
    var $star_rating = $('.star-rating .fa');
    var SetRatingStar = function() {
      return $star_rating.each(function() {
        if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
          return $(this).removeClass('fa-star-o').addClass('fa-star');
        } else {
          return $(this).removeClass('fa-star').addClass('fa-star-o');
        }
      });
    };

    $star_rating.on('click', function() {
      $star_rating.siblings('input.rating-value').val($(this).data('rating'));
      return SetRatingStar();
    });

    SetRatingStar();
    $(document).ready(function() {

    });
    // tabs menu
    var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;
        
        var dropdowndesc = this.el.find('.dropdowndesc');
        dropdowndesc.on('click',
                        { el: this.el, multiple: this.multiple },
                        this.dropdown);
    };
    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el,
            $this = $(this),
            $next = $this.next();
        
        $next.slideToggle();
        $this.parent().toggleClass('open');    
        if(!e.data.multiple) {
          $el.find('.dropdown-menu').not($next).slideUp().parent().removeClass('open');
        }
    }
    var accordion = new Accordion($('.navbar-tabs'), false); 

    // Single product
    var $proitem = $('.pro-option-color .item-option .item');

    $proitem.on('click', function() {
        $(this).removeClass('active');
        $(this).addClass('active')
           .siblings('.item').removeClass('active');
    });

    // Slide animation
 
    // home 6 
    $('#slider-v6').on('init', function(e, slick) {
        var $firstAnimatingElements = $('div.slider-v6:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);    
    });
    $('#slider-v6').on('beforeChange', function(e, slick, currentSlide, nextSlide) {
              var $animatingElements = $('div.slider-v6[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
              doAnimations($animatingElements);    
    });
    $('#slider-v6').slick({
        autoplay: true,   
        autoplaySpeed: 4000,       
        arrows: true,
        dots: true,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    arrows: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false,
                    infinite: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    dots: true,
                    infinite: true,
                    arrows: false,
                }
            }

        ]
    });
    // home 5 
    $('#slider-v5').on('init', function(e, slick) {
        var $firstAnimatingElements = $('div.slider-v5:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);    
    });
    $('#slider-v5').on('beforeChange', function(e, slick, currentSlide, nextSlide) {
              var $animatingElements = $('div.slider-v5[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
              doAnimations($animatingElements);    
    });
    $('#slider-v5').slick({
        autoplay: true,  
        autoplaySpeed: 4000,        
        arrows: true,
        dots: false,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    autoplaySpeed: 2000,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                    arrows: false,
                    infinite: true,
                    autoplaySpeed: 2000,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    infinite: true,
                    arrows: false,
                    autoplaySpeed: 2000,
                }
            }

        ]
    });
    // home 3
    $('#full-slider').on('init', function(e, slick) {
        var $firstAnimatingElements = $('div.full-slide:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);    
    });
    $('#full-slider').on('beforeChange', function(e, slick, currentSlide, nextSlide) {
              var $animatingElements = $('div.full-slide[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
              doAnimations($animatingElements);    
    });
    $('#full-slider').slick({
        autoplay: true,
        autoplaySpeed: 4000,
        dots: true,
        arrows: false,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                }
            }

        ]
    });
    function doAnimations(elements) {
        var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        elements.each(function() {
            var $this = $(this);
            var $animationDelay = $this.data('delay');
            var $animationType = 'animated ' + $this.data('animation');
            $this.css({
                'animation-delay': $animationDelay,
                '-webkit-animation-delay': $animationDelay
            });
            $this.addClass($animationType).one(animationEndEvents, function() {
                $this.removeClass($animationType);
            });
        });
    }

});
