const db = require('../models')
const kurs = db.kurs
const Op = db.Sequelize.Op
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const size = +req.query.size || 10;
        const page = +req.query.page || 0;
        const offset = size * page;

        const result = await kurs.findAndCountAll({
            where: {
                ...req.query.id && { id: { [Op.eq]: req.query.id } },
                ...req.query.date && { date: { [Op.eq]: req.query.date } },
                ...req.query.search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${req.query.search}%` } },
                    ]
                },
            },
            order: [
                ['createdAt', 'DESC'],
            ],
            attributes: { exclude: ['deletedAt'] },
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
        ['date', 'idr', 'eur', 'jpy', 'cny', 'aud', 'krw', 'myr']?.map(value => {
            if (!req.body[value]) {
                return res.status(400).send({
                    status: "error",
                    error_message: "Parameter tidak lengkap " + value,
                    code: 400
                })
            }
        })
        const payload = {
            ...req.body,
        };
        const result = await kurs.create(payload)
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
        const result = await kurs.findOne({
            where: {
                deletedAt: { [Op.is]: null },
                id: { [Op.eq]: req.body.id },
            }
        })
        if (!result) {
            return res.status(400).send({ message: "Data tidak ditemukan!" })
        }
        let payload = {}
        payload = {
            ...req.body,
            updated_at: new Date()
        }
        const onUpdate = await kurs.update(payload, {
            where: {
                deletedAt: { [Op.is]: null },
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
        const result = await kurs.findOne({
            where: {
                deletedAt: { [Op.is]: null },
                id: { [Op.eq]: req.query.id }
            }
        })
        if (!result) {
            return res.status(404).send({ message: "Data tidak ditemukan!" })
        }
        await kurs.update({ deletedAt: new Date() }, {
            where: {
                deletedAt: { [Op.is]: null },
                id: { [Op.eq]: req.query.id }
            }
        })
        res.status(200).send({ message: "Berhasil hapus data" })
        return
    } catch (error) {
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}