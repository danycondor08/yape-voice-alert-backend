const telegramService = require('../services/telegramService');

exports.recibirNotificacion = async (req, res) => {
    try {
        const { monto, detalle, timestamp } = req.body;

        if (!monto) {
            return res.status(400).json({ error: 'El monto es obligatorio' });
        }

        const fechaHora = new Date(Number(timestamp) || Date.now()).toLocaleString('es-PE', {
            timeZone: 'America/Lima'
        });

        console.log(`\n🔔 ¡ NUEVO PAGO DETECTADO !`);
        console.log(`💰 Monto: S/ ${monto}`);
        console.log(`📄 Detalle: ${detalle}`);
        console.log(`⏰ Hora: ${fechaHora}`);

        await telegramService.enviarAlerta(monto, detalle, fechaHora);

        return res.status(200).json({ 
            status: 'ok', 
            message: 'Notificación procesada y colaborador alertado con éxito' 
        });

    } catch (error) {
        console.error('Error en yapeController:', error);
        return res.status(500).json({ error: 'Error interno al procesar la notificación' });
    }
};