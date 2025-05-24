const Comment = require('../models/Comment');

const getCommentByEpisode = async (req, res) => {
    const episodeslug = req.query.episodeslug;

    // Các tham số phân trang và sắp xếp
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    if (!episodeslug) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu tham số episodeslug',
        });
    };

    try {
        const result = await Comment.aggregate([
            {
                $lookup: {
                    from: 'episodes',
                    localField: 'episodeId',
                    foreignField: '_id',
                    as: 'episode'
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
            { $unwind: '$episode' },
            { $unwind: '$user' },
            { $match: { 'episode.slug': episodeslug } },
            { $sort: { [sortBy]: sortOrder } },
            {
                $project: {
                    episode: 0,
                    "user._id": 0,
                    "user.role": 0,
                    "user.passwordHash": 0,
                    "user.email": 0,
                    "user.__v": 0,
                    "user.createdAt": 0,
                    "user.updatedAt": 0
                }
            },
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
                message: 'Không tìm thấy comment nào cho episodeslug đã cho',
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
        console.error('Lỗi khi lấy comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi truy xuất dữ liệu.',
        });
    }
};

module.exports = { getCommentByEpisode };
