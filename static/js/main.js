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
  //출석체크 QR코드 
  $('#Attend-QR').on('click', function(event) {
      event.preventDefault();
      
      $.ajax({
          url: '/check_admin',
          method: 'GET',
          success: function(response) {
            console.log(response)
            if(response.ADMIN=='Y'){
              alert("출근 체크 활성화 되었습니다.");
              window.location.href = '/attend_qr'
            }
              
          },
          error: function(response) {
              alert("오류입니다.");
          }
      });
  });


  $('#work-sheet').on('click', function(event) {
    event.preventDefault();
    const ddd = document.querySelector('#calendar h2').textContent;
    const date = ddd.split(" ")[0].slice(0,4)+"-"+ddd.split(" ")[1].split("월")[0]+"-01"
    const date2 = ddd.split(" ")[0].slice(0,4)+"_"+ddd.split(" ")[1].split("월")[0]
    $.ajax({
      url: '/work_sheet',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({date:date}),
      success: function(response) {
        console.log(response)
  
          // 동적으로 <a> 태그를 만들어 클릭 이벤트를 트리거 (브라우저에 다운로드)
          const a = document.createElement('a');
          // 실제 파일이 위치한 URL (서버에서 /static/data/개인화폴더/A0001 경로로 서빙된다고 가정)
          a.href = "/static/data/작업일지_"+date+".xlsx"; 
          // 다운로드될 때 파일명
          a.download = "작업일지_"+date2+".xlsx"; 
          a.click();

      },
      error: function(response) {
          alert("오류입니다.");
      }
  });
    
});



$('#group-add').on('click', function(event) {
  event.preventDefault();

  var admin_name = ['김서준','이동성','정병현','김민수'];
  var username = $('input:checkbox.filter:checked').map(function () {
    return $(this).val();
  }).get();



  if(admin_name.includes(username[0])){
  
    $.ajax({
      type: "get",
      url: "/static/data/INSA_DB.json",
      data: {
        // 화면이 바뀌면 Date 객체인 start, end 가 들어옴
        //startDate : moment(start).format('YYYY-MM-DD'),
        //endDate   : moment(end).format('YYYY-MM-DD')
      },
      success: function (response) {
        var modal = $('#groupModal');    // 모달 DOM
       var closeBtn = $('#groupModal .close'); // 닫기 버튼
      
        var USER_LIST = JSON.parse(response)
        console.log(USER_LIST)
        // 사용자 목록을 모달에 채워넣기
        var userList = $('#userList');
        userList.empty(); // 혹시 이전 내용이 있을 수 있으니 초기화

        // 예: response가 [{"name": "김서준"}, {"name": "이동성"}] 같은 구조라고 가정
        USER_LIST.forEach(function (user) {
     
          // 각각 체크박스와 이름을 표시
          var userItem = `
            <div>
              <input type="checkbox" class="memberCheckbox" value="${user.ID}">
              <span>${user.ID}, ${user.성명}</span>
            </div>
          `;
          userList.append(userItem);
        });

        // 데이터 세팅 후 모달 표시
        modal.show();
        closeBtn.on('click', function () {
          modal.hide();
        });

      },
      error: function (err) {
        console.log("에러:", err);
        alert("사용자 목록을 가져오는 중 오류가 발생했습니다.");
      }
        
    
    });


  }
    
  });


  
$('#group-delete').on('click', function(event) {
  event.preventDefault();

  var admin_name = ['김서준','이동성','정병현','김민수'];
  var username = $('input:checkbox.filter:checked').map(function () {
    return $(this).val();
  }).get();



  if(admin_name.includes(username[0])){
  
    $.ajax({
      type: "get",
      url: "/static/data/calendar_group.json",
      data: {
        // 화면이 바뀌면 Date 객체인 start, end 가 들어옴
        //startDate : moment(start).format('YYYY-MM-DD'),
        //endDate   : moment(end).format('YYYY-MM-DD')
      },
      success: function (response) {
      var modal = $('#groupModal2');    // 모달 DOM
       var closeBtn = $('#groupModal2 .close'); // 닫기 버튼
      
        var keys = response
        console.log(keys)
        // 사용자 목록을 모달에 채워넣기
        var groupList = $('#groupList');   
        // 예: response가 [{"name": "김서준"}, {"name": "이동성"}] 같은 구조라고 가정
        keys.forEach(function (user) {
          console.log(user)
          // 각각 체크박스와 이름을 표시
          var userItem = `
            <div>
            
              <input type="checkbox" class="groupCheckbox" value="${user.groupName}">
              <span>${user.groupName}</span>
            </div>
          `;
          groupList.append(userItem);
        });

        // 데이터 세팅 후 모달 표시
        modal.show();
        closeBtn.on('click', function () {
          modal.hide();
        });

      },
      error: function (err) {
        console.log("에러:", err);
        alert("사용자 목록을 가져오는 중 오류가 발생했습니다.");
      }
        
    
    });


  }
    
  });

  // 4) [그룹 생성] 버튼 클릭 시
  $('#deleteGroup').on('click', function () {
    // 입력한 그룹 이름
    var selectedGroups = [];
    $('.groupCheckbox:checked').each(function () {
      selectedGroups.push($(this).val());
    });
    console.log('selectedGroups',selectedGroups)
    if(selectedGroups.length!==0){

    // 1) 기존 calendar_group.json 불러오기
    $.ajax({
      url: "/static/data/calendar_group.json",  // 실제 경로를 맞춰주세요
      type: "GET",
      dataType: "json",
      success: function (calendarData) {
        // calendar_group.json의 데이터가 배열이라고 가정
        // (예: [{ "groupName": "...", "members": [ ... ] }, ... ])
        // 만약 객체 구조라면 거기에 맞춰 처리해야 함.
  
        if (!Array.isArray(calendarData)) {
          console.error("calendar_group.json 데이터가 배열 구조가 아닙니다. 구조 확인 필요!");
          return;
        }
  
        // 2) 새 그룹 데이터 추가

        calendarData = calendarData.filter(function(item) {
          return !selectedGroups.includes(item.groupName);
        });
        console.log(calendarData)
        // 3) 서버에 새로운 배열을 저장 요청
        $.ajax({
          url: "/save_calendar_group",  // 서버에서 이 라우트를 처리해 calendar_group.json을 저장하도록 구성
          type: "POST",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(calendarData), // 문자열로 변환하여 전송
          success: function (response) {
            console.log("calendar_group.json 업데이트 성공:", response);
            alert("그룹이 성공적으로 제거되었습니다!");

            // 모달 닫기
            $('#groupModal2').hide();
            // 폼 초기화
            $('#groupName').val('');
            $('#userList').empty();
            location.reload();
          },
          // },
          error: function (xhr, status, error) {
            console.error("calendar_group.json 업데이트 실패:", error);
            alert("그룹을 저장하는 데 실패했습니다. 다시 시도하세요.");
          }
        });
      },
      error: function (xhr, status, error) {
        console.error("calendar_group.json 불러오기 실패:", error);
        alert("기존 그룹 정보를 불러오는 데 실패했습니다.");
      }
    });
  }
});



  // 4) [그룹 생성] 버튼 클릭 시
  $('#createGroup').on('click', function () {
    // 입력한 그룹 이름
    var groupName = $('#groupName').val().trim();
    // 선택된 멤버
    var selectedMembers = [];
    $('.memberCheckbox:checked').each(function () {
      selectedMembers.push($(this).val());
    });

    if (!groupName) {
      alert("그룹 이름을 입력하세요.");
      return;
    }

    if (selectedMembers.length === 0) {
      alert("최소 한 명 이상의 그룹 멤버를 선택하세요.");
      return;
    }

    // 이 시점에서 필요한 로직 구현
    // 예: 콘솔에 출력 (추후 서버에 전송하거나 로컬 스토리지에 저장하는 등 응용)
    console.log("그룹명:", groupName);
    console.log("선택된 멤버:", selectedMembers);
    // var modal = $('#groupModal');    // 모달 DOM
    // // 모달 닫기
    // modal.hide();

    // alert('그룹이 생성되엇습니다.('+groupName+")" )
    
    // // 폼 초기화 (원하는 경우)
    // $('#groupName').val('');
    // $('#userList').empty();
    var newGroupData = {
      groupName: groupName,
      members: selectedMembers
    };
  
    // 1) 기존 calendar_group.json 불러오기
    $.ajax({
      url: "/static/data/calendar_group.json",  // 실제 경로를 맞춰주세요
      type: "GET",
      dataType: "json",
      success: function (calendarData) {
        // calendar_group.json의 데이터가 배열이라고 가정
        // (예: [{ "groupName": "...", "members": [ ... ] }, ... ])
        // 만약 객체 구조라면 거기에 맞춰 처리해야 함.
  
        if (!Array.isArray(calendarData)) {
          console.error("calendar_group.json 데이터가 배열 구조가 아닙니다. 구조 확인 필요!");
          return;
        }
  
        // 2) 새 그룹 데이터 추가
        calendarData.push(newGroupData);
        console.log(calendarData)
        // 3) 서버에 새로운 배열을 저장 요청
        $.ajax({
          url: "/save_calendar_group",  // 서버에서 이 라우트를 처리해 calendar_group.json을 저장하도록 구성
          type: "POST",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(calendarData), // 문자열로 변환하여 전송
          success: function (response) {
            console.log("calendar_group.json 업데이트 성공:", response);
            alert("그룹이 성공적으로 추가되었습니다!");

            // 모달 닫기
            $('#groupModal').hide();
            // 폼 초기화
            $('#groupName').val('');
            $('#userList').empty();
            location.reload();
          },
          // },
          error: function (xhr, status, error) {
            console.error("calendar_group.json 업데이트 실패:", error);
            alert("그룹을 저장하는 데 실패했습니다. 다시 시도하세요.");
          }
        });
      },
      error: function (xhr, status, error) {
        console.error("calendar_group.json 불러오기 실패:", error);
        alert("기존 그룹 정보를 불러오는 데 실패했습니다.");
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