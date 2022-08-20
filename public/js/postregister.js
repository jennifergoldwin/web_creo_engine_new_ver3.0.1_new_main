var messageRes = "";
  var statusRes="";
  $("#form").on("submit", function(e){
  e.preventDefault();
  var data = {"email": $('input[name=email]').val()}
  $.ajax({
    url: "/ekpre-registration",
    method: "post",
    data: data,
    
    success: function(xml, textStatus, xhr) {
        // console.log(arguments);
        statusRes = xhr.responseJSON.status
        statusRes
        ? (messageRes = xhr.responseJSON.message)
        : (messageRes = xhr.responseJSON.message.email[0]);

        console.log(xhr);
    },
    
  }).done(d=>{
    if (statusRes){
        // console.log(status)
        swal(messageRes,"You're pre-registered for this game.", "success")
        .then(()=>setInterval('location.reload()', 500));
    }
    else{
      swal(messageRes,"You're failed to pre-registered for this game.", "error");
    }
  });
  })