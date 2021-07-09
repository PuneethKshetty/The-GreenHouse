/*!
 * littleLightBox - jQuery Plugin
 * version: 0.9 (Tues, 2 Aug 2016)
 * requires jQuery v1.7 or later
 *
 *
 * Copyright 2016 Sherry Tao - tao_shiyu@hotmail.com
 *
 */
(function(win, doc, $, undefined) {
    "use strict";
    var window = $(win),
        document = $(doc),
        isQuery	= function(obj) {
           return obj && obj.hasOwnProperty && obj instanceof $;
       },
        lightbox = $.littleLightBox = function () {
           lightbox.open.apply( this, arguments );
       };

    $.extend(lightbox, {
        defaults: {
                helpers: {

                },
                tpl: {
                    wrap: '<div class="lightbox-wrap"><div class="lightbox-skin"><div class="lightbox-outer"><div class="lightbox-inner" style="overflow: hidden;"></div></div></div></div>',
                    img: '<img class="lightbox-image" src="{href}" style="width:100%;height:100%;"/>',
                    loading: '<div class="lightbox-loading"><div></div></div>',
                    closeBtn: '<div class="lightbox-closeBtn"></div>',
                    prevBtn: '<div class="lightbox-prevBtn lightbox-nav"><span></span></div>',
                    nextBtn: '<div class="lightbox-nextBtn lightbox-nav"><span></span></div>',
                },
                padding: 15,
                minWidth: 200,
                minHeight: 200,
                maxWidth: 9999,
                maxHeight: 9999,
                wrapRatio: 0.8,
                top: 0.5,
                left: 0.5,
                loop: false,

                // Open Animate.
                openMethod: 'fadeIn', // including 'changeIn','fadeIn', 'elasticIn'
                openDirect: 'down', // Avaliable if openMethod is 'changeIn', 'down', 'up', 'left', 'right' is avaliable.
                openSpeed: 400,

                distance: 200, // Avaliable if openMethod is 'changeIn', 200 and 'hide' is avaliable.

                // Close Animate.
                closeMethod: 'fadeOut',
                closeDirect: 'up',
                closeDistance: 'hide',
                closeSpeed: 400,

                // Change Animate.
                prevMethod: 'changeOut',
                nextMethod: 'changeIn',
                changeSpeed: 600,

                direction: {
                    next: 'left',
                    prev: 'right'
                },

                // key settings
                 keys: {
                     close: [27, 46], // esc key & delete key
                     next: {
                         13: 'left', // enter key
                         39: 'left', // right arrow
                         68: 'left', // D key
                         40: 'up',   // down arrow
                         34: 'up',   // pgdn key
                         83: 'up',   // S key
                     },
                     prev: {
                         8: 'right',  // backspace key
                         37: 'right', // left arrow
                         65: 'right', // A key
                         38: 'down',  // up arrow
                         33: 'down',  // pgup key
                         87: 'down',  // W key
                     },
                 },
            },
        helpers: {},
        isOpen: false,
        isClosing: false,
        isDisplay: false,

        doUpdate: null,
        coming: null,
        current: null,

        open: function(group, options) {
            // prevent $.littleLightBox() or new lightbox().
            if (!group) {
               return;
           }

            this.opts = $.extend({}, this.defaults, options || {});
            
            if (options && options.keys) {
                 $.extend(this.opts, this.defaults.keys, options.keys);
             }

            // Normalize group
            if (!$.isArray(group)) {
                group = isQuery(group) ? group.get() : [group];
            }

            // Get images information from group ( caption, href, index in group)
            $.each(group, function(index, element) {
                var obj = {},
                    text = '',
                    href = '',
                    idx = 0;

                idx = index + 1;

                if (element.nodeType) {
                    element = $(element);
                }

                if (isQuery(element)) {
                    href = element.data('lightbox-href') || element.attr('href');
                    text = element.data('lightbox-title') || element.attr('title') || '';
                }

                href || (element.attr('src') && (href = element.attr('src'))) || (href = element.find('img[src]').attr('src'));

                if (!href) {
                    return false;
                }

                $.extend(obj, {
                    index: idx,
                    href: href,
                    text: text,
                    element: element,
                });

                group[index] = obj;
            });

            this.group = group;

            this._run(this.opts.index);
        },

        next: function(direct) {
            if (lightbox.isClosing) {
                return ;
            }

            var current = lightbox.current,
                index,
                direction;

            if (current) {
                index = current.index;
                direction = (direct && $.type(direct) === "string") ? direct : current.direction.next;

                this._jump(index + 1, direction);
            }
        },

        prev: function(direct) {
            if (lightbox.isClosing) {
                return ;
            }
            var current = lightbox.current,
                index,
                direction;

            if (current) {
                index = current.index;
                direction = (direct && $.type(direct) === "string") ? direct : current.direction.prev;

                this._jump(index - 1, direction);
            }
        },

        _jump: function(index, direction) {
            if (!this.isDisplay)
                 return ;

            var imageNum = this.group.length,
                index = index - 1;
            
            lightbox.direction = direction;
            this._hideLoading();

            if (this.opts.loop) {
                // Get Really index
                if (index < 0) {
                    index = imageNum + (index % imageNum);
                }
                index = index % imageNum;
            }

            this._run(index);
        },

        _run: function(index) {

            var obj = (this.group)[index],
                coming = $.extend({}, this.opts, obj);	

            if (!obj) {
                 return ;
             }	

            if (!this.isOpen) {
                this.helpers.mask.open(this.opts.helpers.mask || {});			
            }
            
            // prepare wrap struct
            this.wrap = coming.wrap = $(coming.tpl.wrap).appendTo(coming.parent || 'body').hide();

            if ($.type(coming.padding) === 'number') {
                coming.padding = [coming.padding, coming.padding, coming.padding, coming.padding];
            }
            
            $.extend(coming, {
                skin: $('.lightbox-skin', coming.wrap),
                outer: $('.lightbox-outer', coming.wrap),
                inner: $('.lightbox-inner', coming.wrap),
                loading: null,
            });

            coming.inner.width(0).height(0);
            this.width = coming.padding[1] + coming.padding[3];
            this.height = coming.padding[0] + coming.padding[2];

            coming.skin.css('padding', coming.padding[0] + 'px '
                                    + coming.padding[1] + 'px '
                                    + coming.padding[2] + 'px '
                                    + coming.padding[3] + 'px');

            this._setPosition(coming.wrap, false);

            this.coming = coming;

            this._loadImage();
        },

        _loadImage: function() {
            var image = new Image(),
                that = this;
            image.src = this.coming.href;

            image.onload = function () {
                that.coming.width = this.width;
                that.coming.height = this.height;

                that._afterLoad();
            };

            if (!image.complete) {
                this._showLoading();
            }
        },

        _showLoading: function() {
            var that = this,
                pos = this._getPosition();
            
            if (this.coming.loading) {
                return ;
            }

            this._hideLoading();
            this.coming.loading = $(this.coming.tpl.loading).appendTo(this.coming.parent || 'body');
            this.coming.loading.css({
                top: window.height() * 0.5 + pos.scrollTop,
                left: window.width() * 0.5 + pos.scrollLeft,
            });
        },

        _hideLoading: function() {
            if (this.coming && this.coming.loading) {
                this.coming.loading.stop().off('.loading').remove();
                this.coming.loading = null;
            }
        },

        _afterLoad: function() {
            this._hideLoading();
            var href,
                current = this.coming,
                previous = this.current,
                content;

            $.extend(lightbox, {
                wrap: current.wrap,
                skin: current.skin,
                outer: current.outer,
                inner: current.inner,
                current: current,
                previous: previous,
                coming: null,
            });

            this.unbindEvent();

            if (previous) {
                this.width = 'auto';
                this.height = 'auto';

                this.helpers.title.hide();
                previous.wrap.stop(true, true).find('.lightbox-nav, .lightbox-closeBtn').remove();
            }

            href = current.href;
            content = current.tpl.img.replace(/\{href\}/g, href);
            $(content).appendTo(current.inner);

            // create title helper.

            var titleOpts = $.extend({'text': current.text,
                                    'idxInfo': '( ' + current.index + ' of ' + this.group.length +' )'},
                                    current.helpers.title);
            this.helpers.title.show(titleOpts);

            current.closeBtn = $(current.tpl.closeBtn).appendTo(current.skin);
            
            current.wrap.show();

            if (current.index > 1 || this.opts.loop) {
                current.prevBtn = $(current.tpl.prevBtn).appendTo(current.skin);
            }
            
            if (current.index < this.group.length || this.opts.loop) {
                current.nextBtn = $(current.tpl.nextBtn).appendTo(current.skin);
            }

            this.bindEvent();
            
            this._setDimension(false);
            this._setPosition(this.wrap, false);

            // Transition
            if (previous) {
                this.isDisplay = false;
                this.trasition[previous.prevMethod]();
            }
            this.trasition[this.isOpen ? current.nextMethod : current.openMethod]();
        },

        unbindEvent: function() {
            var current = this.current;

             if (current && isQuery(current.wrap)) {
                 current.wrap.off('.btn');
             }

             window.off('.lb');
             document.off('.lb');
        },

        bindEvent: function() {
            var current = lightbox.current,
                keys;

             if (!current) {
                 return ;
             }

            window.off('.lb').on('resize.lb', this.update);

            // Binding Key Board Event
            keys = current.keys;

             if (keys) {
                 document.on('keydown.lb', function(event) {
                     var key = event.which || event.keyCode;

                     $.each(keys, function(name, value) {
                         // test close key
                         if ($.inArray(key, value) > -1 && !lightbox.coming) {
                             lightbox[name]();
                             return false;
                         }
                         // test nav key
                         if (lightbox.group.length > 1 && value[key] !== undefined ) {
                             lightbox[name](value[key]);
                             return false;
                         }
                     });

                     event.preventDefault();
                 });
             }

        },

        update: function() {
            var current = lightbox.current,
                doUpdate = lightbox.doUpdate;

            if (!lightbox.isOpen || doUpdate) {
                return ;
            }

            lightbox.doUpdate = setTimeout(function() {
                if (current && !lightbox.isClosing) {
                    lightbox.trigger('onUpdate');

                    lightbox._setDimension(true);
                    lightbox._setPosition(current.wrap, true);

                    lightbox.doUpdate = null;
                }
            }, 300);
        },

        trigger: function(eventType, obj) {
            var obj = obj || lightbox;

            if (obj) {
                if ($.isFunction(obj[eventType])) {
                    obj[eventType].apply(obj, Array.prototype.slice.call(arguments, 1));
                }

                $.each(obj.helpers, function(index, elem) {
                    if (elem && $.isFunction(elem[eventType])) {
                        elem[eventType].apply(elem, Array.prototype.slice.call(arguments, 1));
                    }
                }); 
            }

            document.trigger(eventType);
        },

        _setDimension: function(isAnimate) {
            var that = this, 
                width,
                height,
                winWidth,
                winHeight,
                minWidth,
                minHeight,
                maxWidth,
                maxHeight,
                innerWidth,
                innerHeight,

                ratio,
                aspectRatioImage;

            ratio = this.current.wrapRatio;
            winWidth = window.width() * ratio;
            winHeight = window.height() * ratio;
            minWidth = this.current.minWidth;
            minHeight = this.current.minHeight;
            maxWidth = this.current.maxWidth;
            maxHeight = this.current.maxHeight;
            width = this.current.width + this.current.padding[1] + this.current.padding[3];
            height = this.current.height + this.current.padding[0] + this.current.padding[2];

            aspectRatioImage = this.current.width * 1.0 / this.current.height;

            maxWidth = Math.min(winWidth, maxWidth);
            maxHeight = Math.min(winHeight, maxHeight);

            if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatioImage;
            }
            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatioImage;
            }
            if (width < minWidth) {
                width = minWidth;
                height = width / aspectRatioImage;
            }
            if (height < minHeight) {
                height = minHeight;
                width = height * aspectRatioImage;
            }

            this.innerWidth = innerWidth = width - this.current.padding[1] - this.current.padding[3];
            this.innerHeight = innerHeight = height - this.current.padding[0] - this.current.padding[2];

            this.width = width;
            this.height = height;

            if (isAnimate) {
                this.inner.animate({
                    width: innerWidth,
                    height: innerHeight,
                });
            } else {
                this.inner.width(innerWidth).height(innerHeight);
            }
            
        },

        _setPosition: function(obj, isAnimate) {
            var pos = this._getPosition();
            if (isAnimate) {
                obj.animate(pos);
            } else {
                obj.css({
                    'top': pos.top,
                    'left': pos.left,
                });
            } 
        },

        _getPosition: function() {
            var pos = {
                    'scrollTop': window.scrollTop(),
                    'scrollLeft': window.scrollLeft(),
                };

            pos.top = (window.height() - lightbox.height) * this.opts.top + pos.scrollTop;
            pos.left = (window.width() - lightbox.width) * this.opts.left + pos.scrollLeft;

            return pos;
        },

        _afterLoadIn: function() {
            lightbox.isOpen = true;
            // load prev, next and close btn.
            var current = lightbox.current;
            lightbox.index = current.index;
            
            if (current.closeBtn) {
                current.closeBtn.off('.btn').on('click.btn', function(event) {
                    event.preventDefault();
                    lightbox.close();
                });
            }
            
            if (current.prevBtn) {
                current.prevBtn.off('.btn').on('click.btn', function(event) {
                    event.preventDefault();
                    lightbox.prev();
                });
            }
            
            if (current.nextBtn) {
                current.nextBtn.off('.btn').on('click.btn', function(event) {
                    event.preventDefault();
                    lightbox.next();
                });
            }

             lightbox.isDisplay = true;
        },

        _afterLoadOut: function() {
            lightbox.isOpen = !lightbox.isClosing;
            lightbox.isClosing = false;

            if (lightbox.isOpen && lightbox.previous) {
                lightbox.previous.wrap.remove();
            } else {
                lightbox.wrap.remove();
                lightbox.helpers.mask.close();
                lightbox.helpers.title.hide();

                // initial lightbox status
                lightbox.mask = null;
                lightbox.doUpdate = null;
                lightbox.current = null;
                lightbox.coming = null;
            }
        },

        close: function() {
            if (this.isOpen && !this.isClosing) {
                this.isClosing = true;
                lightbox.isDisplay = false;
                 this.unbindEvent();
                 this._hideLoading();
                this.trasition[this.opts.closeMethod]();
            }
        }
    });

   /* Lightbox trasition */
   lightbox.trasition = {
       getCenter: function() {

           var pos = {
               w: window.width(),
               h: window.height(),
               y: window.scrollTop(),
               x: window.scrollLeft(),
           }
           return pos;
       },

       fadeIn: function() {
           var startPos = lightbox._getPosition(),
               endPos = $.extend({opacity: 1}, startPos),
               speed = lightbox.isOpen ? lightbox.opts.changeSpeed : lightbox.opts.openSpeed;

           startPos.opacity = 0.1;

           lightbox.wrap.stop(true, true).css(startPos).animate(endPos, {
               duration: speed,
               complete: lightbox._afterLoadIn,
           });
       },

       elasticIn: function() {
           var offsetTopRatio = 0.9,
               offsetLeftRatio = 0.8,
               pos = this.getCenter(),
               endSize = {width: lightbox.innerWidth,
                         height: lightbox.innerHeight,
                         },
               startWidth = lightbox.opts.minWidth,
               startHeight = lightbox.opts.minHeight,

               startSize = {width: startWidth,
                           height: startHeight,
                           },
               endPos = $.extend({opacity: 1}, lightbox._getPosition()),
               startPos = {opacity: 0,
                           top: (pos.h * offsetTopRatio) * lightbox.opts.top + pos.y,
                           left: (pos.w * offsetLeftRatio) * lightbox.opts.left + pos.x},
               speed = lightbox.isOpen ? lightbox.opts.changeSpeed : lightbox.opts.openSpeed;

           lightbox.inner.stop(true, true).css(startSize).animate(endSize,{
               duration: speed,
           });

           lightbox.wrap.stop(true, true).css(startPos).animate(endPos, {
               duration: speed,
               complete: lightbox._afterLoadIn,
           });
       },

       changeIn: function() {
           var field,
               current = lightbox.current,
               direct = lightbox.isOpen ? lightbox.direction : current.openDirect,
               distance = lightbox.opts.openDistance === 'hide' ? 'hide' : 200,
               speed = lightbox.isOpen ? lightbox.opts.changeSpeed : lightbox.opts.openSpeed,
               startPos = lightbox._getPosition(),
               endPos = {opacity: 1};

           field = direct === 'down' || direct === 'up' ? 'top' : 'left';
           startPos.opacity = 0.1;

           if (distance === 'hide') {
               distance = field === 'top' ? startPos.top : startPos.left;
           } else {
               distance = field === 'top' ? Math.min(distance, startPos.top) : Math.min(distance, startPos.left);
           }

           if (direct === 'down' || direct === 'right') {
               startPos[field] = (startPos[field] - distance) + 'px';
               endPos[field] = '+=' + distance + 'px';
           } else {
               startPos[field] = (startPos[field] + distance) + 'px';
               endPos[field] = '-=' + distance + 'px';
           }

           current.wrap.stop(true, true).css(startPos).animate(endPos, {
               duration: speed,
               complete: lightbox._afterLoadIn,
           });
       },

       fadeOut: function() {
           var previous = lightbox.previous,
               target = lightbox.isClosing ? lightbox.wrap : previous.wrap,
               speed = lightbox.isClosing ? lightbox.opts.changeSpeed : lightbox.opts.closeSpeed;

           target.stop(true, true).animate({opacity: 0}, {
               duration: speed,
               complete: lightbox._afterLoadOut,
           });
       },

       elasticOut: function() {
           var offsetTopRatio = 0.9,
                offsetLeftRatio = 0.8,
                previous = lightbox.previous,
               target = lightbox.isClosing ? lightbox.wrap : previous.wrap,
               pos = this.getCenter(),
               speed = lightbox.isClosing ? lightbox.opts.changeSpeed : lightbox.opts.closeSpeed,
               endPos = {
                   opacity: 0,
                   top: (pos.h * offsetTopRatio) * lightbox.opts.top + pos.y,
                    left: (pos.w * offsetLeftRatio) * lightbox.opts.left + pos.x,
               },
               endSize = {
                   width: 0,
                   height: 0,
               };

           target.find('.lightbox-title').fadeOut();
           target.find('.lightbox-inner').stop(true, true).animate(endSize,{
               duration: speed,
           });

           target.stop(true, true).animate(endPos, {
               duration: speed,
               complete: lightbox._afterLoadOut,
           });
       },

       changeOut: function() {
           var field,
               previous = lightbox.previous,
               target = lightbox.isClosing ? lightbox.wrap : previous.wrap, 
               direct = lightbox.isClosing ? lightbox.opts.closeDirect : lightbox.direction,
               distance = lightbox.isClosing ? (lightbox.opts.closeDistance === 'hide' ? 'hide' : 200) : lightbox.opts.distance,
               speed = lightbox.isClosing ? lightbox.opts.changeSpeed : lightbox.opts.closeSpeed,
               
               startPos = lightbox._getPosition(),
               endPos = {opacity: 0.1};

           field = direct === 'down' || direct === 'up' ? 'top' : 'left';

           if (distance === 'hide') {
               distance = field === 'top' ? startPos.top : startPos.left;
           } else {
               distance = field === 'top' ? Math.min(distance, startPos.top) : Math.min(distance, startPos.left);
           }

           if (direct === 'down' || direct === 'right') {
               endPos[field] = '+=' + distance + 'px';
           } else {
               endPos[field] = '-=' + distance + 'px';
           }

           target.stop(true, true).animate(endPos, {
               duration: speed,
               complete: lightbox._afterLoadOut,
           });
       },
   }

    /* Lightbox Mask helper */
    lightbox.helpers.mask = {
        defaults: {
            closeClick: true,
            speed: 200,
            fix: true,
        },
        tpl: '<div class="lightbox-mask" style="width: 100%; height: 100%;"></div>',
        mask: null,
        parent: 'body',

        create: function(opts) {
            opts = opts || {};
            this.opts = $.extend({}, this.defaults, opts);

            if (this.mask) {
                this.close();
            }

            this.mask = $(this.tpl).appendTo(this.parent);

        },
        open: function(opts) {
            var that = this;

            if (!this.mask) {
                this.create(opts);
            }

            this.mask.width(document.width()).height(document.height());

            if (this.opts.closeClick) {
                this.mask.off('.mask').on('click.mask', function(e) {
                    if ($(e.target).hasClass('lightbox-mask')) {
                        if (lightbox.isOpen) {
                            lightbox.close();
                        } else {
                            that.close();
                        }
                    }
                });
            }

            this.mask.fadeIn(that.opts.speed);
        },
        close: function() {
            var that = this;
            if (!lightbox.isClosing) {
                lightbox._hideLoading();
               that.mask.off('.mask').fadeOut(that.opts.speed, function() {
                   that.mask.remove();
                   that.mask = null;
               });
            }
        },
        
        onUpdate: function() {
            if (this.mask) {
                this.update();
            }
        },

        update: function() {
            this.mask.width(document.width()).height(document.height());
        },
    };

    /* Lightbox Title helper */
    lightbox.helpers.title = {
        defaults: {
            position: 'bottom', // title position: top, bottom.
            type: 'over', // title type: inside, over.
            text: 'photo title',
            idxInfo: 'image 0 of 0',
        },
        title: null,
        isExist: false,

        create: function(opts) {
            var that = this,
                current = lightbox.current;
            this.opts = $.extend({}, this.defaults, opts || {});

            if (this.title) {
                this.title.stop(true, true).remove();
            }

            
            // Get the wrap of title helper.
            switch (this.opts.type) {
                case 'inside':
                    this.parent = lightbox.skin;
                    this.title = $('<div class="lightbox-title lightbox-title-' + this.opts.type + '"><p>' + this.opts.text + '</p></div>');
                break;
                case 'over':
                default: 
                    this.parent = lightbox.outer;
                    this.title = $('<div class="lightbox-title lightbox-title-' + this.opts.type + '"><p>' + this.opts.text + '</p>' + '<span>' + this.opts.idxInfo + '</span></div>');
                break;
            }

            this.title[this.opts.position === 'bottom' ? 'appendTo' : 'prependTo'](this.parent);
            this.isExist = true; 			

        },
        show: function(opts) {
            var that = this;
            
            this.beforeShow(opts);

            if (!this.isExist) {
                this.create(opts);
            }

            this.title.fadeIn();

            this.afterShow(opts);

            return this;
        },
        hide: function() {
            var that = this;

            if (this.isExist) {
                this.isExist = false;

                this.title.fadeOut(function() {
                    that.title.remove();
                    that.title = null;
                });
            }

            return this;
        },
        beforeShow: function(opts) {
            $.noop;
        },
        afterShow: function(opts) {
            $.noop;
        }
    };

    $.fn.littleLightBox = function(opts) {
        opts = opts ? opts : {};
        var that = $(this),
            index = 0,
            selector = this.selector || '',
            run = function(e) {
                var what = $(this).blur(), idx = 0;
                var relType = opts.groupType ? opts.groupType : 'data-littlelightbox-group',
                    relValue = what.attr(relType);

                if (!relValue) {
                    relType = 'rel';
                    relValue = what.attr(relType);
                }

                // get all images from group 'relValue'.
                what = selector.length ? $(selector) : that;
                what = what.filter('[' + relType + '=' + relValue + ']');
                
                if (what.length === 0) {
                     what = $(this);
                 }

                 idx = what.index(this);
                opts.index = idx;

                lightbox.open(what, opts);

                e.preventDefault();
            };

        $(selector).off('click').on('click', run);

        return this;
    };

}(window, document, jQuery));