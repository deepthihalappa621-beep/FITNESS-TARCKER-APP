let activities =
JSON.parse(localStorage.getItem("fitnessData")) || [];

let chart;

function saveSteps(){

    const steps =
    parseInt(document.getElementById("stepsInput").value);

    if(!steps || steps <= 0){
        alert("Please enter valid steps.");
        return;
    }

    let calories = calculateCalories(steps);
    let status = getFitnessStatus(steps);

    const activity = {
        date:new Date().toLocaleDateString(),
        steps:steps,
        calories:calories,
        status:status
    };

    activities.push(activity);

    localStorage.setItem(
        "fitnessData",
        JSON.stringify(activities)
    );

    updateDashboard(activity);

    loadHistory();

    loadChart();

    showDiet(status);

    document.getElementById("stepsInput").value="";
}

function calculateCalories(steps){

    return Math.round(steps * 0.04);
}

function getFitnessStatus(steps){

    if(steps < 3000){
        return "Sedentary";
    }

    if(steps < 6000){
        return "Lightly Active";
    }

    if(steps < 10000){
        return "Active";
    }

    return "Very Active";
}

function updateDashboard(activity){

    document.getElementById("stepsDisplay")
    .innerText = activity.steps;

    document.getElementById("caloriesDisplay")
    .innerText = activity.calories + " kcal";

    document.getElementById("statusDisplay")
    .innerText = activity.status;

    const goal = 10000;

    const percentage =
    Math.min(
        Math.round((activity.steps/goal)*100),
        100
    );

    document.getElementById("progressBar")
    .style.width = percentage + "%";

    document.getElementById("progressText")
    .innerText = percentage + "% Completed";
}

function showDiet(status){

    let plan = "";

    if(typeof diets !== "undefined"){

        plan = diets[status];
    }

    document.getElementById("dietPlan")
    .innerHTML =
    `<div class="diet-card">${plan}</div>`;
}

function loadHistory(){

    const table =
    document.getElementById("historyTable");

    table.innerHTML = "";

    activities.forEach(item => {

        table.innerHTML += `
        <tr>
            <td>${item.date}</td>
            <td>${item.steps}</td>
            <td>${item.calories}</td>
            <td>${item.status}</td>
        </tr>
        `;
    });
}

function loadChart(){

    const labels =
    activities.map(item => item.date);

    const stepsData =
    activities.map(item => item.steps);

    const ctx =
    document.getElementById("fitnessChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"Daily Steps",

                data:stepsData,

                fill:false,

                borderColor:"green",

                tension:0.3
            }]
        },

        options:{

            responsive:true,

            plugins:{
                legend:{
                    display:true
                }
            },

            scales:{
                y:{
                    beginAtZero:true
                }
            }
        }
    });
}

window.onload = function(){

    if(activities.length > 0){

        const latest =
        activities[activities.length - 1];

        updateDashboard(latest);

        showDiet(latest.status);
    }

    loadHistory();

    loadChart();
};