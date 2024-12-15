function set_value(name) {
    $.get(`/api/get_${name}`, function (json) {
        $("#" + name).text(json[name]);
    })
}

function set_fan() {
    $.get(`/api/get_fan_speed`, function (json) {
        const fan_speed = json["fan_speed"];
        $("#" + "fan_speed").text(fan_speed);
        (fan_speed == 0) ? $("#fanIcon").removeClass("spin") : $("#fanIcon").addClass("spin");
    })
}

function set_temperature() {
    $.get(`/api/get_temperature`, function (json) {
        let iconClass;
        const temperature = json["temperature"];
        $("#temperature").text(temperature.toString());
        if (temperature >= 70) {
            iconClass = "bi-thermometer-high";
        } else if (temperature >= 50) {
            iconClass = "bi-thermometer-half";
        } else {
            iconClass = "bi-thermometer-low";
        }
        $("#temperatureIcon").removeClass();
        $("#temperatureIcon").addClass(iconClass);
    })
}

function set_ram(chart) {
    $.get("/api/get_ram", function (json) {
        chart.data.datasets[0].data = [json['used'], json['free']];
        chart.update();
    })
}

function set_cpu(chart) {
    $.get("/api/get_cpu_usage", function (json) {
        chart.data.datasets[0].data = [json['cpu_usage'], 100 - json["cpu_usage"]];
        chart.update();
    })
}

function set_disks() {
    
    $.get("/api/get_disks", function (json) {
        let html = "";
        for (const key in json) {
            html += `<p>${key} (mounted at ${json[key]['mountpoint']}): ${json[key]['used']} GB used (${json[key]['used_percent']}%) / ${json[key]['free']} GB free (${json[key]['free_percent']}%) / ${json[key]['total']} GB in total (100%)</p>`;
        }
        $("#disks").html(html);
    })
}

const set_chart = (name, title) => {
    const ctx = document.getElementById(`${name}_chart`);
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Free'],
            datasets: [{
                label: title,
                data: [0, 0],
                backgroundColor: [
                    "blue", "white"
                ],
                hoverOffset: 4
            }]
        },         
        cutout: "70%"
    })
    return chart;
} 

Chart.overrides["doughnut"].plugins.legend.display = false;
const ram_chart = set_chart("ram", "RAM")
ram_chart.options.plugins.tooltip.callbacks.label = (context) => { return ` ${context.raw} GB` };
const cpu_chart = set_chart("cpu", "CPU")
cpu_chart.options.plugins.tooltip.callbacks.label = (context) => { return ` ${context.raw}%` };

function set_all_items() {
    set_temperature();
    set_value("clock");
    set_fan();
    set_ram(ram_chart);
    set_cpu(cpu_chart);
    set_disks();
}

setInterval(set_all_items, 1000)
set_all_items();