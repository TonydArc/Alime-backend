// seed.js
const mongoose = require('mongoose');

// Import các model (đường dẫn dưới đây cần được điều chỉnh theo cấu trúc dự án của bạn)
const User = require('./src/models/User');
const Genre = require('./src/models/Genre');
const Series = require('./src/models/Serie');
const Anime = require('./src/models/Anime');
const AnimeGenre = require('./src/models/AnimeGenre');
const Episode = require('./src/models/Episode');
const Comment = require('./src/models/Comment');
const Favorite = require('./src/models/Favorite');
const History = require('./src/models/History');
const Rating = require('./src/models/Rating');

// Kết nối đến MongoDB (điều chỉnh connection string nếu cần)
mongoose
  .connect('mongodb://localhost:27017/alime')
  .then(() => {
    console.log('Kết nối đến MongoDB thành công!');
    seedData(); // Gọi hàm seed sau khi kết nối thành công
  })
  .catch((err) => {
    console.error('Lỗi kết nối:', err);
  });

// Hàm seed dữ liệu mẫu
async function seedData() {
  try {

    // 1. Tạo sample Users
    const users = await User.insertMany([
      {
        username: 'Caim',
        email: 'johnafs@example.com',
        passwordHash: 'hashedpassword1',
        role: 'admin',
      },
      {
        username: 'rosengartenfan',
        email: 'annaasf@example.com',
        passwordHash: 'hashedpassword2',
        role: 'user',
      },
    ]);
    console.log('Seed Users thành công!', users);

    // 2. Tạo sample Genres
    // const genres = await Genre.insertMany([
    //   { genreName: 'Action', description: 'Hành động mãn nhãn' },
    //   { genreName: 'Adventure', description: 'Phiêu lưu kỳ thú' },
    //   { genreName: 'Fantasy', description: 'Thế giới huyền ảo' },
    // ]);
    // console.log('Seed Genres thành công!', genres);

    // 3. Tạo sample Series
    const seriesList = await Series.insertMany([
      { name: 'Bleach Series', description: 'Series của bộ truyện Bleach' },
    ]);
    console.log('Seed Series thành công!', seriesList);

    // 4. Tạo sample Anime
    const animes = await Anime.insertMany([
      {
        name: 'Bleach',
        slug: 'bleach',
        description: 'day la zanpacuto cua tao. tram nguyet',
        studios: 'dellbik',
        type: 'TV',
        premiered: '1999-10-20',
        episodes: 1000,
        currentEpisodes: 1000,
        thumbnailPublicId: 'sample-thumbnail-onepiece',
        createdBy: users[0]._id, // sử dụng user đầu tiên làm người tạo
        views: 100000,
        rate: 8.5,
        ratedCount: 5000,
        status: 'ongoing',
        series: seriesList[0]._id,
      },
    ]);
    console.log('Seed Anime thành công!', animes);

    // 5. Tạo sample AnimeGenre (quan hệ giữa Anime và Genre)
    const animeGenres = await AnimeGenre.insertMany([
      { animeId: animes[0]._id, genreId: genres[0]._id }, // Liên kết với genre "Action"
      { animeId: animes[0]._id, genreId: genres[1]._id }, // Liên kết với genre "Adventure"
      // Bạn có thể thêm các mối quan hệ khác nếu cần
    ]);
    console.log('Seed AnimeGenre thành công!', animeGenres);

    // 6. Tạo sample Episode
    // const episodes = await Episode.insertMany([
    //   {
    //     animeId: animes[0]._id,
    //     title: 'Chapter 1: I’m Luffy! The Man Who Will Become the Pirate King!',
    //     slug: 'chapter-1-im-luffy-the-man-who-will-become-the-pirate-king',
    //     videoPublicId: 'sample-video-onepiece-ep1',
    //     duration: 1500, // thời lượng tính bằng giây
    //     views: 20000,
    //     uploadedBy: users[1]._id, // sử dụng user thứ hai làm uploader
    //   },
    // ]);
    // console.log('Seed Episodes thành công!', episodes);

    // 7. Tạo sample Comment
    // const comments = await Comment.insertMany([
    //   {
    //     episodeId: episodes[0]._id,
    //     userId: users[1]._id,
    //     content: 'Tập mở đầu thật ấn tượng!',
    //   },
    // ]);
    // console.log('Seed Comments thành công!', comments);

    // 8. Tạo sample Favorite
    // const favorites = await Favorite.insertMany([
    //   {
    //     userId: users[1]._id,
    //     animeId: animes[0]._id,
    //   },
    // ]);
    // console.log('Seed Favorites thành công!', favorites);

    // 9. Tạo sample History (lịch sử xem)
    // const histories = await History.insertMany([
    //   {
    //     userId: users[1]._id,
    //     episodeId: episodes[0]._id,
    //     progress: 75, // phần trăm đã xem
    //   },
    // ]);
    // console.log('Seed Histories thành công!', histories);

    // 10. Tạo sample Rating
    // const ratings = await Rating.insertMany([
    //   {
    //     userId: users[1]._id,
    //     animeId: animes[0]._id,
    //     content: 'Rất hay và lôi cuốn, cần theo dõi tiếp!',
    //     score: 9,
    //   },
    // ]);
    // console.log('Seed Ratings thành công!', ratings);

    console.log('Seed dữ liệu mẫu hoàn tất!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Lỗi trong quá trình seed dữ liệu:', error);
    mongoose.connection.close();
  }
}
