$(document).ready(function() {
  function checkStatus() {
    $.ajax({
      url: "http://localhost:4017/",
      dataType: 'json',
      success : function (response) {
          if (response.status == "SERVER_READY") {
              $('#status').text('Connected').removeClass('closed').addClass('open');
          }else {
              $('#status').text('Connection failed').removeClass('open').addClass('closed');
          }
      },
      error: function(jqXhr, textStatus, errorThrown){
          $('#status').text('Connection failed').removeClass('open').addClass('closed');
      }
    });
  };
  checkStatus();
  function parseCmd(cmd) {
    if (cmd.indexOf(":")>-1) {
      var $command = cmd.substr(0, cmd.indexOf(":"));
      var $postdata = cmd.substr(cmd.indexOf(":")+1);
      if ($command == 'store') {
        $('#messages').append('<li class="sent"><span>Sent:</span>' + $command +'</li>');
        $.ajax({
          url: 'http://localhost:4017/'+$command,
          dataType: 'json',
          type: 'POST',
          data: {'rdata':$postdata},
          success: function(data, textStatus, jQxhr){
              $('#messages').append('<li class="received"><span>Received:</span>Data stored in ' + data.quid + '</li>');
              $("#messages").scrollTop($("#messages")[0].scrollHeight);
          },
          error: function(jqXhr, textStatus, errorThrown){
              console.log(errorThrown);
              if (errorThrown == 'Not Found') {
                try {
                  var res = JSON.parse(jqXhr.responseText);
                  $('#messages').append('<li class="received"><span>Received:</span>' + res.description + '</li>');
                  $("#messages").scrollTop($("#messages")[0].scrollHeight);
                } catch(e) {
                  console.log(e);
                }
              }
          }
        });
      } else if ($command == 'quid') {
        $('#messages').append('<li class="sent"><span>Sent:</span>Retrieve data from key '+$postdata+'</li>');
        $.ajax({
          url: 'http://localhost:4017/'+$postdata,
          dataType: 'json',
          success: function(data, textStatus, jQxhr){
              $('#messages').append('<li class="received"><span>Received:</span>Record: ' + data.data + '</li>');
              $("#messages").scrollTop($("#messages")[0].scrollHeight);
          },
          error: function(jqXhr, textStatus, errorThrown){
              console.log(errorThrown);
              if (errorThrown == 'Not Found') {
                try {
                  var res = JSON.parse(jqXhr.responseText);
                  $('#messages').append('<li class="received"><span>Received:</span>' + res.description + '</li>');
                  $("#messages").scrollTop($("#messages")[0].scrollHeight);
                } catch(e) {
                  console.log(e);
                }
              }
          }
        });
      } else {
        $('#messages').append('<li class="sent"><span>Sent:</span>' + $command +'</li>');
        $.ajax({
          url: 'http://localhost:4017/'+$command,
          dataType: 'json',
          type: 'POST',
          data: {'pdata':$postdata, 'check':1, 'dsub':'OK'},
          success: function(data, textStatus, jQxhr){
              $('#messages').append('<li class="received"><span>Received:</span>' + data.description + '</li>');
          },
          error: function(jqXhr, textStatus, errorThrown){
              console.log(errorThrown);
              if (errorThrown == 'Not Found') {
                try {
                  var res = JSON.parse(jqXhr.responseText);
                  $('#messages').append('<li class="received"><span>Received:</span>' + res.description + '</li>');
                  $("#messages").scrollTop($("#messages")[0].scrollHeight);           
                } catch(e) {
                  console.log(e);
                }
              }
          }
        });
      }
    } else{
      if (cmd == 'stats') {
        $('#messages').append('<li class="sent"><span>Sent:</span>'+cmd+'</li>');
        $.ajax({
          url: "http://localhost:4017/stats",
          error: function () {},
          dataType: 'json',
          success : function (response) {
              $('#messages').append('<li class="received"><span>Received:</span>Keys: ' + response.statistics[0].cardinality + ', Free: ' + response.statistics[0].cardinality_free + '</li>');
              $("#messages").scrollTop($("#messages")[0].scrollHeight);
          }
        });
      } else{
        $('#messages').append('<li class="sent"><span>Sent:</span>' + cmd +'</li>');
        $.ajax({
          url: 'http://localhost:4017/'+cmd,
          dataType: 'json',
          success: function(data, textStatus, jQxhr){
              $('#messages').append('<li class="received"><span>Received:</span>' + data.description + '</li>');
              $("#messages").scrollTop($("#messages")[0].scrollHeight);
          },
          error: function(jqXhr, textStatus, errorThrown){
              console.log(errorThrown);
              if (errorThrown == 'Not Found') {
                try {
                  var res = JSON.parse(jqXhr.responseText);
                  $('#messages').append('<li class="received"><span>Received:</span>' + res.description + '</li>');
                  $("#messages").scrollTop($("#messages")[0].scrollHeight);
                } catch(e) {
                  console.log(e);
                }
              }
          }
        });
      }
    }
    $('#message').val("");
  };
  $('#message-form').submit(function(event){
    event.preventDefault();
    parseCmd($('#message').val());
  });
});