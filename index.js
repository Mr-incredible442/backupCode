import { exec } from 'child_process';
import cron from 'node-cron';
import { format } from 'date-fns';
import { readdir, stat } from 'fs';
import { join } from 'path';
import trash from 'trash';

import { fileURLToPath } from 'url';import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backupDirectory = 'C:\\Users\\THE GAME\\OneDrive\\Desktop\\backup';
const databaseName = 'goat';
const connectionString = 'mongodb://localhost:27017';

// Function to perform the MongoDB backup
const performBackup = () => {
  const backupFileName = `${databaseName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
  const backupPath = `${backupDirectory}\\${backupFileName}`;

  const command = `"C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongodump" --uri="${connectionString}" --db ${databaseName} --out "${backupPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      console.error(`Error during backup: ${stderr}`);
    } else {
      //console.log(`Backup successful: ${backupFileName}`);
    }
  });
};

// Function to delete backups older than 30 days
const deleteOldBackups = () => {
  const days = 30;
  const now = new Date();

  readdir(backupDirectory, (err, files) => {
    if (err) {
      return console.error(`Error reading backup directory: ${err.message}`);
    }

    files.forEach((file) => {
      const filePath = join(backupDirectory, file);

      stat(filePath, (err, stats) => {
        if (err) {
          return console.error(`Error getting stats for file: ${err.message}`);
        }

        const fileAgeInDays = (now - new Date(stats.mtime)) / (1000 * 60 * 60 * 24);
        if (fileAgeInDays > days) {
          trash([filePath])
            .then(
              // () => console.log(`Moved old backup to Recycle Bin: ${filePath}`)
              )
            .catch((err) => console.error(`Error moving file to Recycle Bin: ${err.message}`));
        }
      });
    });
  });
};



// Schedule the backup to run every day at midnight
cron.schedule('0 0 * * *', () => {
  performBackup();
  deleteOldBackups();
});
