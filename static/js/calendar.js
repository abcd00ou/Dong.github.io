/**
* Template Name: Day
* Template URL: https://bootstrapmade.com/day-multipurpose-html-template-for-free/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
var draggedEventIsAllDay;
var activeInactiveWeekends = true;

var calendar = $('#calendar').fullCalendar({

 /** ******************
   *  OPTIONS
   * *******************/
  locale                    : 'ko',    
  timezone                  : "local", 
  nextDayThreshold          : "09:00:00",
  allDaySlot                : true,
  displayEventTime          : true,
  displayEventEnd           : true,
  firstDay                  : 0, //월요일이 먼저 오게 하려면 1
  weekNumbers               : false,
  selectable                : true,
  weekNumberCalculation     : "ISO",
  eventLimit                : true,
  views                     : { 
                                month : { eventLimit : 12 } // 한 날짜에 최대 이벤트 12개, 나머지는 + 처리됨
                              },
  eventLimitClick           : 'week', //popover
  navLinks                  : true,
  defaultDate               : moment().format('YYYY-MM-DD'), //실제 사용시 현재 날짜로 수정
  timeFormat                : 'HH:mm',
  defaultTimedEventDuration : '01:00:00',
  editable                  : false, //drag 안되게 하기 
  minTime                   : '00:00:00',
  maxTime                   : '24:00:00',
  slotLabelFormat           : 'HH:mm',
  weekends                  : true,
  nowIndicator              : true,
  dayPopoverFormat          : 'MM/DD dddd',
  longPressDelay            : 0,
  eventLongPressDelay       : 0,
  selectLongPressDelay      : 0,  
  header                    : {
                                left   : 'prevYear, prev, next, nextYear, today',
                                center : ' title',
                                right  : 'month, agendaWeek, agendaDay, listWeek'
                              },
  views                     : {
                                month : {
                                  columnFormat : 'dddd'
                                },
                                agendaWeek : {
                                  columnFormat : 'M/D ddd',
                                  titleFormat  : 'YYYY년 M월 D일',
                                  eventLimit   : false
                                },
                                agendaDay : {
                                  columnFormat : 'dddd',
                                  eventLimit   : false
                                },
                                listWeek : {
                                  columnFormat : ''
                                }
                              },
  customButtons             : { //주말 숨기기 & 보이기 버튼
                                viewWeekends : {
                                  text  : '주말',
                                  click : function () {
                                    activeInactiveWeekends ? activeInactiveWeekends = false : activeInactiveWeekends = true;
                                    $('#calendar').fullCalendar('option', { 
                                      weekends: activeInactiveWeekends
                                    });
                                  }
                                }
                               },
  columnHeaderFormat        : 'ddd',


  eventRender: function (event, element, view) {
    console.log(event)
    //일정에 hover시 요약
    element.popover({
      title: $('<div />', {
        class: 'popoverTitleCalendar',
        text: event.title
      }).css({
        'background': event.backgroundColor,
        'color': event.textColor,
        'font-size':'1px',
        'z-index':'99'
      }),
      content: $('<div />', {
          class: 'popoverInfoCalendar'
        }).append('<p><strong>등록자:</strong> ' + event.username + '</p>')
        .append('<p><strong>구분:</strong> ' + event.type + '</p>')
        .append('<p><strong>시간:</strong> ' + getDisplayEventDate(event) + '</p>')
        .append('<div class="popoverDescCalendar"><strong>설명:</strong> ' + event.description + '</div>'),
      delay: {
        show: "700",
        hide: "50"
      },
      trigger: 'hover',
      placement: 'top',
      html: true,
      container: 'body'
    });

    return filtering(event);

  },

  /* ****************
   *  일정 받아옴 
   * ************** */
  events: function (start, end, timezone, callback) {
    $.ajax({
      type: "get",
      url: "/static/data/calendar.json",
      data: {
        // 화면이 바뀌면 Date 객체인 start, end 가 들어옴
        //startDate : moment(start).format('YYYY-MM-DD'),
        //endDate   : moment(end).format('YYYY-MM-DD')
      },
      success: function (response) {
        var fixedDate = response.map(function (array) {
          if (array.allDay && array.start !== array.end) {
            array.end = moment(array.end).add(1, 'days'); // 이틀 이상 AllDay 일정인 경우 달력에 표기시 하루를 더해야 정상출력
          }
          return array;
        });
        console.log("fixedDate",fixedDate)
        callback(fixedDate);
      }
    });
  },

  eventAfterAllRender: function (view) {
    if (view.name == "month") $(".fc-content").css('height', 'auto');
  },

  //일정 리사이즈
  eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
    $('.popover.fade.top').remove();

    /** 리사이즈시 수정된 날짜반영
     * 하루를 빼야 정상적으로 반영됨. */
    var newDates = calDateWhenResize(event);

    //리사이즈한 일정 업데이트
    $.ajax({
      type: "get",
      url: "",
      data: {
        //id: event._id,
        //....
      },
      success: function (response) {
        alert('수정: ' + newDates.startDate + ' ~ ' + newDates.endDate);
      }
    });

  },

  // eventDragStart: function (event, jsEvent, ui, view) {
  //   draggedEventIsAllDay = event.allDay;
  // },

  //일정 드래그앤드롭
  // eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
  //   $('.popover.fade.top').remove();

  //   //주,일 view일때 종일 <-> 시간 변경불가
  //   if (view.type === 'agendaWeek' || view.type === 'agendaDay') {
  //     if (draggedEventIsAllDay !== event.allDay) {
  //       alert('드래그앤드롭으로 종일<->시간 변경은 불가합니다.');
  //       location.reload();
  //       return false;
  //     }
  //   }

    // 드랍시 수정된 날짜반영
    // var newDates = calDateWhenDragnDrop(event);

    //드롭한 일정 업데이트
    // $.ajax({
    //   type: "get",
    //   url: "",
    //   data: {
    //     //...
    //   },
    //   success: function (response) {

    //     alert('수정: ' + newDates.startDate + ' ~ ' + newDates.endDate);
    //   }
    // });

  // },

  select: function (startDate, endDate, jsEvent, view) {

    // $(".fc-body").unbind('click');
    $(".fc-body").on('click', 'td', function (e) {
      console.log('eeee',e)
      console.log( e.pageX, e.pageY)
      // contextMenu 조작 금지 
      $("#contextMenu")
        .addClass("contextOpened")
        .css({
          display: "block",
          left: e.pageX,
          top: e.pageY
        });
      return false;
    });

    var today = moment();

    if (view.name == "month") {
      startDate.set({
        hours: today.hours(),
        minute: today.minutes()
      });
      startDate = moment(startDate).format('YYYY-MM-DD 00:00');
      endDate = moment(endDate).subtract(1, 'days');

      endDate.set({
        hours: today.hours() + 1,
        minute: today.minutes()
      });
      endDate = moment(endDate).format('YYYY-MM-DD 24:00');
    } else {
      startDate = moment(startDate).format('YYYY-MM-DD 00:00');
      endDate = moment(endDate).format('YYYY-MM-DD 24:00');
    }

    //날짜 클릭시 카테고리 선택메뉴
    var $contextMenu = $("#contextMenu");
    $contextMenu.on("click", "a", function (e) {
      //e.preventDefault();
      console.log(startDate)
      console.log($(this))
      console.log($(this).data())
      const groupButtons = document.querySelectorAll('#group_list button[id^="group-"]');

      // 각각의 버튼에 대해 "group-" 뒷부분만 추출
   
      const fullId = groupButtons[0].id;          // 예: "group-마곡"
      const siteValue = fullId.replace("group-", ""); 
      console.log('siteValue',siteValue);            // "마곡", "부산", "서울", ...
      //const siteValue = document.getElementById('site').value;
      //const dateValue = document.getElementById('date').value;

      // URL 파라미터로 site, date 값을 survey.html에 전달
      // encodeURIComponent로 특수문자 등을 인코딩해주면 안전합니다.
      window.location.href = `survey-plan?site=${encodeURIComponent(siteValue)}&date=${encodeURIComponent(startDate)}`;
      
      //닫기 버튼이 아닐때
      // if ($(this).data().role !== 'close') {
      //   newEvent(startDate, endDate, $(this).html());
      // }

      $contextMenu.removeClass("contextOpened");
      $contextMenu.hide();
    });

    $('body').on('click', function () {
      $contextMenu.removeClass("contextOpened");
      $contextMenu.hide();
    });

  },

  //이벤트 클릭시 수정이벤트
  eventClick: function (event, jsEvent, view) {
    console.log("event 왜안돼",event)
    // alert('Event: ' + event.title);
    // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
    // alert('View: ' + view.name);

    // change the border color just for fun
    $(this).css('border-color', 'red');
    editEvent(event);
    console.log("You clicked at:", jsEvent.pageX, jsEvent.pageY);
    // 클릭된 이벤트 정보 출력
    console.log("Event clicked:", event);
  }

});



function getDisplayEventDate(event) {

  var displayEventDate;
  
  if (event.allDay == false) {
    var startTimeEventInfo = moment(event.start).format('HH:mm');
    var endTimeEventInfo = moment(event.end).format('HH:mm');
    displayEventDate = startTimeEventInfo + " - " + endTimeEventInfo;
  } else {
    displayEventDate = "하루종일";
  }

  return displayEventDate;
}



function filtering(event) {
  var show_username = true;
  var show_type = true;
  var admin_name = ['김서준','이동성','정병현'];
  var username = $('input:checkbox.filter:checked').map(function () {
    return $(this).val();
  }).get();
  console.log(username)

  if($('#text_filter').val()!==""&&$('#text_filter').val()!==undefined){
    var texts = [$('#text_filter').val()];
  }else{
    var texts=[];
  }

  var activeGroupButtons = $("button[id^='group-'].active");
  // 2) 해당 버튼(들)의 텍스트를 가져오기
  //    만약 복수 개가 있을 수 있다면, each() 혹은 map() 사용
  var buttonText = ''
  if(activeGroupButtons.length>0){
    activeGroupButtons.each(function() {
      buttonText = $(this).text();
      console.log("활성 버튼의 텍스트:", buttonText);

      // 원하는 필터링 로직 수행
      // filteringByGroup(buttonText); // 예시 함수
  });
  }else{
    buttonText = ''
  }
  console.log('buttonText',buttonText)
  
  

  if (texts && texts.length > 0) {

    // if(event.type.includes(texts[0])){
    //   show_type = true
    // }else 
    if(event.description.includes(texts[0])){
      show_type = true
    }else if(event.title.includes(texts[0])){
      show_type = true
    }else if(event.username.includes(texts[0])){
      show_type = true
    }else{
      show_type=false
    }
   
    
  }
  console.log('buttonText',buttonText)
  if(buttonText){
    console.log("여기 안옴?")
    if(event.type.includes(buttonText)){
      show_type = true
    }else{
      
      show_type=false
    }
  }
  console.log(show_username,show_type)
  // if(admin_name.includes(username[0])){

  //   show_username = true;
  // }else{
  //   show_username = username.indexOf(event.username) >= 0;
  // }
  // console.log(show_username,show_type)
  return show_username && show_type;
}

function calDateWhenResize(event) {

  var newDates = {
    startDate: '',
    endDate: ''
  };

  if (event.allDay) {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
    newDates.endDate = moment(event.end._d).subtract(1, 'days').format('YYYY-MM-DD');
  } else {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD HH:mm');
    newDates.endDate = moment(event.end._d).format('YYYY-MM-DD HH:mm');
  }

  return newDates;
}

// function calDateWhenDragnDrop(event) {
//   // 드랍시 수정된 날짜반영
//   var newDates = {
//     startDate: '',
//     endDate: ''
//   }

//   // 날짜 & 시간이 모두 같은 경우
//   if(!event.end) {
//     event.end = event.start;
//   }

//   //하루짜리 all day
//   if (event.allDay && event.end === event.start) {
//     console.log('1111')
//     newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
//     newDates.endDate = newDates.startDate;
//   }

//   //2일이상 all day
//   else if (event.allDay && event.end !== null) {
//     newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
//     newDates.endDate = moment(event.end._d).subtract(1, 'days').format('YYYY-MM-DD');
//   }

//   //all day가 아님
//   else if (!event.allDay) {
//     newDates.startDate = moment(event.start._d).format('YYYY-MM-DD HH:mm');
//     newDates.endDate = moment(event.end._d).format('YYYY-MM-DD HH:mm');
//   }

//   return newDates;
// }