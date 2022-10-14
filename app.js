// Imports
import fetch from "node-fetch";
import express, { response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var listTeam = [
  {
    url: "/public/assets/team/JAVIER.png",
    name: "JAVIER TAN",
    title: "CEO & CO FOUNDER",
    linkedin: "https://www.linkedin.com/in/javier-tan-b07058228",
  },
  {
    url: "/public/assets/team/DARREL.png",
    name: "DARREL WIJAYA",
    title: "CTO & CO FOUNDER",
    linkedin: "https://www.linkedin.com/in/darrel-wijaya-5172b7133/",
  },
  {
    url: "/public/assets/team/GANI.png",
    name: "GANI HARTANTO",
    title: "CMO",
    linkedin: "https://www.linkedin.com/in/gani-hartanto-646078139/",
  },
  {
    url: "/public/assets/team/VETRIC.png",
    name: "VETRIC HARTADY",
    title: "CFO",
    linkedin: "https://www.linkedin.com/in/vetric-hartady-18379314a",
  },
  {
    url: "/public/assets/team/DEVI.png",
    name: "DEVI",
    title: "COO",
    linkedin: "https://www.linkedin.com/in/devi-luo-b5967779/",
  },
  {
    url: "/public/assets/team/TIMOTHY.png",
    name: "TIMOTHY HERMAWAN",
    title: "LEAD PROGRAMMER",
    linkedin: "",
  },
  {
    url: "/public/assets/team/AKBAR.png",
    name: "AKBAR SANTORINO",
    title: "ART DIRECTOR",
    linkedin: "https://www.linkedin.com/in/akbar-santorino-b4343b76/",
  },
  {
    url: "/public/assets/team/JENNIFER.png",
    name: "JENNIFER GOLDWIN",
    title: "FULL STACK PROGRAMMER",
    linkedin: "https://www.linkedin.com/in/jennifer-goldwin-9487701b4/",
  },
  {
    url: "/public/assets/team/TEDY.png",
    name: "TEDY",
    title: "COMMUNITY MANAGER",
    linkedin: "https://www.linkedin.com/in/tedy-lie-5701a0228/",
  },
  {
    url: "/public/assets/team/RICHKO.png",
    name: "RICHKO UTAMA",
    title: "COMMUNITY SUPPORT",
    linkedin: "http://linkedin.com/in/richko-utama-b112a330",
  },
  {
    url: "/public/assets/team/LOUIE.png",
    name: "LOUIE TANUTAMA",
    title: "PR DIRECTOR",
    linkedin: "https://www.linkedin.com/in/louie-tanutama-470185228/",
  },
  {
    url: "/public/assets/team/DAVID.png",
    name: "DAVID SALIM",
    title: "PR MANAGER",
    linkedin: "https://www.linkedin.com/in/david-salim-70780a227/",
  },
  {
    url: "/public/assets/team/YUDO.png",
    name: "ANDARU YUDO",
    title: "CREATIVE DESIGNER",
    linkedin: "https://www.linkedin.com/in/andaru-yudo-utomo-321b80176/",
  },
];
var listAdvisors = [
  {
    url: "/public/assets/team/JIMMY.png",
    name: "JIMMY YAN",
    title: "ADVISOR & FOUNDER OF STRT BUTTON",
    linkedin: "https://www.linkedin.com/in/jmyn",
  },
  {
    url: "/public/assets/team/SIGIT.png",
    name: "SIGIT PUTRA TANOKO .ST",
    title: "ADVISOR & FOUNDER OF SKYX",
    linkedin: "https://www.linkedin.com/in/sigit-tanoko-9a718b86/",
  },
  {
    url: "/public/assets/team/JUNI.png",
    name: "JUNI LANDA KURIAWAN .ST",
    title: "ADVISOR & FOUNDER OF CUANB CAPITAL",
    linkedin: "https://www.linkedin.com/in/juni-landa-kurniawan-087ab8228",
  },
  {
    url: "/public/assets/team/ROBY.png",
    name: "ROBY JEO",
    title: "ADVISOR & FOUNDER OF KOMMUNITAS",
    linkedin: "https://www.linkedin.com/in/robby678/",
  },
  {
    url: "/public/assets/team/GAGA.png",
    name: "CRYPTO LADY GAGA",
    title: "ADVISOR",
    linkedin: "",
  },
];
var listGame = [
  {
    url: "/public/assets/game/ek.png",
    url_desc: "/public/assets/game/ek-1.png",
    name: "Evermore Knights",
    desc: "Turn-based RPG Game",
    website: "https://evermoreknights.com/",
    discord: "https://discord.gg/evermoreknights",
  },
  {
    url: "/public/assets/game/slime.png",
    url_desc: "/public/assets/game/slime-1.png",
    name: "Slime Haven",
    desc: "Pet Game",
  },
  {
    url: "/public/assets/game/peony.png",
    url_desc: "/public/assets/game/peony-1.png",
    name: "Peony Ranch",
    desc: "Harvest Game",
  },
  {
    url: "/public/assets/game/merchant.png",
    url_desc: "/public/assets/game/merchant-1.png",
    name: "Merchant Marvels",
    desc: "Crafting Game",
  },
];
var totalRegister = 0;
var heightPrecentage = 0;
var widthPrecentage = 0;
var width = 0;
var height = 0;
var gacha1 = false;
var gacha2 = false;
var gacha3 = false;
var gacha4 = false;
var gacha5 = false;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Static Files
app.use("/public", express.static(__dirname + "/public"));

// Set Views
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index", {
    listTeam: listTeam,
    listGame: listGame,
    listAdvisors: listAdvisors,
  });
});
app.get("/error-page", (req, res) => {
  res.render("error-page");
});
app.get("/admns", (req, res) => {
  res.render("admns");
});
app.get("/app", (req, res) => {
  res.render("app");
});
app.get("/ar", (req, res) => {
  res.render("ar");
});
app.get("/ar2", (req, res) => {
  res.render("ar2");
});
app.get("/vr", (req, res) => {
  res.render("vr");
});
app.get("/ekpre-registration", (req, res) => {
  var responseClone = "";
  const url_api =
    "https://api-dev.evermoreknights.com/hooks/creo/event/total-register";

  try {
    fetch(url_api, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        responseClone = res.clone();
        return res.json();
      })
      .then(
        (data) => {
          //   console.log(data.data.total);
          totalRegister = data.data.total;
          // totalRegister = 100000;
          if (parseInt(totalRegister) >= 15000) {
            gacha1 = true;
            gacha2 = false;
            gacha3 = false;
            gacha4 = false;
            gacha5 = false;
          }
          if (parseInt(totalRegister) >= 30000) {
            gacha1 = true;
            gacha2 = true;
            gacha3 = false;
            gacha4 = false;
            gacha5 = false;
          }
          if (parseInt(totalRegister) >= 50000) {
            gacha1 = true;
            gacha2 = true;
            gacha3 = true;
            gacha4 = false;
            gacha5 = false;
          }
          if (parseInt(totalRegister) >= 70000) {
            gacha1 = true;
            gacha2 = true;
            gacha3 = true;
            gacha4 = true;
            gacha5 = false;
          }
          if (parseInt(totalRegister) >= 100000) {
            gacha1 = true;
            gacha2 = true;
            gacha3 = true;
            gacha4 = true;
            gacha5 = true;
          }

          if (parseInt(totalRegister) <= 15000) {
            // width = (parseInt(totalRegister) / 100000) * 70;
            // height = (parseInt(totalRegister) / 100000) * 50;
            widthPrecentage = (parseInt(totalRegister) / 100000) * 70 + "%";
            heightPrecentage = (parseInt(totalRegister) / 100000) * 50 + "%";
          } else {
            if (parseInt(totalRegister) === 100000) {
              heightPrecentage = (parseInt(totalRegister) / 100000) * 100 + "%";
              // height = (parseInt(totalRegister) / 100000) * 100;
            } else {
              heightPrecentage = (parseInt(totalRegister) / 100000) * 96 + "%";
              // height = (parseInt(totalRegister) / 100000) * 96;
            }
            widthPrecentage = (parseInt(totalRegister) / 100000) * 111 + "%";
            // width = (parseInt(totalRegister) / 100000) * 111;
          }
        },
        (rejectionReason) => {
          console.log(
            "Error parsing JSON from response:",
            rejectionReason,
            responseClone
          ); // 4
          responseClone
            .text() // 5
            .then(function (bodyText) {
              console.log(
                "Received the following instead of valid JSON:",
                bodyText
              ); // 6
            });
        }
      )
      .finally(() => {
        res.render("ekpre-registration", {
          totalRegister,
          widthPrecentage,
          heightPrecentage,
          gacha1,
          gacha2,
          gacha3,
          gacha4,
          gacha5,
        });
      });
  } catch (error) {
    console.log(error);
  }
});
app.post("/ekpre-registration", async (req, res) => {
  var email = req.body;
  var responseClone = "";
  console.log(email);
  var resJson = "";
  try {
    fetch("https://api-dev.evermoreknights.com/hooks/creo/event/pre-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    })
      .then((res) => {
        responseClone = res.clone();
        return res.json();
      })
      .then(
        (data) => {
          resJson = data;
          if (data.status) {
            var transporter = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: "contact@creoengine.com",
                pass: "exhyjrywanpqjaft",
              },
            });

            var emailOptions = {
              from: "contact@creoengine.com",
              to: req.body.email,
              subject: "Evermore Knights Pre-Registration Succeed",
              html: `
            <div>
              <p style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
                Dear Commissioner,<br/><br/>
                Thank you for participating in Evermore Knights Pre-registration!<br/><br/>
                In-game bonuses will be mailed to you upon the release of the game. Don't forget to claim them when the time comes!<br/><br/>
                We eagerly look forward to your journey with us in the game.<br/><br/>
                Sincerely,<br/><br/>
                Evermore Knights Community Team
              </p>
            </div>
          `,
            };

            transporter.sendMail(emailOptions, (error, info) => {
              if (error) {
                console.log("test " + error);
                // res.redirect('/contact_send');
              } else {
                console.log("Message Sent: " + info.response);
                console.log("Email Message: " + emailMessage);
                // res.redirect('/contact_error');
              }
            });
          }
        },
        (rejectionReason) => {
          console.log(
            "Error parsing JSON from response:",
            rejectionReason,
            responseClone
          ); // 4
          responseClone.text().then(function (bodyText) {
            console.log(
              "Received the following instead of valid JSON:",
              bodyText
            ); // 6
          });
        }
      )
      .finally(() => {
        res.json(resJson);
      });
  } catch (error) {
    console.log(error);
  }
});

app.get("/info/total_circulating", (req, res) => {
  // var tokensale=10412576;
  var tokensale = 30463031;
  var tge = 4226322;
  var mm = 3500000;
  var liquidity = 10000000;
  var total = tge + mm + liquidity;
  res.render("circulation", { total: tokensale });
});
app.get("/info/total_supply", (req, res) => {
  // var tokensale=4912576;
  // var tge=4226322;
  // var mm=3500000;
  // var liquidity=10000000;
  // var total=tge+mm+liquidity;
  res.render("totalsupply", { total: "998425261.469345" });
});

// app.get("/logo",(req,res)=>{
//     res.send('/public/assets/logo_creo.png')
// });
// app.get("/logo",(req,res)=>{
//     res.send('/public/assets/game/slime.png')
// });

// Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`));
