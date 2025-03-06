const nodemailer = require('nodemailer');
const db = require('../models');
const { generateRandomSixDigitNumber } = require('../../utils');
const users = db.users
const Op = db.Sequelize.Op
require('dotenv').config();
const moment = require("moment");

exports.sendEmail = async (req, res) => {
    try {
        const requiredParams = ['to'];
        for (const value of requiredParams) {
            if (!req.body[value]) {
                return res.status(400).send({
                    status: "error",
                    error_message: "Parameter tidak lengkap " + value,
                    code: 400
                });
            }
        }

        const existUser = await users.findOne({
            where: {
                email: { [Op.eq]: req.body.to },
                deleted: { [Op.eq]: 0 }
            }
        })

        if (!existUser) {
            return res.status(400).send({
                status: "not found",
                error_message: "Email belum terdaftar",
                code: 400
            })
        }
        const otp = generateRandomSixDigitNumber()
        const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000); // Current time + 5 minutes

        await users.update({
            otp: otp,
            otp_expired: fiveMinutesLater
        }, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: existUser.id }
            }
        })
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        const payload = {
            ...req.body,
            from: `"DONASIQU" ${process.env.EMAIL}`,
            subject: "Login OTP",
            html: `
            <div style="padding: 10px;">
              <img src="https://res.cloudinary.com/dzrthkexn/image/upload/v1741267307/donasiqu/rmx1eouamfm7oh2bllyt.jpg" style="margin-left:auto; margin-right:auto" />
              <h5 style="font-size: 24px; font-weight: bold; text-align: center; color: black; margin-top:-20px">Kode OTP Login</h5>
              <p style="color: black;">Jangan memberitahu kode rahasia ini pada siapapun, berikut kode rahasia anda:</p>
              <h5 style="font-size: 32px; font-weight: bold; text-align: center;"><strong>${otp}</strong></h5>
              <p>Berlaku sampai dengan ${moment().format("DD-MM-YYYY HH:mm:ss")}, Terima Kasih!</p>
            </div>
          `,
        };
        transport.sendMail(payload, function (error, info) {
            if (error) throw Error(error);
        })
        return res.status(200).send({
            status: "success",
            message: "Email Sent",
            items: existUser,
            code: 200
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server mengalami gangguan!", error: error })
        return
    }
};