const telegramService = require('../services/telegramService');

exports.recibirNotificacion = async (req, res) => {
    try {
        const { monto, detalle, timestamp } = req.body;

        // 1. Validar que llegue al menos el monto requerido
        if (!monto) {
            return res.status(400).json({ error: 'Falta el campo obligatorio: monto' });
        }

        const fechaHora = new Date(Number(timestamp) || Date.now()).toLocaleString('es-PE', {
            timeZone: 'America/Lima'
        });

        console.log(`\n🔔 ¡ NUEVO PAGO DETECTADO !`);
        console.log(`💰 Monto: S/ ${monto}`);
        console.log(`📄 Detalle: ${detalle}`);
        console.log(`⏰ Hora: ${fechaHora}`);

        // 2. Obtener el Chat ID configurado en las variables de entorno de Render
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (!chatId) {
            console.error('Error: TELEGRAM_CHAT_ID no está configurado en las variables de entorno.');
            return res.status(500).json({ error: 'Configuración de Telegram incompleta en el servidor' });
        }

        // 3. Enviar la alerta directamente a tu Telegram personal
        await telegramService.enviarAlerta(chatId, monto, detalle, fechaHora, "Mi Celular Personal");

        return res.status(200).json({ 
            status: 'ok', 
            message: 'Notificación procesada y enviada a Telegram con éxito' 
        });

    } catch (error) {
        console.error('Error en yapeController:', error);
        return res.status(500).json({ error: 'Error interno al procesar la notificación' });
    }
};