const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// ✉️ POST /api/contact - Wysyłka wiadomości kontaktowej
router.post('/contact', async (req, res) => {
    try {
        const { name, email, package: packageType, message } = req.body;

        // Walidacja
        if (!name || !email || !packageType || !message) {
            return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
        }

        // Konfiguracja transportera Gmail
        // UWAGA: W produkcji użyj App Password, nie zwykłego hasła!
        // https://support.google.com/accounts/answer/185833
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'julia.mobilnaasystentka@gmail.com',
                pass: process.env.EMAIL_PASSWORD || 'YOUR_APP_PASSWORD_HERE' // ZMIEŃ NA APP PASSWORD!
            }
        });

        // Treść emaila dla Ciebie
        const mailOptions = {
            from: `"Formularz Kontaktowy" <julia.mobilnaasystentka@gmail.com>`,
            to: 'julia.mobilnaasystentka@gmail.com',
            replyTo: email,
            subject: `🔔 Nowe zapytanie - ${packageType}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 30px; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: #c5a059; margin: 0; font-size: 24px;">📬 Nowe zapytanie z formularza</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #0f172a; border-bottom: 2px solid #c5a059; padding-bottom: 10px;">Dane klienta</h2>
                        <p><strong>👤 Nazwa:</strong> ${name}</p>
                        <p><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
                        <p><strong>📦 Pakiet:</strong> <span style="background: #c5a059; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">${packageType}</span></p>
                        
                        <h2 style="color: #0f172a; border-bottom: 2px solid #c5a059; padding-bottom: 10px; margin-top: 30px;">Wiadomość</h2>
                        <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #c5a059; border-radius: 5px; line-height: 1.6;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 5px; border-left: 4px solid #f59e0b;">
                            <p style="margin: 0; color: #92400e;">
                                <strong>💡 Wskazówka:</strong> Odpowiedz bezpośrednio na ten email, aby skontaktować się z klientem.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
                        <p>Wiadomość wygenerowana automatycznie przez system Mobilna Asystentka</p>
                        <p>Data: ${new Date().toLocaleString('pl-PL')}</p>
                    </div>
                </div>
            `
        };

        // Wysyłka
        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'Wiadomość wysłana pomyślnie!' 
        });

    } catch (error) {
        console.error('❌ Błąd wysyłki emaila:', error);
        res.status(500).json({ 
            error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub skontaktuj się bezpośrednio.' 
        });
    }
});

module.exports = router;
