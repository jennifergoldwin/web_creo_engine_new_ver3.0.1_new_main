var messageRes = "";
var statusRes = "";
$("#form1").on("submit", function (e) {
  // console.log("eher");
  e.preventDefault();
  processPost();
});
$("#form").on("submit", function (e) {
  // console.log("here");
  e.preventDefault();
  processPost();
});

function processPost() {
  var data = { email: $("input[name=email]").val() };
  $.ajax({
    url: "/ekpre-registration",
    method: "post",
    data: data,

    success: function (xml, textStatus, xhr) {
      // console.log(arguments);
      statusRes = xhr.responseJSON.status;
      statusRes
        ? (messageRes = xhr.responseJSON.message)
        : (messageRes = xhr.responseJSON.message.email[0]);

      // console.log(xhr);
    },
  }).done((d) => {
    if (statusRes) {
      // console.log(status)
      // document.location.href = "#thankyou";
      const nextState = { additionalInformation: "Pre-Register Success" };
      const newState = { additionalInformation: "Pre-Register" };
      window.history.replaceState(
        nextState,
        "Evermore Knights | Pre-Registration",
        "ekpre-registration/thankyou"
      );
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );
      // fbq("init", "1268280613947379");
      fbq("track", "PageView");
      fbq("track", "CompleteRegistration");

      swal(messageRes, "You're pre-registered for this game.", "success")
        // .then(() => setInterval("location.reload()", 100))
        .then(() => {
          window.history.replaceState(
            newState,
            "Evermore Knights | Pre-Registration",
            "/ekpre-registration"
          );
          window.location.reload();
        });
    } else {
      swal(
        messageRes,
        "You're failed to pre-registered for this game.",
        "error"
      );
    }
  });
}

// function selectedNav(type, idx) {
//   console.log(idx);
//   const btn_rewards = document.querySelectorAll(".btn-swiper-rewards-nav");
//   for (let i = 0; i < btn_rewards.length; i++) {
//     btn_rewards[i].classList.remove("selected");
//     // document.querySelector("#")
//     // document
//     //   .querySelector(".btn-swiper-rewards-nav-path")
//     //   .classList.remove("selected");
//   }

//   for (let i = 0; i < btn_rewards.length; i++) {
//     if (btn_rewards[i].id === type) {
//       console.log(btn_rewards[i].id);
//       btn_rewards[i].classList.add("selected");

//       if (type === "gashani") {
//         // document
//         //   .querySelector(".btn-swiper-rewards-nav-path")
//         //   .classList.add("selected");
//         document.querySelector("#profile_frame_border_only-6").style.display =
//           "block";
//         document.querySelector(".rewards-wrapper-2").classList.add("selected");
//         document.querySelector(".rewards-wrapper-3").classList.add("selected");
//       }
//       const swiper = document.querySelector(".swiper.rewards").swiper;
//       // console.log(swiper);
//       swiper.slideTo(idx, 1000);
//     }
//   }
// }

function selectedNav(type, idx) {
  // console.log(idx);
  swiper.slideTo(idx, 1000);
  // $(".title-desc-reward-wrapper").toggleClass("anim-slide-up");
  var x = document.querySelector(".title-desc-reward-wrapper");

  x.classList.remove("anim-slide-up");
  setTimeout(() => {
    x.classList.add("anim-slide-up");
  }, 0);
  x.style.opacity = 1;
  // swiper_desc.slideTo(idx, 1000);
  idx += 1;

  document.querySelector("#profile_frame_border_only").style.display = "none";
  document.querySelector("#profile_frame_border_only-2").style.display = "none";
  document.querySelector("#profile_frame_border_only-3").style.display = "none";
  document.querySelector("#profile_frame_border_only-4").style.display = "none";
  document.querySelector("#profile_frame_border_only-5").style.display = "none";
  document.querySelector("#profile_frame_border_only-6").style.display = "none";
  document.querySelector("#profile_frame_border_only-7").style.display = "none";

  switch (idx) {
    case 1:
      document.getElementById("prize_title").innerHTML = "Zenny";
      document.getElementById("prize_desc").innerHTML =
        "The currency in Evermore Knights. It is acquired throughout the game and used for making various purchases.";
      document.querySelector("#profile_frame_border_only").style.display =
        "block";
      break;
    case 2:
      document.getElementById("prize_title").innerHTML = "Carillon";
      document.getElementById("prize_desc").innerHTML =
        "An item that is used to summon (gacha) characters and weapons in Evermore Knights";
      document.querySelector("#profile_frame_border_only-3").style.display =
        "block";
      break;
    case 3:
      document.getElementById("prize_title").innerHTML = "Jade Lost Time Idol";
      document.getElementById("prize_desc").innerHTML =
        "A special item that increases a character's overall EXP when used.";
      document.querySelector("#profile_frame_border_only-4").style.display =
        "block";
      break;
    case 4:
      document.getElementById("prize_title").innerHTML = "Divine Key";
      document.getElementById("prize_desc").innerHTML =
        "An item that allows players to access challenging dungeons in Evermore Knights";
      document.querySelector("#profile_frame_border_only-2").style.display =
        "block";
      break;
    case 5:
      document.getElementById("prize_title").innerHTML = "Kalarau";
      document.getElementById("prize_desc").innerHTML =
        "Gashani's signature staff! A powerful weapon used in unleashing devastating pyro attacks. It also comes with a card slot that allows players to equip a skill card, further strengthening the weapon.";
      document.querySelector("#profile_frame_border_only-7").style.display =
        "block";
      break;
    case 6:
      document.getElementById("prize_title").innerHTML =
        "Royal Secret Service Costume";
      document.getElementById("prize_desc").innerHTML =
        "A cosmetic outfit enhances a character’s attributes and gives them an exclusive look!";
      document.querySelector("#profile_frame_border_only-5").style.display =
        "block";
      break;
    case 7:
      document.getElementById("prize_title").innerHTML = "Gashani";
      document.getElementById("prize_desc").innerHTML =
        "Exclusively made characters for Evermore Knights Pre-registration event are limited to a certain amount and period. ";
      document.querySelector("#profile_frame_border_only-6").style.display =
        "block";
      break;
  }
}
