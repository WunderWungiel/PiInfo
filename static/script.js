function set_temperature() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText)
            document.getElementById("temperature").textContent = json["temperature"];
        }
    }
    xhr.open("GET", "/api/get_temperature", true);
    xhr.send();
}

function set_clock() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText)
            document.getElementById("clock").textContent = json["clock"];
        }
    }
    xhr.open("GET", "/api/get_clock", true);
    xhr.send();
}

function set_gpu_clock() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText)
            document.getElementById("gpu_clock").textContent = json["gpu_clock"];
        }
    }
    xhr.open("GET", "/api/get_gpu_clock", true);
    xhr.send();
}

function set_fan_speed() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText)
            document.getElementById("fan_speed").textContent = json["fan_speed"];
        }
    }
    xhr.open("GET", "/api/get_fan_speed", true);
    xhr.send();
}

function set_ram() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText)
            document.getElementById("ram_used").textContent = json["used"];
            document.getElementById("ram_used_percent").textContent = json["used_percent"];
            document.getElementById("ram_free").textContent = json["free"];
            document.getElementById("ram_free_percent").textContent = json["free_percent"];
            document.getElementById("ram_total").textContent = json["total"];
        }
    }
    xhr.open("GET", "/api/get_ram", true);
    xhr.send();
}

function set_cpu_usage() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText)
            document.getElementById("cpu_usage").textContent = json["cpu_usage"];
        }
    }
    xhr.open("GET", "/api/get_cpu_usage", true);
    xhr.send();
}

function set_disks() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            var disks_div = document.getElementById("disks");
            var html = "";
            for (var key in json) {
                console.log(key);
                html += `<p>${key} (mounted at ${json[key]['mountpoint']}): ${json[key]['used']} GB used (${json[key]['used_percent']}%) / ${json[key]['free']} GB free (${json[key]['free_percent']}%) / ${json[key]['total']} GB in total (100%)</p>`;
            }
            console.log(html)
            disks_div.innerHTML = html;

        }
    }
    xhr.open("GET", "/api/get_disks", true);
    xhr.send();
}

function set_all_items() {
    set_temperature();
    set_clock();
    set_gpu_clock();
    set_fan_speed();
    set_ram();
    set_cpu_usage();
    set_disks();
}

setInterval(set_all_items, 1000)

set_all_items();
