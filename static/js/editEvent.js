/* ****************
 *  일정 편집
 * ************** */
var editEvent = function (event, element, view) {
    console.log("시작 되긴함?")
    $('#deleteEvent').data('id', event._id); //클릭한 이벤트 ID

    $('.popover.fade.top').remove();
    $(element).popover("hide");

    if (event.allDay === true) {
        editAllDay.prop('checked', true);
    } else {
        editAllDay.prop('checked', false);
    }

    if (event.end === null) {
        event.end = event.start;
    }

    if (event.allDay === true && event.end !== event.start) {
        editEnd.val(moment(event.end).subtract(1, 'days').format('YYYY-MM-DD HH:mm'))
    } else {
        editEnd.val(event.end.format('YYYY-MM-DD HH:mm'));
    }

    modalTitle.html('일정 수정');
    editTitle.val(event.title);
    editStart.val(event.start.format('YYYY-MM-DD HH:mm'));
    editType.val(event.type);
    editDesc.val(event.description);
    editColor.val(event.backgroundColor).css('color', event.backgroundColor);

    addBtnContainer.hide();
    modifyBtnContainer.show();
    console.log(eventModal)

    eventModal.removeClass('fade').modal('show');

    //업데이트 버튼 클릭시
    $('#updateEvent').unbind();
    $('#updateEvent').on('click', function () {

        if (editStart.val() > editEnd.val()) {
            alert('끝나는 날짜가 앞설 수 없습니다.');
            return false;
        }

        if (editTitle.val() === '') {
            alert('일정명은 필수입니다.')
            return false;
        }

        var statusAllDay;
        var startDate;
        var endDate;
        var displayDate;

        if (editAllDay.is(':checked')) {
            statusAllDay = true;
            startDate = moment(editStart.val()).format('YYYY-MM-DD');
            endDate = moment(editEnd.val()).format('YYYY-MM-DD');
            displayDate = moment(editEnd.val()).add(1, 'days').format('YYYY-MM-DD');
        } else {
            statusAllDay = false;
            startDate = editStart.val();
            endDate = editEnd.val();
            displayDate = endDate;
        }

        eventModal.modal('hide');

        event.allDay = statusAllDay;
        event.title = editTitle.val();
        event.start = startDate;
        event.end = displayDate;
        event.type = editType.val();
        event.backgroundColor = editColor.val();
        event.description = editDesc.val();

        $("#calendar").fullCalendar('updateEvent', event);

        //일정 업데이트
        $.ajax({
            type: "get",
            url: "/static/data/calendar.json",
            data: {
                //...
            },
            success: function (response) {

                delete event['source'];
                delete event['className']
                console.log(event)
                var data = response
                for(let i = 0; i < data.length; i++) {
                    console.log(data[i]._id,event._id)
                
                    if (Number(data[i]._id) === Number(event._id)) {
                        console.log(data[i])
                        data[i] = event;
                    }
                }
                console.log('data',data)
                json_data =JSON.stringify(data)
                $.ajax({
                    url: '/calendar_edit', // 데이터를 저장할 서버의 URL
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({data:json_data}),
                    success: function(response) {
                        alert('Data Edited successfully:', response);
                        eventModal.addClass('fade');
                    },
                    error: function(error) {
                        alert('Error Edited data:', error);
                    }
                });


              
            }
        });

    });
};

// 삭제버튼
$('#deleteEvent').on('click', function () {
    
    $('#deleteEvent').unbind();
    $("#calendar").fullCalendar('removeEvents', $(this).data('id'));
    eventModal.addClass("fade")
    eventModal.modal('hide');
    var this_id = $(this).data('id');
    //삭제시
    $.ajax({
        type: "get",
        url: "/static/data/calendar.json",
        data: {
            //...
        },
        success: function (response) {
            var data = response
            console.log(data)
            for(let i = 0; i < data.length; i++) {
                console.log(data[i]._id,this_id)
            
                if (data[i]._id === Number(this_id)) {
                    console.log("여기")
                    data = data.filter(item => item._id !== Number(this_id));
                }else if(data[i]._id === this_id){
                    data = data.filter(item => item._id !== this_id);
                }

              
            }
            console.log(data)
            json_data =JSON.stringify(data)
            $.ajax({
                url: '/calendar_remove', // 데이터를 저장할 서버의 URL
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({data:json_data}),
                success: function(response) {
                    alert('데이터를 정상적으로 삭제하였습니다.:', response);
                    location.reload();  // 성공 후 페이지 새로고침
                },
                error: function(error) {
                    alert('에러 : 데이터 삭제 실패:', error);
                }
            });
           
        }
    });

});