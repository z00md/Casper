function managePostImages(){
    $('.post-content').find('img').each(function () {
      if (
        !$(this).closest('figure').hasClass('kg-bookmark-card') &&
        !$(this).parent().is('a')
      ) {
        $(this).addClass('js-zoomable')
      }
    })
  }

// Add special class to zoomable images
managePostImages();
// Call medium zoom library on all imgs within post-content
mediumZoom('.js-zoomable', { container: "#medium-zoom-container", background: '#111', scrollOffset: 100 });
// mediumZoom('.post-content .kg-image-card img', { background: '#111' });
// mediumZoom('.post-content .kg-gallery-card img', { background: '#111' });
// mediumZoom('.post-content .kg-gallery-card img', { background: '#111' });

var currentTheme = window.localStorage.getItem("theme");
if (currentTheme) {
  toggleTheme(currentTheme);
}

$(".theme-toggle").on("click", function(evt) {
  var attr = evt.currentTarget.getAttribute("data-theme");
  var result;
  if (attr) {
    result = "light";
  } else {
    result = "dark"
  }
  toggleTheme(result);
  window.localStorage.setItem("theme", result);
});

function toggleTheme(theme) {
  var html = $("html");
  var themeToggleButton = $(".theme-toggle");

  // reset
  $.each(themeToggleButton, function(idx, el){el.removeAttribute("data-theme")});
  html.removeClass("dark");

  // change only in case of dark
  if (theme == "dark") {
    $.each(themeToggleButton, function(idx, el){el.setAttribute("data-theme", "dark")});
    // themeToggleButton.setAttribute("data-theme", "dark");
    html.addClass("dark");
  }
}