const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { authenticateUniversal, authorize } = require('../middleware/auth');
const config = require('../../config');

const router = express.Router();

const DATA_DIR = path.join(os.homedir(), '.copymine');
const CONFIG_PATH = path.join(DATA_DIR, 'config.json');

router.get('/settings', authenticateUniversal, authorize('panel:settings:view'), (req, res) => {
    const { server, telemetry } = config;

    res.json({
        server: {
            allowExternalAccess: server.allowExternalAccess
        },
        telemetry: {
            enabled: telemetry?.enabled ?? false
        }
    });
});

router.put('/settings', authenticateUniversal, authorize('panel:settings:edit'), async (req, res) => {
    const { allowExternalAccess, telemetryEnabled } = req.body;
    
    try {
        let currentConfig = {};
        try {
            currentConfig = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf-8'));
        } catch {
            currentConfig = { ...config };
        }

        if (!currentConfig.server) currentConfig.server = { ...config.server };

        let requiresRestart = false;

        if (typeof allowExternalAccess === 'boolean') {
            if (currentConfig.server.allowExternalAccess !== allowExternalAccess) {
                requiresRestart = true;
            }
            currentConfig.server.allowExternalAccess = allowExternalAccess;
            currentConfig.server.host = allowExternalAccess ? '0.0.0.0' : '127.0.0.1';
            config.server.allowExternalAccess = allowExternalAccess;
            config.server.host = currentConfig.server.host;
            console.log(`[Config Update] Внешний доступ ${allowExternalAccess ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}. Хост изменен на ${currentConfig.server.host}`);
        }
        
        if (typeof telemetryEnabled === 'boolean') {
            if (!currentConfig.telemetry) {
                currentConfig.telemetry = {};
            }
            currentConfig.telemetry.enabled = telemetryEnabled;
            if (!config.telemetry) config.telemetry = {};
            config.telemetry.enabled = telemetryEnabled;
        }

        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(CONFIG_PATH, JSON.stringify(currentConfig, null, 2), 'utf-8');

        res.json({ 
            message: requiresRestart
                ? 'Настройки сохранены. Для изменения сетевого доступа требуется перезапуск панели.'
                : 'Настройки успешно сохранены и применены.',
            requiresRestart
        });

    } catch (error) {
        console.error("Ошибка обновления файла конфигурации:", error);
        res.status(500).json({ error: 'Не удалось сохранить настройки.' });
    }
});

module.exports = router;