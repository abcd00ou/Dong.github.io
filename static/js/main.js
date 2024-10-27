/**
* Template Name: Day
* Template URL: https://bootstrapmade.com/day-multipurpose-html-template-for-free/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // 로그인 로그아웃 기능 추가 
  $('#signin').on('submit', function(event) {
      event.preventDefault();
      var id = $('#identify').val();
      var pw = $('#password').val();

      $.ajax({
          url: '/signin',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({id: id, pw: pw}),
          success: function(response) {
              
              if(response.sign_data=='False'){
                $('#warn-info').removeClass('fade').modal('show');
             
              }else{
                alert("로그인 되었습니다. ");
                window.location.href = 'calendar'
              }
             
          },
          error: function(response) {
              alert("로그인 정보를 확인해주세요.");
          }
      });
  });

  // $('#register').on('submit', function(event) {
  //     event.preventDefault();
  //     //회원가입을 위한 정보 제공 
  
  //     var user_id = $('#identify').val();
  //     var user_pw = $('#password').val();
  //     var user_name = $('#name').val();
  //     var user_contact = $('#contact').val();
  //     var user_nationality = $('#nationality').val();
  //     var user_credential = $('#credential').val();
  //     var user_visa = $('#visa').val();
  //     var user_address = $('#address').val();
  //     var user_certificate = $('#certificate').val();
  //     var user_highBlood = $('#highBlood').val();
  //     var radio_nationality = document.querySelector('input[name="radioNationality"]:checked');


  //     $.ajax({
  //         url: '/register',
  //         method: 'POST',
  //         contentType: 'application/json',
  //         data: JSON.stringify({user_id: user_id, user_pw: user_pw,user_name:user_name,
  //           user_contact:user_contact,user_nationality:user_nationality,user_credential:user_credential,
  //           user_visa:user_visa,user_address:user_address,user_certificate:user_certificate ,user_highBlood:user_highBlood,radio_nationality:radio_nationality    
  //         }),
  //         success: function(response) {
  //             alert('회원가입이 완료되었습니다.\n 로그인 화면으로 돌아갑니다. ');
  //             window.location.href = 'backoffice'
  //         },
  //         error: function(response) {
  //             alert(response.responseJSON.message);
  //         }
  //     });
  // });

  // 로그아웃 기능 
  $('#nav_logout').on('click',function(){

    console.log("anjadfvfd")
    $('#logoutModal').removeClass('fade').modal('show');
   });
    
  $('#logoutevent').on('click', function () {
    console.log("맞나???")
      $.ajax({
      url: '/logout',
      method: 'POST',
      contentType: 'application/json',
      success: function(response) {
          alert("로그아웃 되었습니다.");
          window.location.href = 'main'

      },
      error: function(response) {
          alert("서버오류입니다.");
      }
  });

  });

  // 출석체크 활성, 비활성화
  $('#Attend-abled').on('click', function(event) {
      event.preventDefault();
      
      $.ajax({
          url: '/attend-abled',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({'Attend': 'abled'}),
          success: function(response) {
              alert("출근 체크 활성화 되었습니다. ");
              window.location.reload();
          },
          error: function(response) {
              alert("오류입니다.");
          }
      });
  });

  $('#Attend-disabled').on('click', function(event) {
    event.preventDefault();
    
    $.ajax({
        url: '/attend-disabled',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'Attend': 'disabled'}),
        success: function(response) {
            alert("출근 체크 비활성화 되었습니다. ");
            window.location.reload();
        },
        error: function(response) {
            alert("오류입니다.");
        }
    });
  });


  $('#Attendcheck').on('click', function(event) {
    event.preventDefault();
    
    $.ajax({
        url: '/attend-check',
        method: 'POST',
        contentType: 'application/json',
        success: function(response) {
            alert("출근 확인 되었습니다.");
            window.location.reload();
        },
        error: function(response) {
            alert("오류입니다.");
        }
    });
  });


  $('#Leave-abled').on('click', function(event) {
    event.preventDefault();
    
    $.ajax({
        url: '/leave-abled',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'Leave': 'abled'}),
        success: function(response) {
            alert("퇴근 체크 활성화 되었습니다. ");
            window.location.reload();
        },
        error: function(response) {
            alert("오류입니다.");
        }
    });
});

$('#Leave-disabled').on('click', function(event) {
  event.preventDefault();
  
  $.ajax({
      url: '/leave-disabled',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({'Leave': 'disabled'}),
      success: function(response) {
          alert("퇴근 체크 비활성화 되었습니다. ");
          window.location.reload();
      },
      error: function(response) {
          alert("오류입니다.");
      }
  });
});


$('#Leavecheck').on('click', function(event) {
  event.preventDefault();
  
  $.ajax({
      url: '/leave-check',
      method: 'POST',
      contentType: 'application/json',
      success: function(response) {
          alert("퇴근 확인 되었습니다.");
          window.location.reload();
      },
      error: function(response) {
          alert("오류입니다.");
      }
  });
});




})();