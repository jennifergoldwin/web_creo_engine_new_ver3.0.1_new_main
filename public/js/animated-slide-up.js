// const dec = document.querySelectorAll(".desc-utl");






// console.log(dec[0]);

// const btn = document.querySelectorAll(".wrap-util-li");


// btn.forEach((element,x)=>{
//   element.addEventListener("click",()=>{
//     console.log(x);
//     for(let i = 0; i<btn.length;i++){
//       dec[i].classList.remove("selected");
//       btn[i].classList.remove("selected");
//     }
//     dec[x].classList.add("selected")
//     btn[x].classList.add("selected")
//   })
  
// })

const txts=document.querySelector(".animate-text").children,
          txtsLen=txts.length;
      let index=0;
     const textInTimer=3000,
           textOutTimer=2800;

    function animateText() {
       for(let i=0; i<txtsLen; i++){
         txts[i].classList.remove("text-in","text-out");  
       }
       txts[index].classList.add("text-in");

       setTimeout(function(){
           txts[index].classList.add("text-out");              
       },textOutTimer)

       setTimeout(function(){

         if(index == txtsLen-1){
             index=0;
           }
          else{
              index++;
            }
           animateText();
       },textInTimer); 
    }
    
window.onload=animateText;