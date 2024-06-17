require('dotenv').config();

const { exec } = require('child_process');

// Функція для створення резервної копії бази даних PostgreSQL
const createBackup = () => {
    // Отримання змінних середовища з файлу .env
    const dbName = process.env.DB_NAME;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;

    const backupFileName = `backup_${new Date().toISOString()}.sql`;

    // Команда для створення резервної копії бази даних
    const command = `pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} ${dbName} > ${backupFileName}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error creating backup: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error creating backup: ${stderr}`);
            return;
        }
        console.log(`Backup created successfully: ${backupFileName}`);
    });
};

createBackup();
