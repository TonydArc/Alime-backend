const Anime = require('../models/Anime');

const getAnimeList = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'updatedAt';
        // Với 'asc' là sắp xếp tăng dần, default là -1 (desc) tức mới cập nhật
        const sortOrder = req.query.order === 'asc' ? 1 : -1;

        const genreFilter = req.query.genre || null;
        const yearFilter = req.query.year || null;

        let matchStage = {};
        if (yearFilter) {
            // Sử dụng regex với ranh giới từ để khớp chính xác năm ở bất kỳ vị trí nào trong chuỗi
            matchStage.premiered = { $regex: `\\b${yearFilter}\\b`, $options: 'i' };
        }

        // Xử lý tham số thể loại: Nếu có nhiều thể loại (phân cách bởi dấu phẩy) thì chuyển thành mảng
        let genreArray = [];
        if (genreFilter) {
            genreArray = genreFilter.split(',').map(g => g.trim());
        }

        // Aggregation pipeline với $lookup để join dữ liệu
        const result = await Anime.aggregate([
            {
                $lookup: {
                    from: 'animegenres',
                    localField: '_id',
                    foreignField: 'animeId',
                    as: 'animeGenres'
                }
            },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'animeGenres.genreId',
                    foreignField: '_id',
                    as: 'genres'
                }
            },
            // Áp dụng bộ lọc năm nếu có
            { $match: matchStage },
            // Nếu có genre (có thể là một hoặc nhiều giá trị) đưa vào bộ lọc
            ...(genreArray.length ? [{ $match: { 'genres.genreName': { $in: genreArray } } }] : []),
            // Loại bỏ các trường không cần thiết (ví dụ: animeGenres)
            {
                $project: {
                    animeGenres: 0,
                    genres: 0
                }
            },
            // Sắp xếp các kết quả theo trường và thứ tự mong muốn
            { $sort: { [sortBy]: sortOrder } },
            // Chia kết quả thành 2 phần: metadata (đếm tổng số) và data (phân trang)
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            }
        ]);

        // Lấy thông tin metadata, nếu không có dữ liệu thì mặc định total là 0
        const metadata = result[0].metadata[0] || { total: 0 };
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
        console.error('Lỗi khi lấy anime:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi truy xuất dữ liệu.'
        });
    }
};

const getAimeDetail = async (req, res) => {
    const animeSlug = req.query.animeslug;

    if (!animeSlug) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu tham số slug',
        });
    };

    try {
        const result = await Anime.aggregate([
            {
                $match: { slug: animeSlug }
            },
            {
                $lookup: {
                    from: 'animegenres',
                    localField: '_id',
                    foreignField: 'animeId',
                    as: 'animeGenres'
                }
            },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'animeGenres.genreId',
                    foreignField: '_id',
                    as: 'genres'
                }
            },
            {
                $lookup: {
                    from: 'episodes',
                    localField: '_id',
                    foreignField: 'animeId',
                    as: 'episodes'
                }
            },
            {
                $project: {
                    animeGenres: 0
                }
            }
        ])

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy anime với slug đã cho',
            });
        }

        return res.status(200).json({
            success: true,
            data: result[0],
        });

    } catch (error) {
        console.error('Lỗi khi lấy chi tiết anime:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi truy xuất dữ liệu.',
        });
    }
};

const getAnimeBySerie = async (req, res) => {
    const seriesSlug = req.query.seireslug;
    if (!seriesSlug) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu tham số series slug',
        });
    }

    // Tham số phân trang mặc định
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Tham số sắp xếp: mặc định theo 'updatedAt'
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    try {
        const result = await Anime.aggregate([

            {
                $lookup: {
                    from: 'series',
                    localField: 'series',
                    foreignField: '_id',
                    as: 'seriesdata'
                }
            },
            {
                $match: { 'seriesdata.slug': seriesSlug }
            },
            { $sort: { [sortBy]: sortOrder } },
            {
                $project: {
                    seriesdata: 0
                }
            },
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            }
        ]);


        const metadata = result[0].metadata[0] || { total: 0 };
        if (metadata.total === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy anime nào với series slug đã cho',
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
        console.error('Lỗi khi lấy anime theo series slug:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi truy xuất dữ liệu.'
        });
    }
};

const createAnime = async (req, res) => {

};


module.exports = { getAnimeList, getAimeDetail, getAnimeBySerie, createAnime };