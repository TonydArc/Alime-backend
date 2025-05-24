const Episode = require('../models/Episode')

const getEpisode = async (req, res) => {
    // Lấy tham số episodeslug từ query
    const episodeslug = req.query.episodeslug;

    if (!episodeslug) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu tham số slug',
        });
    };

    try {
        // Sử dụng aggregation pipeline chỉ với $match để lọc document có slug khớp với episodeslug
        const result = await Episode.aggregate([
            { $match: { slug: episodeslug } }
        ]);

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy episode với slug đã cho',
            });
        }

        return res.status(200).json({
            success: true,
            data: result[0],
        });

    } catch (error) {
        console.error('Lỗi khi lấy chi tiết episode:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi truy xuất dữ liệu.',
        });
    }
};

module.exports = { getEpisode };
