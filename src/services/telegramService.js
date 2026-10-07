exports.enviarAlerta = async (monto, detalle, fechaHora) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.log('⚠️ [Telegram] Token o ChatID no configurados. Alerta simulada en consola.');
            return;
        }

        // 🛡️ Limpiamos el detalle para remover asteriscos u otros caracteres que rompen el Markdown
        const detalleLimpio = detalle ? detalle.replace(/[*_`[\]]/g, '') : '';

        const mensaje = `🚨 *¡PAGO YAPE CONFIRMADO!* 🚨\n\n` +
                        `💰 *Monto:* S/ ${monto}\n` +
                        `📋 *Detalle:* ${detalleLimpio}\n` +
                        `⏰ *Hora:* ${fechaHora}\n\n` +
                        `_Ya puedes entregar el producto al cliente._`;

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: mensaje,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (data.ok) {
            console.log('✅ Alerta enviada a Telegram correctamente.');
        } else {
            console.error('❌ Telegram rechazó el mensaje:', data.description);
        }

    } catch (error) {
        console.error('❌ Error de red al enviar mensaje a Telegram:', error);
    }
};
