
const db = require('../models')
const users = db.users
const login_histories = db.login_histories
const Op = db.Sequelize.Op
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const size = +req.query.size || 10;
        const page = +req.query.page || 0;
        const offset = size * page;

        const result = await users.findAndCountAll({
            where: {
                deleted: { [Op.eq]: 0 },
                ...req.query.id && { id: { [Op.eq]: req.query.id } },
                ...req.query.status && { status: { [Op.in]: req.query.status.split(",") } },
                ...req.query.role && { role: { [Op.in]: req.query.role.split(",") } },
                ...req.query.is_reset && { is_reset: { [Op.eq]: req.query.is_reset } },
                ...req.query.verified && { verified: { [Op.eq]: req.query.verified } },
                ...req.query.email && { email: { [Op.eq]: req.query.email } },
                ...req.query.search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${req.query.search}%` } },
                        { email: { [Op.like]: `%${req.query.search}%` } },
                        { phone: { [Op.like]: `%${req.query.search}%` } },
                        { code: { [Op.like]: `%${req.query.search}%` } },
                    ]
                },
            },
            order: [
                ['created_on', 'DESC'],
            ],
            attributes: { exclude: ['deleted', 'password'] },
            ...req.query.pagination == 'true' && {
                limit: size,
                offset: offset
            }
        })
        return res.status(200).send({
            status: "success",
            items: result.rows,
            total_items: result.count,
            total_pages: Math.ceil(result.count / size),
            current_page: page,
            code: 200
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server mengalami gangguan!", error: error })
        return
    }
};

exports.create = async (req, res) => {
    try {
        const requiredFields = ['name', 'password', 'role', 'pob', 'dob'];
        for (const value of requiredFields) {
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
                deleted: { [Op.eq]: 0 },
                email: { [Op.eq]: req.body.email }
            }
        })
        if (existUser) {
            return res.status(400).send({ message: "Email Telah Terdaftar!" })
        }
        let userCode = null;
        const lastRecordDonor = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                role: { [Op.eq]: "donor" }
            },
            order: [['id', 'DESC']] // Assuming 'id' is an auto-incrementing primary key
        });

        const lastRecordFoundation = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                role: { [Op.eq]: "foundation" }
            },
            order: [['id', 'DESC']] // Assuming 'id' is an auto-incrementing primary key
        });

        if (lastRecordDonor) {
            userCode = lastRecordDonor.code.includes("donor-") ? `donor-${+lastRecordDonor.code.split("-")[1] + 1}` : 'donor-001'
        }
        if (lastRecordFoundation) {
            userCode = lastRecordDonor.code.includes("foundation-") ? `foundation-${+lastRecordDonor.code.split("-")[1] + 1}` : 'foundation-001'
        }
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)
        // const salt = await bcrypt.genSalt(10)
        // const password = await bcrypt.hash(req.body.password, salt)
        const payload = {
            ...req.body,
            password: password,
            code: userCode || (req.body.role == 'donor' ? 'donor-001' : req.body.role == 'foundation' ? 'foundation-001' : 'admin'),
            verified: 0
        };
        const result = await users.create(payload)
        return res.status(200).send({
            status: "success",
            items: result,
            code: 200
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server mengalami gangguan!", error: error })
        return
    }
};

exports.update = async (req, res) => {
    try {
        const result = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id },
                email: { [Op.eq]: req.body.email }
            }
        })
        if (!result) {
            return res.status(400).send({ message: "Data tidak ditemukan!" })
        }
        let payload = {
            ...req.body,
            updated_on: new Date()
        }
        const onUpdate = await users.update(payload, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        res.status(200).send({ message: "Berhasil ubah data", update: onUpdate })
        return
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}

exports.delete = async (req, res) => {
    try {
        const result = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.query.id }
            }
        })
        if (!result) {
            return res.status(404).send({ message: "Data tidak ditemukan!" })
        }
        await users.update({ deleted: 1 }, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.query.id }
            }
        })
        res.status(200).send({ message: "Berhasil hapus data" })
        return
    } catch (error) {
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}

exports.login = async (req, res) => {
    try {
        const { identity, password } = req.body;
        if (!identity || !password) {
            return res.status(404).send({ message: "Masukkan Email / No Telepon dan Password!" })
        }
        const result = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                status: { [Op.eq]: 1 },
                verified: { [Op.eq]: 1 },
                [Op.or]: {
                    phone: req.body.identity,
                    email: req.body.identity
                }
            },
        })
        if (!result) {
            return res.status(404).send({ message: "Akun Belum Terdaftar!" })
        }
        const isCompare = await bcrypt.compare(password, result.password)
        if (!isCompare) {
            return res.status(404).send({ message: "Password Salah!" })
        }
        const result2 = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                status: { [Op.eq]: 1 },
                [Op.or]: {
                    phone: req.body.identity,
                    email: req.body.identity
                },
            },
            attributes: { exclude: ['deleted', 'password'] },
        })
        return res.status(200).send({ message: "Berhasil Login", user: result2 })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}

exports.loginbygoogle = async (req, res) => {
    try {
        const { email, phoneNumber, uid, displayName, photoURL } = req.body;
        if (!email || !uid) {
            return res.status(400).send({ message: "Parameter tidak lengkap!" })
        }
        const result = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                status: { [Op.eq]: 1 },
                email: { [Op.eq]: email },
                google_id: { [Op.eq]: uid }
            },
        })
        const payload = {
            ...req.body,
            google_id: uid,
            name: displayName,
        };
        const existEmail = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                status: { [Op.eq]: 1 },
                email: { [Op.eq]: email }
            },
        })
        if (existEmail) {
            await users.update({ google_id: uid }, {
                where: {
                    deleted: { [Op.eq]: 0 },
                    id: { [Op.eq]: existEmail.id }
                }
            })
        }
        let newUser = null;
        if (!result && !existEmail) {
            newUser = await users.create(payload)
        }
        return res.status(200).send({ message: "Berhasil Login", user: result || existEmail || newUser })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}

exports.verificationResetPassword = async (req, res) => {
    try {
        const result = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id },
                email: { [Op.eq]: req.body.email },
                reset_otp: { [Op.eq]: req.body.otp },
            }
        })
        if (!result) {
            return res.status(400).send({ message: "Kode OTP Salah!" })
        }
        const onUpdate = await users.update({
            reset_otp: null
        }, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        res.status(200).send({ message: "Verifikasi Berhasil", update: onUpdate })
        return
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}

exports.verificationOTP = async (req, res) => {
    try {
        const result = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id },
                email: { [Op.eq]: req.body.email },
                otp: { [Op.eq]: req.body.otp },
            }
        })
        if (!result) {
            return res.status(400).send({ message: "Kode OTP Salah!" })
        }
        if (Date.now() > result.otp_expired) {
            return res.status(400).send({ message: "Kode OTP Telah Kadaluwarsa!" })
        }
        const onUpdate = await users.update({
            otp: null,
            otp_expired: null,
            verified: 1
        }, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        await login_histories.create({ user_id: result.id, user_name: result.name })
        res.status(200).send({ message: "Verifikasi Berhasil", update: onUpdate })
        return
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}