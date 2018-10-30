'use strict';
const path = require('path');
const electron = require('electron');
const config = require('./config');

const {app} = electron;
let tray = null;

exports.create = win => {
	if (process.platform === 'darwin' || tray) {
		return;
	}

	const iconPath = path.join(__dirname, 'static/IconTray.png');

	const toggleWin = () => {
		if (win.isVisible()) {
			win.hide();
		} else {
			win.show();
		}
	};

	const setDnd = (minutes) => {
		config.set('dnd', minutes)
	}

	const isChecked = (minutes) => {
		return config.get('dnd') == minutes;
	}

	const contextMenu = electron.Menu.buildFromTemplate([
		{
			label: 'Toggle',
			click() {
				toggleWin();
			}
		},
		{
			type: 'separator'
		},
		{
			'label': 'Do not disturb settings',
     			'submenu': [
				{
					label: 'Do not disturb - OFF', 
					type: 'radio', 
					checked: isChecked(0),
					click() {
						setDnd(0)
					} 
				},
				{
					label: 'Do not disturb - 1 minute', 
					type: 'radio', 
					checked: isChecked(1),
					click() {
						setDnd(1)
					} 
				},
				{
					label: 'Do not disturb - 2 minute', 
					type: 'radio', 
					checked: isChecked(2),
					click() {
						setDnd(2)
					} 
				},
				{
					label: 'Do not disturb - 5 minute', 
					type: 'radio', 
					checked: isChecked(5),
					click() {
						setDnd(5)
					} 
				},
				{
					label: 'Do not disturb - 10 minute', 
					type: 'radio', 
					checked: isChecked(10),
					click() {
						setDnd(10)
					} 
				}]
		},
		{
			type: 'separator'
		},
		{
			role: 'quit'
		}
	]);

	tray = new electron.Tray(iconPath);
	tray.setToolTip(`${app.getName()}`);
	tray.setContextMenu(contextMenu);
	tray.on('click', toggleWin);
};

exports.setBadge = shouldDisplayUnread => {
	if (process.platform === 'darwin' || !tray) {
		return;
	}

	const icon = shouldDisplayUnread ? 'IconTrayUnread.png' : 'IconTray.png';
	const iconPath = path.join(__dirname, `static/${icon}`);
	tray.setImage(iconPath);
};
