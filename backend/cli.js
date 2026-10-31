#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = '1';
if (process.env.PRISMA_ENGINES_MIRROR) {
    process.env.PRISMA_ENGINES_MIRROR = process.env.PRISMA_ENGINES_MIRROR.replace(/\/+$/, '');
}
if (process.env.PRISMA_BINARIES_MIRROR) {
    process.env.PRISMA_BINARIES_MIRROR = process.env.PRISMA_BINARIES_MIRROR.replace(/\/+$/, '');
}

const config = require('./src/config.js'); 

const DATA_DIR = path.join(os.homedir(), '.copymine');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

process.env.DATABASE_URL = `file:${path.join(DATA_DIR, 'copymine.db')}`;

if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev') || process.argv.includes('--debug')) {
    process.env.DEBUG = 'true';
    console.log('[Dev] Режим отладки включен (DEBUG=true)');
}

function runCommand(command) {
    try {
        console.log(`> ${command}`);
        execSync(command, { stdio: 'inherit', cwd: __dirname, env: process.env });
    } catch (e) {
        console.error(`Команда "${command}" не удалась:`, e);
        process.exit(1);
    }
}

async function main() {
    console.log('Запуск панели управления MineDash...');

    const dbPath = path.join(DATA_DIR, 'copymine.db');
    runCommand(`npx prisma generate`);

    if (!fs.existsSync(dbPath)) {
        console.log('База данных не найдена. Создаем и применяем все миграции...');
        runCommand(`npx prisma migrate deploy`);
        console.log('Заполнение базы данных начальными данными (серверами)...');
        runCommand(`npx prisma db seed`);
        console.log('Первоначальная настройка базы данных завершена.');
    } else {
        console.log('Проверка и применение обновлений базы данных...');
        runCommand(`npx prisma migrate deploy`);
        console.log('База данных в актуальном состоянии.');
    }

    const { startServer } = require('./src/server.js');
    await startServer();
}

if (require.main === module) {
    main().catch(e => {
        console.error('Критическая ошибка при запуске:', e);
        process.exit(1);
    });
}

module.exports = { main };