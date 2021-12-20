Chart.register(ChartDataLabels);
var ctx = document.getElementById("myChart").getContext("2d");

var gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
gradient1.addColorStop(0, '#4975E6');   
gradient1.addColorStop(1, '#6554E9');

var gradient2 = ctx.createLinearGradient(0,0,0,400);
gradient2.addColorStop(0,'#4975E6');
gradient2.addColorStop(1,'#5FA3E9');

var gradient3 = ctx.createLinearGradient(0,0,0,400);
gradient3.addColorStop(0,'#9E7EE9');
gradient3.addColorStop(1,'#4975E6');

var gradient4 = ctx.createLinearGradient(0,0,0,400);
gradient4.addColorStop(0,'rgba(52,177,230,0.5)');
gradient4.addColorStop(1,'rgba(45,119,233)');

var gradient5 = ctx.createLinearGradient(0,0,0,400);
gradient5.addColorStop(0,'#5C62E6');
gradient5.addColorStop(1,'#52C2E9');

const labelsDesc = [
  "12 mths Vesting Period, monthly liquid",
  "TGE 10%, 9 mths Vesting Period, monthly liquid",
  "TGE 10%, 9 mths Vesting Period, monthly liquid",
  "TGE 20%, 6 mths Vesting Period, monthly liquid",
  "9 mths cliff, 24 mths Vesting Period, monthly liquid",
  "12 mths Vesting Period, quarterly liquid",
  "TGE 5%, 24 mths Vesting Period, monthly liquid",
  "36 mths Vesting Period, monthly liquid",
  "24 mths Vesting Period, monthly liquid",
  "12 mths Vesting Period monthly liquid",
  "TGE 2%, 36 mths Vesting Period monthly liquid",
  "TGE 15%, 12 mths Vesting Period, monthly liquid"

 ]

var data1 = {
    labels: ["Partnership", "Seed Sale", "Private Round", "IDO Sale", "Team","Advisors"
    ,"Game Development","Staking Reward","Ecosystem Funds","Affiliate & Marketing","Play to Earn Reward","Liquidity & Incentives"],
    datasets: [
      {
        data: [30000000,30000000,70000000,20000000,100000000,50000000,110000000,100000000, 90000000, 50000000, 200000000, 150000000],
        backgroundColor: [
          gradient1,
          gradient2,
          gradient3,
          gradient2,
          gradient1,
          gradient4,
          gradient5,
          gradient3,
          gradient5,
          gradient1,
          gradient3,
          gradient2,
        ],   
        borderWidth: 0,
        polyline: {
          color: "gray",
          labelColor: "gray",
          formatter: (value) => `${value}`
        }
      }
    ]
  };
  //options
  var options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '35%',
    plugins: {
      labels:{
        render: 'value',
        color: 'white',
        position: 'outside',

      },
      legend: {
          display: false,
            title: {
              display: false,
              text: 'Legend Title',
          },
      },
      datalabels: {
        clamp: true,
        align: 'center',
        // anchor: 'end',
        display:true,
        color: "white",
        // font: '12px Exo',
        formatter: function(value, ctx){
          console.log('heh');
          return (value/10000000) + '% ';
        }
      }
    }
    
  };

  const doughnutLabelsLine={
    id: 'doughnutLabelsLine',
    afterDraw(chart, args, options){
      const {ctx, chartArea: {top, bottom, left, right, width, height} } = chart;
      

      chart.data.datasets.forEach((dataset,i)=>{
        chart.getDatasetMeta(i).data.forEach((datapoint, index)=>{
          // console.log(datapoint);
          const {x, y} = datapoint.tooltipPosition();
          // ctx.fillStyle = 'black';
          // ctx.fillRect(x,y, 10, 10);

          const halfwidth = width / 2;
          const halfheight = height / 2;

          const xLine = x >= halfwidth ? x + 15 : x - 15;
          const yLine = y >= halfheight ? y + 15 : y - 15;
          const extraLine = x >=  halfwidth ? 15 : -15;

          ctx.beginPath();
          // ctx.moveTo(x, y);
          // ctx.lineTo(xLine, yLine);
          // ctx.lineTo(xLine + extraLine,yLine);
          // ctx.strokeStyle = 'white';
          // ctx.stroke();

          const textWidth  = ctx.measureText(chart.data.labels[index]).width;
          ctx.font = '70% Exo';

          const textXPosition = x >= halfwidth ? 'left' : 'right' 
          ctx.textAlign = textXPosition;
          ctx.textBaseLine = 'middle';
          ctx.fillStyle = 'white ';
          // console.log();
          // if (width<=768){
            // chart.options.plugins.legend.display = true;
            // chart.options.plugins.legend.position ='bottom';
            // console.log('lol')
            // console.log(chart.options.plugins.legend.display);
            // console.log(chart.options.plugins.legend.fullSize);
            // chart.options.plugins.legend.display = true;
            // chart.options.plugins.legend.position ='bottom';
            // ctx.fillText('', 
          // }
        
            // chart.options.plugins.legend.display = false;
            var labelSample =dataset.data[index]/10000000 + '% '+ chart.data.labels[index];
            if (index==0){
              ctx.fillText(labelSample,xLine + extraLine-20 ,yLine-extraLine-35);
              ctx.fillText(labelsDesc[index],xLine+extraLine-20,yLine-38);
            }
            else if (index>=8){
              console.log('hehe')
              ctx.fillText(labelSample,xLine + extraLine-5 ,yLine-20);
              ctx.fillText(labelsDesc[index],xLine+extraLine-5,yLine);
              
            }
            else{
              ctx.fillText(labelSample,xLine + extraLine-5 ,yLine-extraLine-12);
              ctx.fillText(labelsDesc[index],xLine+extraLine-5,yLine-15);
            }
           
          // }

     
        })
      })
    }
  }

  //create Chart class object
  var chart1 = new Chart(ctx, {
    type: "doughnut",
    data: data1,
    options: options,
    plugins: [doughnutLabelsLine],
    //     options:{
            
    //     }
  });
 


  
