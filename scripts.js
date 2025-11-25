// let icons = document.getElementsByClassName("material-symbols-outlined");

// for (let i = 0; i < icons.length; i++) {
//   icons[i].innerHTML = icons[i].getAttribute("initial");
// }

// let avatarHolder = document.getElementsByClassName("avatarHolder");
// avatarHolder[0].innerHTML = avatarHolder[0].getAttribute("initial");

let chartData = [
  {title: "Cycling", colour: "#1a7df2", value: 60},
  {title: "Weights", colour: "#fe620b",  value: 30},
  {title: "Stretching", colour: "#fa46ee",  value: 20},
  {title: "Hiking", colour: "green",  value: 0},
];

// let chartData = [
//   {title: "Cycling", colour: "#1a7df2", value: 120},
//   {title: "Turbo", colour: "#fa46ee",  value: 108},
//   {title: "Yoga", colour: "#20d453",  value: 60},
//   {title: "Swimming", colour: "#FE620B",  value: 0},
//   {title: "Resistance", colour: "#15b7bd",  value: 30},
//   {title: "Hiking", colour: "#ff0000",  value: 360},
//   {title: "Running", colour: "#00ff00",  value: 20},
// ];


let chartScale = [100, 60, 30, 10];

const plotChart = (chartData, dayTarget, chartType, targetId, chartScale) => {
  // get totalForDay
  let totalForDay = 0;
  for (let j = 0; j < chartData.length; j++) {
    totalForDay += chartData[j].value;
  }
  let totalNormalise  = (totalForDay > dayTarget) ? totalForDay / dayTarget : 1;
  let totalPercent = totalForDay / dayTarget * 100;
  let remaining =  totalForDay - dayTarget;
  let remainingSymbol  = (totalForDay < dayTarget) ? "" : "+";
  
  if (chartType == "pie") {
    
    let lastPercent = 0;
    let nextPercent = 0;
    
    
    
    // console.log("total " + totalForDay);
    // console.log("totalNormalise " + totalNormalise);
    
    // style="
    // background: radial-gradient(white 50%, transparent 0 70%, white 0), conic-gradient(from 0deg, hsl(81.2, 100%, 50%) 0 67.66666666666666%, white 67.66666666666666% 100%);">3.4</div>
    
//     radial-gradient(white 45%, transparent 0 70%, white 0), conic-gradient(from 0deg, 
// red 0% 20%, 
// orange 20% 40%, 
// green 40% 60%, 
// blue 60% 80%, 
// grey 80% 100%)
    
    // let pieHTML = '<div class="chartPolarDoughnut" style="background-image: conic-gradient(';
     let pieHTML = '<div class="chartPolarDoughnut" style="background-image: radial-gradient(white 45%, transparent 0 70%, white 0), conic-gradient(from 0deg, ';
    for (let j = 0; j < chartData.length; j++) {
      let itemValue = chartData[j].value / totalNormalise;
      nextPercent = lastPercent + itemValue / dayTarget * 100;
      // pieHTML += `${chartData[j].colour} ${lastPercent}%, ${chartData[j].colour} ${nextPercent}%, `;
      pieHTML += `${chartData[j].colour} ${lastPercent}% ${nextPercent}%, `;
      lastPercent = nextPercent;
    }
    // pieHTML += ` white ${lastPercent}%, white 100%); "></div>`;
    pieHTML += ` #eee ${lastPercent}% 100%); "></div>`;
    console.log(pieHTML);
    let pieTarget = document.getElementById(targetId);
    pieTarget.innerHTML = pieHTML;
    document.getElementById("chartPieValue").innerHTML = parseInt(totalPercent) + "%";
    if (totalForDay != dayTarget) {
      document.getElementById("chartPieTarget").innerHTML = remainingSymbol + parseInt(remaining) + " mins";  
    } else {
      document.getElementById("chartPieTarget").style.display = "none";
    }
    
  }
  
  if (chartType == "polar") {
    // increment rings
    let scaleHTML = '';
    for (let i = 0; i < chartScale.length; i++) {
      let scaleWidth =  Math.sqrt(chartScale[i] / dayTarget) * 100;
      let scaleTopLeft = (100 - scaleWidth) / 2;
      scaleHTML += `<div class="chartPolarRing" style="width: ${scaleWidth}%; left: ${scaleTopLeft}%; top: ${scaleTopLeft}%;"></div>`;
    }
    document.getElementById("chartPolarRingContainer").innerHTML = scaleHTML;
    
    // chart slices
    const arrSorted = chartData.toSorted(function(a, b){return a.value - b.value});
    let doughnutHTML = '';

    for (let j = 0; j < chartData.length; j++) {
      let index = arrSorted.indexOf(chartData[j]);
      chartData[j].zIndex = index;
      let itemValue = chartData[j].value;
      if (itemValue > dayTarget) {itemValue = dayTarget;} 
      let gradientValue = Math.sqrt((itemValue / dayTarget)) * 70.7106;
      let increment = 100 / chartData.length;
      let startPercent = increment * j;
      let endPercent = startPercent + increment;
      doughnutHTML += `
        <div class="chartPolarDoughnut" style="z-index: ${chartData[j].zIndex}; background: radial-gradient(transparent 0 ${gradientValue}%, white 0), conic-gradient(from 0deg, transparent 0 ${startPercent}%, ${chartData[j].colour} ${startPercent}% ${endPercent}%, transparent ${endPercent}% 100%)"></div>
      `;
    }
    document.getElementById("chartPolarDoughnutContainer").innerHTML = doughnutHTML;
    document.getElementById("chartPolarValue").innerHTML = parseInt(totalPercent) + "%";
    if (totalForDay != dayTarget) {
      document.getElementById("chartPolarTarget").innerHTML = remainingSymbol + parseInt(remaining) + " mins";
    } else {
      document.getElementById("chartPolarTarget").style.display = "none";
    }
  }
}


let charts = document.getElementsByClassName("chart");
function hideCharts() {
  for (let i = 0; i < charts.length; i++) {
    charts[i].style.display = "none";
  }  
}

function initialiseCharts() {
  plotChart(chartData, 100, "polar", "chartPolarRingContainer", chartScale);
  plotChart(chartData, 100, "pie", "chartPieContainer", chartScale);
  hideCharts();
  showChart('chartPolar');
}

function showChart(id) {
  hideCharts();
  document.getElementById(id).style.display = "flex";
}

initialiseCharts();

