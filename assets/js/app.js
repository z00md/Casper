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
