/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMedia = window.matchMedia || (function( doc, undefined ) {

  "use strict";

  var bool,
      docElem = doc.documentElement,
      refNode = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement( "body" ),
      div = doc.createElement( "div" );

  div.id = "mq-test-1";
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

    docElem.insertBefore( fakeBody, refNode );
    bool = div.offsetWidth === 42;
    docElem.removeChild( fakeBody );

    return {
      matches: bool,
      media: q
    };

  };

}( document ));

var sliderHomepage, sliderTestimonials, sliderHeader;

var navigation2selected = (function() {
	
	"use strict";

	var select = $('<select>');

	function prefix(number) {
		var str = "";
		for(var i = 0; i < number; i++ ) {
			str += "-";
		}
		if(number > 0)
			str += ' ';
		return str;
	}

	function loopNavigation(node, level) {

		var children = node.children(), link;

		if(children.length > 0) {

			children.each(function() {

				link = $(this).children('a');

				select.append(
					$('<option />').text( prefix(level) + link.text()).data('href', link.attr('href') ).attr('selected', link.hasClass('active'))
				);

				loopNavigation($(this).find('ul').eq(0), level+1);
			});
		}
	}

	function init() {

		// Find links and create options for them
		loopNavigation($('nav ul').eq(0), 0);

		// Append newly created select element
		$('#header nav .mobile .styled-select').append(select);

		// Bind an onchange event to redirect
		select.on('change', function() {
			
			window.location.href = $(this).find(':selected').data('href');
		});
	}

	init();
})();

(function($) {

	"use strict";

$(function() {

	try
	{
		$('.tabs').tabs();
		$('.accordion').accordion();
	}
	catch (e) {}
	
	try {
		sliderHomepage = null,
		sliderTestimonials = $('.testimonials ul').bxSlider({
			nextSelector: '.testimonials .controls .next',
			prevSelector: '.testimonials .controls .prev',
			nextText : '',
			prevText : '',
			pager : false
		}),
		sliderHeader = null;

		var resizeTimeout = null;

		$(window).resize(function() {
			
			// Destory offer slider after resize and recreate it again.
			if(sliderHomepage && sliderHomepage.length > 0) {
				sliderHomepage.destroySlider();
				sliderHomepage = null;
			}

			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function() {

				var isSmartphone = matchMedia('screen and (max-width: 480px)').matches;
				var isTablet = matchMedia('screen and (max-width: 979px)').matches;
				var isDesktop = !(isSmartphone && isTablet);

				var sliderHomepageOptions = {};

				if(isSmartphone || isTablet) {

					$('.slider .slides').css('transform', 'none').find('img').width('100%');
				}

				// Smartphones
				if(isSmartphone) {

					sliderHomepageOptions = {
						minSlides: 1,
						maxSlides: 1,
						slideMargin: 0,
						slideWidth : $(window).width()+10
					};

				// Tablets
				} else if(isTablet) {
					
					var slideMargin = 0,
						slideWidth = $(window).width()/2;

					slideWidth -= parseInt( $('.container').css('padding-left'), 10) * 2;
					slideWidth -= slideMargin / 2;

					sliderHomepageOptions = {
						minSlides: 2,
						maxSlides: 2,
						slideMargin: 18,
						slideWidth : slideWidth
					};

				// Desktop
				} else {
					
					sliderHomepageOptions = {
						minSlides: 4,
						maxSlides: 4,
						slideWidth : 225,
						slideMargin: 18
					};
				}
			
				sliderHomepage = $('.offers.slide .items').bxSlider(sliderHomepageOptions);
				
			}, 500);

		}).trigger('resize');

		// Prevents homepage from blinking
		$('.home .slider .slides').children().addClass('show');

		sliderHeader = $('.home .slider .slides').bxSlider({
			nextSelector: '.slider .controls .next',
			prevSelector: '.slider .controls .prev',
			nextText : '',
			prevText : '',
			captions: true,
			pager : false,
			responsive : true
		});
		
	} catch (e) {}

	try
	{
		google.maps.event.addDomListener(window, 'load', function() {

			var propertiesMap = new PropertiesMap('properties-map');
			propertiesMap.add(propertiesList);
		});
	}
	catch (e) {}

	try {

		// Calling prettyphoto lightbox gallery
		$("a[rel^='prettyPhoto']").prettyPhoto();
	} catch(e) {}

	try {

		var gallery = $('#images');
		gallery.exposure({
			controlsTarget : '#controls',
			imageControls : true,
			controls : { prevNext : true, pageNumbers : true, firstLast : false },
			pageSize : parseInt( $('#images').width()/90, 10),
			slideshowControlsTarget : '#slideshow',
			onThumb : function(thumb) {
				var li = thumb.parents('li');				
				var fadeTo = li.hasClass($.exposure.activeThumbClass) ? 1 : 0.3;
				
				thumb.css({display : 'none', opacity : fadeTo}).stop().fadeIn(200);
				
				thumb.hover(function() { 
					thumb.fadeTo('fast',1); 
				}, function() { 
					li.not('.' + $.exposure.activeThumbClass).children('img').fadeTo('fast', 0.5); 
				});
			},
			onImageHoverOver : function() {
				if (gallery.imageHasData()) {						
					// Show image data as an overlay when image is hovered.
					gallery.dataElement.stop().show().animate({bottom:0+'px'},{queue:false,duration:160});
				}
			},
			onImageHoverOut : function() {
				// Slide down the image data.
				var imageDataBottom = -gallery.dataElement.outerHeight();
				gallery.dataElement.stop().show().animate({bottom:imageDataBottom+'px'},{queue:false,duration:160});
			},
			onImage : function(image, imageData, thumb) {
				var w = gallery.wrapper;
				
				// Fade out the previous image.
				image.siblings('.' + $.exposure.lastImageClass).stop().fadeOut(500, function() {
					$(this).remove();
				});
				
				// Fade in the current image.
				image.hide().stop().fadeIn(1000);
				
				// Setup hovering for the image data container.
				imageData.hover(function() {
					// Trigger mouse enter event for wrapper element.
					w.trigger('mouseenter');
				}, function() {
					// Trigger mouse leave event for wrapper element.
					w.trigger('mouseleave');
				});
				
				// Check if wrapper is hovered.
				var hovered = w.hasClass($.exposure.imageHoverClass);						
				if (hovered) {
					if (gallery.imageHasData()) {
						gallery.onImageHoverOver();
					} else {
						gallery.onImageHoverOut();
					}	
				}

				if (gallery.showThumbs && thumb && thumb.length) {
					thumb.parents('li').siblings().children('img.' + $.exposure.selectedImageClass).stop().fadeTo(200, 0.5, function() { $(this).removeClass($.exposure.selectedImageClass); });			
					thumb.fadeTo('fast', 1).addClass($.exposure.selectedImageClass);
				}
			}
		});

		$('#right a').click(function() {
			gallery.nextImage();
		});

		$('#left a').click(function() {
			gallery.prevImage();
		});
	} catch(e) {}
	
	/* Safari needs a little boost to display the dropdown controls differently. If user has no JS, the standard Safari controls will be shown. */
	try
	{
		var isSafari = /Constructor/.test(window.HTMLElement);

		if(isSafari) {

			$('html').addClass('safari');
		}
	}
	catch (e)
	{}
});

})(jQuery);

// 10x to Jens (http://stackoverflow.com/questions/3974827/detecting-touch-screen-devices-with-javascript)
function isTouchDevice(){
    return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
}

var PropertiesMap = function(containerID) {

	var map = null;

	var bounds = null;
	
	var self = this;

	var infowindow = null;

	this.addMarker = function(markerOptions) {
		
		var latLng = new google.maps.LatLng(markerOptions.lat, markerOptions.lng);
		
		var marker = new google.maps.Marker({
			position: latLng,
			map: this.map,
			icon : '../assets/core/img/marker.png'
		});

		if( infowindow != null ) {
			infowindow.close();
		}

		infowindow = new google.maps.InfoWindow({
			content : 
				'<div class="infowindow">' 
					+ '<div class="address">' + markerOptions.address + '</div>' 
					+ (markerOptions.url ? '<div class="details-url"><a href="' + markerOptions.url + '">View details</a></div>' : '')
				+ '</div>'
		});

		google.maps.event.addListener(marker, 'click', function() {
			
			infowindow.open(self.map, marker);
		});

		this.bounds.extend(latLng);

		this.map.fitBounds(this.bounds);
	}

	this.add = function(list) {

		for(var i = 0, n = list.length; i < n; i += 1) {

			this.addMarker(list[i]);
		}
	}

	this.initialize = function() {

		var mapOptions = {
			zoom: 12,
			center: new google.maps.LatLng(0, 0),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		this.map = new google.maps.Map(document.getElementById(containerID), mapOptions);

		this.bounds = new google.maps.LatLngBounds();
	}

	this.initialize();
}