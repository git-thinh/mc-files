
sudo npm install npm -g

sudo apt-get install libgs-dev g++ cmake
npm install ghostscript-js

vim /etc/systemd/system/to-png.service

[Unit]
Description="Vector to-png vector-pdf"

[Service]
ExecStart=/usr/bin/node /home/ubadm/vector-pdf/app.js
WorkingDirectory=/home/ubadm/vector-pdf
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=to-png
Environment=NODE_ENV=production PORT=38686

[Install]
WantedBy=multi-user.target



systemctl enable to-png.service
systemctl stop to-png.service
systemctl start to-png.service
systemctl status to-png.service
systemctl restart to-png.service