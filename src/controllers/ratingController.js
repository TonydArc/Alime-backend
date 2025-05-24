const Rating = require('../models/Rating');

const getRatingByAnime = async (req, res) => {
    const animeslug = req.query.animeslug;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    if (!animeslug) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu tham số animeslug',
        });
    };

    try {
        const result = await Rating.aggregate([
            // Bước 1: Join với collection animes dựa vào animeId
            {
                $lookup: {
                    from: 'animes',
                    localField: 'animeId',
                    foreignField: '_id',
                    as: 'anime'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            // Bước 2: Dùng $unwind để chuyển mảng "anime" thành đối tượng duy nhất
            // { $unwind: '$anime' },
            { $unwind: '$user' },
            // Bước 3: Lọc các rating có anime.slug khớp với animeslug được truyền vào
            { $match: { 'anime.slug': animeslug } },
            // Bước 4: Sắp xếp kết quả theo tham số sortBy, sortOrder
            { $sort: { [sortBy]: sortOrder } },
            {
                $project: {
                    anime: 0,
                    "user._id": 0,
                    "user.role": 0,
                    "user.passwordHash": 0,
                    "user.email": 0,
                    "user.__v": 0,
                    "user.createdAt": 0,
                    "user.updatedAt": 0
                }
            },
            // Bước 5: Phân trang với $facet
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            },
        ]);

        const metadata = result[0].metadata[0] || { total: 0 };
        if (metadata.total === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy rating nào với animeslug đã cho',
            });
        }

        const totalPages = Math.ceil(metadata.total / limit);

        return res.status(200).json({
            success: true,
            data: result[0].data,
            metadata: {
                total: metadata.total,
                page,
                limit,
                totalPages
            }
        });

    } catch (error) {
        console.error('Lỗi khi lấy rating theo animeslug:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi truy xuất dữ liệu.'
        });
    }
};


module.exports = { getRatingByAnime };