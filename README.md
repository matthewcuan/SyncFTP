# SyncSFTP

This Obsidian.md plugin allows users to sync files to their personal SFTP server.

It's a fork from the original "SyncFTP", with optimizations, bug corrections, and new features.
Live Sync feature authored by xeno3917.

This plugin depends on [ssh2-sftp-client](https://www.npmjs.com/package/ssh2-sftp-client) and [socks](https://www.npmjs.com/package/socks) to allow for secure file transfer. 

### Use
Once installed, an additional settings tab for SyncFTP will have been added. There you will need to provide:
- Host URL
- Host PORT
- Username
- Password
- Path to vault directory on SFTP: The vault directory will be the base directory for ALL vaults. 
- Notification toggle: Certain Notices will remain, but verbose information Notices will be disabled
- Download on open toggle: Allows you to download work from the SFTP on open.
- Enable live sync toggle: Enable sync (auto-upload and/or interval) of modified content
- Upload on change toggle: Enable sync on change (don't use it with interval)
- Upload interval: force check and upload of modified content every X seconds (don't use it with on-change) 
- Private key path: optional — use this to authenticate with an SSH private key (private-key auth)
- Scheduled/interval sync: run periodic syncs using `node-cron` (alternate to change-based uploads)
- Optimized remote scan: improved scan performance for large remote directories

If you would like to use a proxy, please fill in the settings:
- Proxy URL
- Proxy PORT

When you wish to sync you can either push or pull files to the SFTP using:
1. Icons (up and down arrow) on the left toolbar
2. Commands (CTRL-P), which will allow you to set a keyboard shortcut as desired
3. Enable upload on change (New features)

This process is destructive on the SFTP, and moves local files to your .trash folder.

### License
This project is under the [MIT](https://en.wikipedia.org/wiki/MIT_License) license.
