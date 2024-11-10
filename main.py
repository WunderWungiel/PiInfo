import os

import psutil
from vcgencmd import Vcgencmd

from flask import Flask, render_template

app = Flask(__name__)
vcgm = Vcgencmd()


class Info:
    def get_temperature(self):
        return vcgm.measure_temp()
    
    def get_clock(self):
        return round(vcgm.measure_clock("arm") / (1000 * 1000))
        
    def get_fan_speed(self):
        files = os.listdir("/sys/devices/platform/cooling_fan/hwmon")
        if not files:
            return 0
        file_path = os.path.join("/sys/devices/platform/cooling_fan/hwmon", files[0], "fan1_input")
        with open(file_path, "r") as f:
            return int(f.read().strip())
        
    def get_ram(self):

        ram_info = psutil.virtual_memory()
        return {
            "total": round(ram_info[0] / (1024 * 1024 * 1024), 2),
            "used": round(ram_info[3] / (1024 * 1024 * 1024), 2),
            "free": round(ram_info[1] / (1024 * 1024 * 1024), 2),
            "used_percent": round(ram_info[2]),
            "free_percent": round(100 - ram_info[2])
        }
    
    def get_cpu_usage(self):

        return psutil.cpu_percent()
    
    def get_disks(self):

        info = {}

        disks_list = psutil.disk_partitions()
        for disk in disks_list:
            
            path, mountpoint = disk[0], disk[1]
            usage = psutil.disk_usage(mountpoint)

            info[path] = {
                "total": round(usage[0] / (1024 * 1024 * 1024), 2),
                "used": round(usage[1] / (1024 * 1024 * 1024), 2),
                "free": round(usage[2] / (1024 * 1024 * 1024), 2),
                "used_percent": round(usage[3]),
                "free_percent": round(100 - usage[3]),
                "mountpoint": mountpoint
            }

        return info

info = Info()

@app.route("/")
def _root():

    return render_template("index.html")

@app.route("/api/get_temperature")
def _get_temperature():
    return {
        "temperature": info.get_temperature()
    }

@app.route("/api/get_clock")
def _get_clock():
    return {
        "clock": info.get_clock()
    }

@app.route("/api/get_fan_speed")
def _get_fan_speed():
    return {
        "fan_speed": info.get_fan_speed()
    }

@app.route("/api/get_ram")
def _get_ram():
    return info.get_ram()

@app.route("/api/get_cpu_usage")
def _get_cpu_usage():
    return {
        "cpu_usage": info.get_cpu_usage()
    }

@app.route("/api/get_disks")
def _get_disks():
    return info.get_disks()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9092, debug=True)