import { exec } from 'child_process';
import cron from 'node-cron';
import { format } from 'date-fns';
import { readdir, stat, unlink } from 'fs';
import { join } from 'path';
import trash from 'trash';

// const backupDirectory = '/home/userver/backup';
const backupDirectory = '/mnt/windows_backup';
const databaseName = 'goat';
const connectionString = 'mongodb://localhost:27017';

// Function to perform the MongoDB backup
const performBackup = () => {
  const backupFileName = `${databaseName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
  const backupPath = `${backupDirectory}/${backupFileName}`;

  const command = `mongodump --uri="${connectionString}" --db ${databaseName} --out "${backupPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      console.error(`Error during backup: ${stderr}`);
    } else {
      console.log(`Backup successful: ${backupFileName}`);
    }
  });
};



// Schedule the backup to run every day at midnight
cron.schedule('0 0 * * *', () => {
  performBackup();
});
