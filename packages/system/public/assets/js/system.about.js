/* global Swipe */
$(function() {
  var idScroll = function(id) {
    var $el = $('#' + id)
    if ($el.length) {
      $(document.body).add(document.documentElement)
        .animate({ scrollTop: $el.offset().top })
    }
  }

  $('a[href^=#]').click(function(e) {
    var id = $(this).attr('href').slice(1)
    if (id) {
      e.preventDefault()
      idScroll(id)
    }
  })

  $('.artwork-wrap').addClass('ready')

  var $bullets = $('.quote-dot-link')
  var currentClass = 'current'
  var slider = new Swipe($('#slider')[0], {
    auto: 8000,
    speed: 600,
    continuous: true,
    callback: function(i) {
      $bullets.removeClass(currentClass).eq(i).addClass(currentClass)
    }
  })

  $bullets.click(function(e) {
    e.preventDefault()
    slider.slide($(this).index())
  })

  $('.quote-nav-link.prev').click(function(e) {
    e.preventDefault()
    slider.prev()
  })

  $('.quote-nav-link.next').click(function(e) {
    e.preventDefault()
    slider.next()
  })

  var videoBgSrcList = [
    '/static/img/careers/video-bg1.jpg',
    '/static/img/careers/video-bg2.jpg',
    '/static/img/careers/video-bg3.jpg',
    '/static/img/careers/video-bg4.jpg'
  ]

  var $videoSection = $('.video-section')
  var $videoModal = $videoSection.find('.video-modal')
  var video = $videoModal.find('video')[0]
  var videoBgRatio = 820 / 1920

  $videoSection.click(function() {
    $videoModal.show()
    $('body').addClass('video-modal-show')
    video.play()
  })

  var updateVideoBgHeight = function() {
    $videoSection.height(Math.floor($videoSection.width() * videoBgRatio))
  }

  $(document).ready(function() {
    var random = Math.floor(Math.random() * 4)
    var src = videoBgSrcList[random]
    $videoSection.css('background', 'url(' + src + ')')
    $videoSection.css('background-size', '100% auto')
    var image = new Image()
    image.src = src
    image.onload = function() {
      videoBgRatio = image.height / image.width
      updateVideoBgHeight()
    }
  })

  $(window).resize(function() {
    updateVideoBgHeight()
  })

  $('.video-modal-close').click(function() {
    $videoModal.hide()
    $('body').removeClass('video-modal-show')
    video.pause()
    video.currentTime = 0
    return false
  })
})
