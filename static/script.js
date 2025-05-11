function set_value(name) {
    $.get(`/api/get_${name}`, function (json) {
        $("#" + name).text(json[name]);
    })
}

function set_fan() {
    $.get(`/api/get_fan_speed`, function (json) {
        if (json["fan_speed"] === null) {
            $("#fanLi").hide();
        }
        const fan_speed = parseInt(json["fan_speed"]);
        $("#fan_speed").text(fan_speed);
        if (fan_speed > 0) {
            $("#fanIcon").css("animation", "spin " + ((1000/fan_speed) + 0.5).toString() + "s linear infinite");
        } else {
            $("#fanIcon").css("animation", "none");
        }
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

function init_disks() {
    const colors = ["#2980b9", "#8e44ad", "#c0392b", "#f39c12", "#16a085", "#f1c40f"]
    let charts = {};
    $("#disks div div canvas").each(function(i) {
        const chart = set_chart(this, $(this).data("disk-id"));
        const color = colors[Math.floor(Math.random() * colors.length)];
        chart.options.plugins.tooltip.callbacks.label = (context) => { return ` ${context.raw} GB` };
        chart.data.datasets[0].backgroundColor = [color, "white"];
        charts[$(this).data("disk-id")] = chart;
    })
    return charts;
}

function set_disks(charts) {
    $.get("/api/get_disks", function (json) {
        for (const key in json) {
            charts[key].data.datasets[0].data = [json[key]['used'], json[key]['free']];
            charts[key].update();
        }
    })
}

const set_chart = (ctx, title) => {
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Free'],
            datasets: [{
                label: title,
                data: [0, 0],
                backgroundColor: [
                    "#3498db", "white"
                ],
                hoverOffset: 4
            }]
        },
        cutout: "70%"
    })
    return chart;
} 

Chart.overrides["doughnut"].plugins.legend.display = false;
const ram_chart = set_chart(document.getElementById("ram_chart"), "RAM")
ram_chart.options.plugins.tooltip.callbacks.label = (context) => { return ` ${context.raw} GB` };
const cpu_chart = set_chart(document.getElementById("cpu_chart"), "CPU")
cpu_chart.data.datasets[0].backgroundColor = ["#2ecc71", "white"];
cpu_chart.options.plugins.tooltip.callbacks.label = (context) => { return ` ${context.raw}%` };
const charts = init_disks();

function set_all_items() {
    set_temperature();
    set_value("clock");
    set_fan();
    set_ram(ram_chart);
    set_cpu(cpu_chart);
    set_disks(charts);
}

setInterval(set_all_items, 1000)
set_all_items();