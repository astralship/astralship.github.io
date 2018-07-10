/*
	Spectral by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel
		.breakpoints({
			xlarge:	'(max-width: 1680px)',
			large:	'(max-width: 1280px)',
			medium:	'(max-width: 980px)',
			small:	'(max-width: 736px)',
			xsmall:	'(max-width: 480px)'
		});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#page-wrapper'),
			$banner = $('#banner'),
			$header = $('#header');
			
		/* THis was causing a mess so Liam removed it
		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});*/

		// Mobile?
			if (skel.vars.mobile)
				$body.addClass('is-mobile');
			else
				skel
					.on('-medium !medium', function() {
						$body.removeClass('is-mobile');
					})
					.on('+medium', function() {
						$body.addClass('is-mobile');
					});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly')
				.scrolly({
					speed: 1500,
					offset: $header.outerHeight()
				});

		// Menu.
			$('#menu')
				.append('<a href="#menu" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-menu-visible'
				});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
					bottom:		$header.outerHeight() + 1,
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			}

			var createGlobalFunction = function(name, $obj) {
				window[name] = function() {
					var options = JSON.parse( $obj.attr("data-slide") ); // data() is not optimal (too smart)

					var currentIndex = parseInt($obj.attr("data-index"));
					
					
					var newText = options[currentIndex];
					if(currentIndex!=options.length - 1) {
						currentIndex++;
					} else{
						currentIndex=0;
					}
					$obj.attr("data-index",currentIndex);

					if ($obj.is(":visible")) {
						$obj.fadeOut(800, function() {
							$obj.text(newText);
							$obj.fadeIn(800);
							setTimeout(window[name], 1700 + (Math.random() * 1500));
						});
					} else { // not visible (initial load) - different order of things
						$obj.text(newText);
						$obj.fadeIn(800);
						setTimeout(window[name], 1700 + (Math.random() * 1500));
					};
					
				};
			}

			$("[data-slide]").each(function(idx, obj) { 
				var name = "slide" + idx;
				createGlobalFunction(name, $(obj));
				window[name]();
			});

			// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

			$('.streetView-wrapper').click(function () {
			    $('.streetView-wrapper iframe').css("pointer-events", "auto");
			});

			$( ".streetView-wrapper" ).mouseleave(function() {
			  $('.streetView-wrapper iframe').css("pointer-events", "none"); 
			});


			// if (document.location.search.indexOf("?menu") !== -1) {
			// 	localStorage.menu = true;
			// }
			// if (localStorage.menu) {
			// 	$("#nav").css("display", "block");
			// }

			if (document.referrer.indexOf("astralship") === -1) {
				$(".deep-link-outside-show").show();
			}
			

	});

})(jQuery);
