# PiInfo
Quick and dirty Flask web app to show some Raspberry Pi system information

![Screenshot](https://i.imgur.com/Gp3Yhtq.png "Screenshot")

Using Flask, simple HTML & CSS and JavaScript, it displays some basic information like temperature, clocks, CPU/RAM/partitions usage of Raspberry Pi system.

## Tutorial

1. Install dependencies: either by running `pip install -r requirements.txt` (**venv recommended**) or `sudo apt install python3-{psutil,flask}`.
2. Run on host system (don't attempt using Docker, it won't work). Example systemd service file is provided.
