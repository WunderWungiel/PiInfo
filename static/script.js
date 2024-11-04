function set_value(name) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText)
            document.getElementById(name).textContent = json[name];
        }
    }
    xhr.open("GET", `/api/get_${name}`, true);
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

function set_disks() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            var disks_div = document.getElementById("disks");
            var html = "";
            for (var key in json) {
                html += `<p>${key} (mounted at ${json[key]['mountpoint']}): ${json[key]['used']} GB used (${json[key]['used_percent']}%) / ${json[key]['free']} GB free (${json[key]['free_percent']}%) / ${json[key]['total']} GB in total (100%)</p>`;
            }
            disks_div.innerHTML = html;

        }
    }
    xhr.open("GET", "/api/get_disks", true);
    xhr.send();
}

function set_all_items() {
    set_value("temperature");
    set_value("clock");
    set_value("gpu_clock");
    set_value("fan_speed");
    set_ram();
    set_value("cpu_usage");
    set_disks();
}

setInterval(set_all_items, 1000)
set_all_items();
