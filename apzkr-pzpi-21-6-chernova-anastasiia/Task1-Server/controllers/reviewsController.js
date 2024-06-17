const { Review } = require('../models/models');
const ApiError = require('../error/ApiError');
const nodemailer = require('nodemailer');

class ReviewsController {
  async create(req, res, next) {
    const { userId, movieId, rating, comment } = req.body;
    try {
      const review = await Review.create({ userId, movieId, rating, comment });
      
      // Відправка листа з рев'ю
      await sendReviewEmail(userId, movieId, rating, comment);

      return res.json(review);
    } catch (e) {
      next(ApiError.internal('Error creating review'));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      const review = await Review.findByPk(id);
      if (!review) {
        return next(ApiError.badRequest('Review not found'));
      }
      await review.destroy();
      return res.json({ message: 'Review deleted' });
    } catch (e) {
      next(ApiError.internal('Error deleting review'));
    }
  }

  async getAll(req, res, next) {
    try {
      const reviews = await Review.findAll();
      return res.json(reviews);
    } catch (e) {
      next(ApiError.internal('Error fetching reviews'));
    }
  }
}

// Функція для відправки електронної пошти з рев'ю
async function sendReviewEmail(userId, movieId, rating, comment) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          user: 'karvatnasta@gmail.com',
          pass: 'oyzy gjqn dttv xshl'
      }
  });

    let mailOptions = {
      from: 'karvatnasta@gmail.com', 
      to: 'anastasiia.chernova@nure.ua',
      subject: 'New Review Added',
      text: `Hello CineMagic Team,
    
    I have just added a new review to the system, and I wanted to share the details with you:
    
    Movie ID: ${movieId}
    User ID: ${userId}
    Rating: ${rating}/10
    Comment: ${comment}
    
    I hope this review helps other users in making their viewing choices. If there are any issues or if you need further information, please feel free to contact me.
    
    Thank you for providing such a great platform for movie enthusiasts.
    
    Best regards,
    User ID: ${userId}`
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = new ReviewsController();
