const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- KONFIGURASI SMTP GMAIL ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'bellaverifikasi@gmail.com', // Ganti dengan Email Gmail Anda
        pass: 'jdae ukbj gxqq ugie'   // Ganti dengan 16 Digit App Password Google
    }
});

// Endpoint untuk mengirim OTP
app.post('/send-otp', async (req, res) => {
    const { email, otp, botname } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ status: false, message: 'Data tidak lengkap' });
    }

    const mailOptions = {
        from: `"${botname} Verification" <no-reply@gmail.com>`,
        to: email,
        subject: `🔐 Kode Verifikasi Akun: ${otp}`,
        html: `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <style>
                body { margin: 0; padding: 0; background-color: #f4f7f9; }
                .container { font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 500px; margin: 40px auto; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border: 1px solid #e1e8ed; background: #ffffff; }
                .header { background: linear-gradient(135deg, #1a1a1a, #434343); padding: 50px 20px; text-align: center; color: white; }
                .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800; text-transform: uppercase; }
                .header p { margin: 10px 0 0; font-size: 14px; opacity: 0.8; }
                .content { padding: 40px 35px; text-align: center; }
                .greeting { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 10px; }
                .instruction { color: #5f6368; font-size: 15px; line-height: 1.6; margin-bottom: 30px; }
                .otp-box { background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 16px; padding: 30px; margin: 20px 0; border-style: dashed; }
                .otp-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; }
                .otp-code { font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #1a73e8; margin: 0; text-shadow: 1px 1px 0px #fff; }
                .warning-box { background: #fff4f4; border-radius: 10px; padding: 15px; margin-top: 30px; border-left: 4px solid #d93025; }
                .warning-text { font-size: 12px; color: #d93025; text-align: left; line-height: 1.4; }
                .footer { background: #f8f9fa; padding: 25px; text-align: center; font-size: 12px; color: #adb5bd; border-top: 1px solid #eee; }
                .footer b { color: #6c757d; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${botname}</h1>
                    <p>VERIFIKASI IDENTITAS PENGGUNA</p>
                </div>
                <div class="content">
                    <div class="greeting">Halo!</div>
                    <div class="instruction">
                        Kami menerima permintaan pendaftaran akun baru. <br>
                        Gunakan kode OTP di bawah ini untuk memvalidasi akun Anda:
                    </div>
                    
                    <div class="otp-box">
                        <div class="otp-label">Kode OTP Anda</div>
                        <div class="otp-code">${otp}</div>
                    </div>

                    <div class="warning-box">
                        <div class="warning-text">
                            <b>PENTING:</b> Kode ini bersifat rahasia dan akan kadaluwarsa dalam <b>5 menit</b>. 
                            Jangan membagikan kode ini kepada siapa pun, termasuk staf dukungan kami.
                        </div>
                    </div>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} <b>${botname} Bot System</b>. <br>
                    Dikirim secara otomatis. Mohon tidak membalas email ini.
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            status: true, 
            message: 'Email OTP Berhasil Dikirim' 
        });
    } catch (error) {
        console.error('SMTP Error:', error);
        res.status(500).json({ 
            status: false, 
            message: 'Gagal mengirim email', 
            error: error.message 
        });
    }
});

// Cek Status API
app.get('/', (req, res) => {
    res.json({ status: "Online", message: "OTP API Premium is Running" });
});

module.exports = app;
