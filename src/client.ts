import Client from 'ssh2-sftp-client';
import { SocksClient } from 'socks';
import { Notice } from 'obsidian';
import * as path from 'path';
const fs = require('fs');

interface FileObject {
  name: string;
  mtime: number;
  type: string;
  size: number;
  path: string;
}

export default class SFTPClient {
  private client: Client;

  constructor() {
    this.client = new Client();
  }

  async connect(options: any): Promise<string> {
    console.log(`Connecting to ${options.host}:${options.port}`);
    try {
      if (options.proxy_host && options.proxy_host !== '') {
        let opt = {
          proxy: {
            host: options.proxy_host,
            port: options.proxy_port as number,
            type: 5,
          },
          command: 'connect',
          destination: {
            host: options.host,
            port: options.port
          }
        };

        var socks = await SocksClient.createConnection(opt);
        await this.client.connect({
          host: options.host,
          port: options.port,
          sock: socks.socket,
          username: options.username,
          privateKey: fs.readFileSync(options.private_key.toString()),
          password: options.password
        });
      } else {
        await this.client.connect({
          host: options.host,
          port: options.port,
          username: options.username,
          privateKey: fs.readFileSync(options.private_key.toString()),
          password: options.password
        });
      }
    } catch (err) {
      console.log('Failed to connect:', err);
      throw new Error(`Failed to connect: ${err}`);
    }
    return('Connected to SFTP');
  }

  async disconnect(): Promise<string> {
    console.log(`Disconnecting from SFTP.`);
    await this.client.end();
    return 'Disconnected from SFTP';
  }

  async listFiles(remoteDir: string, fileGlob = null): Promise<FileObject[]> {
    let fileObjects;
    try {
      if (fileGlob) {
        // @ts-ignore - second arg can be glob or filter function
        fileObjects = await this.client.list(remoteDir, fileGlob as any);
      } else {
        fileObjects = await this.client.list(remoteDir);
      }
    } catch (err) {
      console.error('Listing failed:', err);
      return [];
    }

    const fileNames: FileObject[] = [];
    const subdirectoryPromises: Promise<FileObject[]>[] = [];

    for (const file of fileObjects) {
      const fileInfo = {
        name: file.name,
        mtime: file.modifyTime,
        type: file.type,
        size: file.size,
        path: remoteDir
      };

      if (file.type === 'd') {
        console.log(`${new Date(file.modifyTime).toISOString()} PRE ${file.name}`);
        fileNames.push(fileInfo);
        
        // Don't await - collect promises instead
        subdirectoryPromises.push(
          this.listFiles(`${remoteDir}/${file.name}`)
        );
      } else {
        console.log(`${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`);
        fileNames.push(fileInfo);
      }
    }

    // Wait for all subdirectories in parallel
    if (subdirectoryPromises.length > 0) {
      const subdirectoryResults = await Promise.all(subdirectoryPromises);
      fileNames.push(...subdirectoryResults.flat());
    }

    return fileNames;
  }

  async uploadFile(localFile: string, remoteFile: string) {
    var message = `Uploading `;
    new Notice(message + `${path.basename(localFile)}`);
    console.log(message + `${localFile} to ${remoteFile}`);
    try {
      await this.client.put(localFile, remoteFile);
    } catch (err) {
      console.error('Uploading failed:', err);
      return(`Uploading failed:\n${err}`);
    }
    var successMessage = `Uploading success for\n`;
    console.log(successMessage + localFile);
    return successMessage + path.basename(localFile);
  }

  async downloadFile(remoteFile: string, localFile: string) {
    var message = `Downloading `;
    new Notice(message + `${path.basename(localFile)}`);
    console.log(message + `${localFile} from ${remoteFile}`);
    try {
      await this.client.get(remoteFile, localFile);
    } catch (err) {
      console.error('Downloading failed:', err);
      return(`Downloading failed:\n${err}`);
    }
    var successMessage = `Downloading success for\n`;
    console.log(successMessage + localFile);
    return successMessage + path.basename(localFile);
  }

  async makeDir(remoteDir: string): Promise<string> {
    console.log(`Creating directory ${remoteDir}`);
    try {
      await this.client.mkdir(remoteDir, true);
    } catch (err) {
      console.error('Failed to create directory:', err);
      return(`Failed to make directory:\n${err}`);
    }
    var successMessage = `Successfully made directory:\n${remoteDir}`;
    console.log(successMessage);
    return successMessage;
  }

  async removeDir(remoteDir: string): Promise<string> {
    console.log(`Deleting directory ${remoteDir}`);
    try {
      await this.client.rmdir(remoteDir, true);
    } catch (err) {
      console.error('Failed to remove directory:', err);
      return(`Failed to remove directory:\n${err}`);
    }
    var successMessage = `Successfully removed directory:\n${remoteDir}`;
    console.log(successMessage);
    return successMessage;
  }

  async deleteFile(remoteFile: string): Promise<string> {
    console.log(`Deleting ${remoteFile}`);
    try {
      await this.client.delete(remoteFile);
    } catch (err) {
      console.error('Deleting failed:', err);
      return(`Deleting failed:\n${err}`);
    }
    var successMessage = `Delete  success for\n`;
    console.log(successMessage + remoteFile);
    return successMessage + path.basename(remoteFile);
  }

  async fileExists(remoteFile: string): Promise<boolean> {
    console.log(`Checking if ${remoteFile} exists`);
    let exists: any = false;
    try {
      exists = await this.client.exists(remoteFile);
    } catch (err) {
      console.error('Exists check failed:', err);
    }
    return Boolean(exists);
  }
}