import os
import subprocess
import json

config = json.loads(open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "config.json"), "r").read())

import psutil
if config["DEVICE"] == "raspberry":
    from vcgencmd import Vcgencmd
    vcgm = Vcgencmd()

from flask import Flask, render_template

app = Flask(__name__)

class Info:
    def get_kernel(self):
        return subprocess.run(["uname", "-r"], capture_output=True, text=True).stdout.strip()
    
    def get_model(self):

        if config["DEVICE"] == "raspberry":
            with open("/proc/cpuinfo", "r") as f:
                return f.read().splitlines()[-1].split(":")[1].strip()
        else:
            return open("/sys/devices/virtual/dmi/id/product_name", "r").read().strip()

    def get_temperature(self):

        if config["DEVICE"] == "raspberry":
            return vcgm.measure_temp()
        else:
            temps = psutil.sensors_temperatures()
            try:
                return temps["coretemp"][0].current
            except KeyError:
                return None
    
    def get_clock(self):

        if config["DEVICE"] == "raspberry":
            return round(vcgm.measure_clock("arm") / (1000 * 1000))
        else:
            return round(psutil.cpu_freq().current)
        
    def get_fan_speed(self):

        if config["DEVICE"] == "raspberry":
            files = os.listdir("/sys/devices/platform/cooling_fan/hwmon")
            if not files:
                return 0
            file_path = os.path.join("/sys/devices/platform/cooling_fan/hwmon", files[0], "fan1_input")
            with open(file_path, "r") as f:
                return int(f.read().strip())
        else:
            fan_speed = psutil.sensors_fans()
            return list(fan_speed.values())[0][0].current if fan_speed else None
            
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
            
            device, mountpoint = disk[0], disk[1]
            if mountpoint.startswith("/snap"): # Snap virtual mounts
                continue

            usage = psutil.disk_usage(mountpoint)

            info[mountpoint] = {
                "total": round(usage[0] / (1024 * 1024 * 1024), 2),
                "used": round(usage[1] / (1024 * 1024 * 1024), 2),
                "free": round(usage[2] / (1024 * 1024 * 1024), 2),
                "used_percent": round(usage[3]),
                "free_percent": round(100 - usage[3]),
                "device": device
            }

        sorted_info = {"/": info["/"]}
        info.pop("/")
        sorted_info = sorted_info | info

        return sorted_info

info = Info()

@app.route("/")
def _root():

    return render_template("index.html", model=info.get_model(), kernel=info.get_kernel(), disks=info.get_disks())

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
