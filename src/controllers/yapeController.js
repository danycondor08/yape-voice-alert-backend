const telegramService = require('../services/telegramService');

// SIMULACIÓN DE BASE DE DATOS (Multi-Tenant)
// Aquí guardamos los datos de cada bodega que contrata o prueba el servicio
const clientesDB = {
    "maria_12345": {
        nombre: "Bodega Doña María",
        telegramChatId: process.env.TELEGRAM_CHAT_ID || "TU_CHAT_ID_REAL", // Se usa tu .env para pruebas rápidas
        activo: true // Controla la suscripción o los 7 días de prueba
    }
};

exports.recibirNotificacion = async (req, res) => {
    try {
        const { apiKey, monto, detalle, timestamp } = req.body;

        // 1. Validar que llegue la apiKey y el monto
        if (!apiKey || !monto) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (apiKey, monto)' });
        }

        // 2. Buscar al cliente en la base de datos
        const cliente = clientesDB[apiKey];

        if (!cliente) {
            return res.status(404).json({ error: 'API Key inválida o no registrada.' });
        }

        // 3. Validar si la licencia o periodo de prueba sigue activo
        if (!cliente.activo) {
            return res.status(403).json({ error: 'Licencia suspendida o periodo de prueba de 7 días finalizado.' });
        }

        const fechaHora = new Date(Number(timestamp) || Date.now()).toLocaleString('es-PE', {
            timeZone: 'America/Lima'
        });

        console.log(`\n🔔 ¡ NUEVO PAGO DETECTADO (${cliente.nombre}) !`);
        console.log(`💰 Monto: S/ ${monto}`);
        console.log(`📄 Detalle: ${detalle}`);
        console.log(`⏰ Hora: ${fechaHora}`);

        // 4. Enviar la alerta al Telegram específico de este cliente usando el Bot Maestro
        await telegramService.enviarAlerta(cliente.telegramChatId, monto, detalle, fechaHora, cliente.nombre);

        return res.status(200).json({ 
            status: 'ok', 
            message: 'Notificación procesada y negocio alertado con éxito' 
        });

    } catch (error) {
        console.error('Error en yapeController:', error);
        return res.status(500).json({ error: 'Error interno al procesar la notificación' });
    }
};