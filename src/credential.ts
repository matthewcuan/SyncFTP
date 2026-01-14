import SyncFTP from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export default class CredentialTab extends PluginSettingTab {
	plugin: SyncFTP;

	constructor(app: App, plugin: SyncFTP) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'SFTP Settings'});

		new Setting(containerEl)
			.setName('URL')
			.setDesc('FTP URL')
			.addText(text => text
				.setValue(this.plugin.settings.url)
				.onChange(async (value) => {
					this.plugin.settings.url = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Port')
			.setDesc('FTP Port')
			.addText(text => text
				.setValue(this.plugin.settings.port)
				.onChange(async (value) => {
					this.plugin.settings.port = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h2', {text: 'If you are not using a proxy please leave these fields empty.'});

		new Setting(containerEl)
			.setName('Proxy URL')
			.setDesc('Proxy URL')
			.addText(text => text
				.setValue(this.plugin.settings.proxy_host)
				.onChange(async (value) => {
					this.plugin.settings.proxy_host = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Proxy port')
			.addText(text => text
				.setValue(this.plugin.settings.proxy_port)
				.onChange(async (value) => {
					this.plugin.settings.proxy_port = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h2', {text: 'Credentials'});

		new Setting(containerEl)
			.setName('Username')
			.setDesc('FTP Username')
			.addText(text => text
				.setValue(this.plugin.settings.username)
				.onChange(async (value) => {
					this.plugin.settings.username = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Password')
			.setDesc('FTP Password')
			.addText(text => text
				.setValue(this.plugin.settings.password)
				.onChange(async (value) => {
					this.plugin.settings.password = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Private Key')
			.setDesc('Path to private key')
			.addText(text => text
				.setValue(this.plugin.settings.private_key)
				.onChange(async (value) => {
					this.plugin.settings.private_key = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Vaults Path')
			.setDesc('FTP Vaults Directory Path')
			.addText(text => text
				.setValue(this.plugin.settings.vault_path)
				.onChange(async (value) => {
					this.plugin.settings.vault_path = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Sync Notifications')
			.setDesc('Would you like to be notified of all SyncFTP actions? Necessary Notices will still populate.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.notify)
				.onChange(async (value) => {
					this.plugin.settings.notify = value;
					await this.plugin.saveSettings();
				}));

		// Scheduling UI
		containerEl.createEl('h2', {text: 'Scheduling'});

		new Setting(containerEl)
			.setName('Enable scheduled upload')
			.setDesc('If enabled, SyncFTP will run the cron schedule while Obsidian is running.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.scheduled_enabled)
				.onChange(async (value) => {
					this.plugin.settings.scheduled_enabled = value;
					await this.plugin.saveSettings();
					this.plugin.setupCron();
				}));

		new Setting(containerEl)
			.setName('Cron expression')
			.setDesc('Cron expression (e.g., "0 8 * * *" for daily at 08:00). Uses node-cron syntax.')
			.addText(text => text
				.setValue(this.plugin.settings.cron_expr || '')
				.setPlaceholder('e.g. 0 8 * * *')
				.onChange(async (value) => {
					this.plugin.settings.cron_expr = value;
					await this.plugin.saveSettings();
					this.plugin.setupCron();
				}));

		new Setting(containerEl)
			.setName('Sync on Load')
			.setDesc('Would you like to pull new changes from the SFTP every time you open Obsidian?')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.load_sync)
				.onChange(async (value) => {
					this.plugin.settings.load_sync = value;
					await this.plugin.saveSettings();
				}));
	}
}
