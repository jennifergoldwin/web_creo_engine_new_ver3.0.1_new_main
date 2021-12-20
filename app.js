// Imports
const express = require('express')
const app = express()
const port = 3000

var listTeam=[
    {
        url: "/public/assets/team/JAVIER.png", name: "JAVIER TAN", title: "CEO & CO FOUNDER", linkedin:"https://www.linkedin.com/in/javier-tan-b07058228",
    },
    {
        url: "/public/assets/team/DARREL.png", name: "DARREL WIJAYA", title: "CTO & CO FOUNDER", linkedin:"https://www.linkedin.com/in/darrel-wijaya-5172b7133/",
    },
    {
        url:  "/public/assets/team/GANI.png", name: "GANI HARTANTO", title: "CMO", linkedin:"https://www.linkedin.com/in/gani-hartanto-646078139/",
    },
    {
        url:"/public/assets/team/VETRIC.png", name: "VETRIC HARTADY", title: "CFO", linkedin:"https://www.linkedin.com/in/vetric-hartady-18379314a",
    },
    {
        url:"/public/assets/team/DEVI.png", name: "DEVI", title: "COO", linkedin:"https://www.linkedin.com/in/devi-luo-b5967779/",
    },
    {
        url:"/public/assets/team/TIMOTHY.png", name: "TIMOTHY HERMAWAN", title: "LEAD PROGRAMMER", linkedin:"",
    },
    {
        url:"/public/assets/team/AKBAR.png", name: "AKBAR SANTORINO", title: "ART DIRECTOR", linkedin:"https://www.linkedin.com/in/akbar-santorino-b4343b76/",
    },
    {
        url:"/public/assets/team/JENNIFER.png", name: "JENNIFER GOLDWIN", title: "FULL STACK PROGRAMMER", linkedin:"https://www.linkedin.com/in/jennifer-goldwin-9487701b4/",
    },    
    {
        url:"/public/assets/team/TEDY.png", name: "TEDY", title: "COMMUNITY MANAGER", linkedin:"https://www.linkedin.com/in/tedy-lie-5701a0228/",
    },
    {
        url:"/public/assets/team/RICHKO.png",name: "RICHKO UTAMA", title: "COMMUNITY SUPPORT", linkedin:"http://linkedin.com/in/richko-utama-b112a330",
    },
    {
        url:"/public/assets/team/LOUIE.png", name: "LOUIE TANUTAMA", title: "PR DIRECTOR", linkedin:"https://www.linkedin.com/in/louie-tanutama-470185228/",
    },
    {
        url:"/public/assets/team/DAVID.png",name: "DAVID SALIM", title: "PR MANAGER", linkedin:"https://www.linkedin.com/in/david-salim-70780a227/",
    },
    {
        url:"/public/assets/team/YUDO.png",name: "ANDARU YUDO", title: "CREATIVE DESIGNER", linkedin:"https://www.linkedin.com/in/andaru-yudo-utomo-321b80176/",
    },
    {
        url:"/public/assets/team/JIMMY.png",name: "JIMMY YAN", title: "ADVISOR & FOUNDER OF STRT BUTTON", linkedin:"https://www.linkedin.com/in/jmyn",
    },
    {
        url:"/public/assets/team/SIGIT.png", name: "SIGIT PUTRA TANOKO .ST", title: "ADVISOR & FOUNDER OF SKYX", linkedin: "https://www.linkedin.com/in/sigit-tanoko-9a718b86/"
    }
]

var listGame=[
    {
        url: "/public/assets/game/ek.png", url_desc:"/public/assets/game/ek-1.png" ,name: "Evermore Knights", desc: "Turn-based RPG Game", website: "https://evermoreknights.com/" , telegram: "https://discord.gg/evermoreknights"
    },
    {
        url: "/public/assets/game/slime.png",url_desc:"/public/assets/game/slime-1.png", name: "Slime Haven", desc: "Pet Game"
    },
    {
        url: "/public/assets/game/peony.png",url_desc:"/public/assets/game/peony-1.png", name: "Peony Ranch", desc: "Harvest Game"
    },
    {
        url: "/public/assets/game/merchant.png",url_desc:"/public/assets/game/merchant-1.png", name: "Merchant Marvels", desc: "Crafting Game"
    },

]

// Static Files
app.use('/public', express.static(__dirname + "/public"));
// app.use(express.static('public'))
// app.use('/css',express.static(__dirname + 'public/css'))
// app.use('/js',express.static(__dirname + 'public/js'))
// app.use('/img',express.static(__dirname + 'public/img'))

// Set Views
// app.set('views','./views')
app.set('view engine','ejs')

app.get('',(req,res)=>{
    res.render('index',{listTeam: listTeam, listGame: listGame})
})

app.get("/admns",(req,res)=>{
    res.render('admns')
});
app.get("/app",(req,res)=>{
    res.render('app')
});
// app.get("/logo",(req,res)=>{
//     res.send('/public/assets/logo_creo.png')
// });
// app.get("/logo",(req,res)=>{
//     res.send('/public/assets/game/slime.png')
// });

// Listen on port 3000
app.listen(port,()=> console.info(`Listening on port ${port}`))