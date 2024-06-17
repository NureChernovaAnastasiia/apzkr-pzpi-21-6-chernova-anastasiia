const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" }
});

const Basket = sequelize.define('Basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

const BasketTicket = sequelize.define('BasketTicket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    basketId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Baskets', key: 'id' } },
    ticketId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Tickets', key: 'id' } }
});

const Movie = sequelize.define('Movie', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    duration: { type: DataTypes.TIME, allowNull: false },
    genre: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT },
    posterURL: { type: DataTypes.STRING },
    trailerURL: { type: DataTypes.STRING }
});

const Seat = sequelize.define('Seat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rowNumber: { type: DataTypes.INTEGER, allowNull: false },
    seatNumber: { type: DataTypes.INTEGER, allowNull: false },
    hallId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Halls', key: 'id' } }
});

const Hall = sequelize.define('Hall', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    totalSeats: { type: DataTypes.INTEGER, allowNull: false }
});

const Schedule = sequelize.define('Schedule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    movieId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Movies', key: 'id' } },
    hallId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Halls', key: 'id' } },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false }
});

const Ticket = sequelize.define('Ticket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    scheduleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Schedules', key: 'id' } },
    seatId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Seats', key: 'id' } },
    basketId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Baskets', key: 'id' } },
    purchaseDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role: { type: DataTypes.STRING, allowNull: false },
    hireDate: { type: DataTypes.DATEONLY, allowNull: false },
    photo: {type: DataTypes.STRING }
});

const FoodMenuItem = sequelize.define('FoodMenuItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    imgURL: { type: DataTypes.STRING }
});


const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
    movieId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Movies', key: 'id' } },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    comment: { type: DataTypes.TEXT }
});

User.hasOne(Basket);
Basket.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Review);
Review.belongsTo(User);

Movie.hasMany(Schedule);
Schedule.belongsTo(Movie);

Movie.hasMany(Review);
Review.belongsTo(Movie);

Hall.hasMany(Schedule);
Schedule.belongsTo(Hall);

Hall.hasMany(Seat, { foreignKey: 'hallId' });
Seat.belongsTo(Hall, { foreignKey: 'hallId' });

Schedule.hasMany(Ticket);
Ticket.belongsTo(Schedule);


Basket.belongsToMany(Ticket, { through: BasketTicket });
Ticket.belongsToMany(Basket, { through: BasketTicket });

Ticket.belongsTo(Seat);
Seat.hasMany(Ticket, { foreignKey: 'seatId' });

module.exports = {
    User,
    Basket,
    BasketTicket,
    Movie,
    Hall,
    Seat,
    Ticket,
    Employee,
    FoodMenuItem,
    Review,
    Schedule
};
