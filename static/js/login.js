/**
* Template Name: Day
* Template URL: https://bootstrapmade.com/day-multipurpose-html-template-for-free/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  
    $('#signin').on('submit', function(event) {
      event.preventDefault();
      var username = $('#identify').val();
      var password = $('#password').val();

      $.ajax({
          url: '/signin',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({username: username, password: password}),
          success: function(response) {
              alert(response.message);
          },
          error: function(response) {
              alert(response.responseJSON.message);
          }
      });
  });

  $('#register').on('submit', function(event) {
      event.preventDefault();
      var username = $('#loginUsername').val();
      var password = $('#loginPassword').val();

      $.ajax({
          url: '/register',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({username: username, password: password}),
          success: function(response) {
              alert(response.message);
          },
          error: function(response) {
              alert(response.responseJSON.message);
          }
      });
  });
  


})();