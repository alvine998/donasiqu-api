const db = require('../models')
const news = db.news
const categories = db.categories
const Op = db.Sequelize.Op
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const size = +req.query.size || 10;
        const page = +req.query.page || 0;
        const offset = size * page;

        const result = await news.findAndCountAll({
            where: {
                ...req.query.id && { id: { [Op.eq]: req.query.id } },
                ...req.query.slug && { slug: { [Op.eq]: req.query.slug } },
                ...req.query.category_id && { category_id: { [Op.eq]: req.query.category_id } },
                ...req.query.category_name && { category_name: { [Op.eq]: req.query.category_name } },
                ...req.query.headline && { headline: { [Op.eq]: req.query.headline } },
                ...req.query.breaking_news && { breaking_news: { [Op.eq]: req.query.breaking_news } },
                ...req.query.status && { status: { [Op.eq]: req.query.status } },
                ...req.query.start_date && req.query.end_date && { published_at: { [Op.between]: [req.query.start_date + " 00:00:00", req.query.end_date + " 23:59:59"] } },
                ...req.query.start_date && !req.query.end_date && { published_at: { [Op.gte]: req.query.start_date + " 00:00:00" } },
                ...req.query.end_date && !req.query.start_date && { published_at: { [Op.lte]: req.query.end_date + " 23:59:59" } },
                ...req.query.search && {
                    [Op.or]: [
                        { title: { [Op.like]: `%${req.query.search}%` } },
                        { author: { [Op.like]: `%${req.query.search}%` } },
                        { editor: { [Op.like]: `%${req.query.search}%` } },
                    ]
                },
            },
            order: [
                req.query.popular == '1' ? ['viewers', 'DESC'] : ['createdAt', 'DESC'],
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
        // const requiredFields = ['title', 'slug', 'category_id', 'headline', 'author', 'editor', 'content', 'published_at', 'breaking_news', 'status'];
        // console.log(req.body,'obdy');
        // for (const field of requiredFields) {
        //     if (!req.body[field]) {
        //         return res.status(400).send({
        //             status: "error",
        //             error_message: "Parameter tidak lengkap: " + field,
        //             code: 400
        //         });
        //     }
        // }


        const category = await categories.findOne({
            where: {
                deletedAt: { [Op.is]: null },
                id: { [Op.eq]: req.body.category_id },
            }
        })
        if (!category) {
            return res.status(400).send({ message: "Data tidak ditemukan!" })
        }

        const payload = {
            ...req.body,
            category_name: category?.name
        };
        const result = await news.create(payload)
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
        const result = await news.findOne({
            where: {
                deletedAt: { [Op.is]: null },
                id: { [Op.eq]: req.body.id },
            }
        })
        if (!result) {
            return res.status(400).send({ message: "Data tidak ditemukan!" })
        }

        let category = null;
        if (req.body.category_id) {
            const category = await categories.findOne({
                where: {
                    deletedAt: { [Op.is]: null },
                    id: { [Op.eq]: req.body.category_id },
                }
            })
            if (!category) {
                return res.status(400).send({ message: "Data tidak ditemukan!" })
            }
        }

        let payload = {}
        payload = {
            ...req.body,
            updated_at: new Date(),
            ...req.body.category_id && { category_name: category?.name }
        }
        const onUpdate = await news.update(payload, {
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
        const result = await news.findOne({
            where: {
                deletedAt: { [Op.is]: null },
                id: { [Op.eq]: req.query.id }
            }
        })
        if (!result) {
            return res.status(404).send({ message: "Data tidak ditemukan!" })
        }
        await news.update({ deletedAt: new Date() }, {
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