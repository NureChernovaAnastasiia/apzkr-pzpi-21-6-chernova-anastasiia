import { makeAutoObservable } from "mobx";
//тестування
export default class MovieCinema {
    constructor() {
        this._movie = [
            {
                id: 1,
                title: 'Dune',
                description: 'A science fiction novel adaptation',
                duration: '02:00:00',
                genre: 'drama',
                rating: 7.5,
                posterURL: 'https://upload.wikimedia.org/wikipedia/ru/thumb/6/61/%D0%94%D1%8E%D0%BD%D0%B0_%E2%80%94_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D1%8F_%28%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80%29.jpg/640px-%D0%94%D1%8E%D0%BD%D0%B0_%E2%80%94_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D1%8F_%28%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80%29.jpg',
                trailerURL: 'https://youtu.be/tKM44vPHU0U?si=9WqtCvpMxQ_A7K7U'
            },
            {
                id: 2,
                title: 'WAKE',
                description: 'A comedy movie',
                duration: '03:00:00',
                genre: 'comedy',
                rating: 6.0,
                posterURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQppQ3GGU10vyVMqZXHFmyddz7FEks_J33UHA&s',
                trailerURL: 'https://youtu.be/tKM44vPHU0U?si=9WqtCvpMxQ_A7K7U'
            }
        ];
        this._cinema = [
            {
                id: 1,
                name: 'Multiplex',
                address: 'Main Street',
                city: 'Kharkiv',
                country: 'Ukraine'
            }
        ];
        this._hall = [
            { id: 1, name: 'Red', totalSeats: 213 },
            { id: 2, name: 'Green', totalSeats: 50 }
        ];
        this._showing = [
            { id: 1, cinemaId:1, movieId: 1, hallId: 1, startTime: '14:21', endTime: '16:43', date: '2024-08-01' },
            { id: 2, cinemaId:1, movieId: 1, hallId: 2, startTime: '17:00', endTime: '19:22', date: '2024-09-01' },
            { id: 3, cinemaId:1, movieId: 2, hallId: 1, startTime: '20:00', endTime: '22:22', date: '2024-06-01' }
        ];
        makeAutoObservable(this);
    }

    setMovie(movie) {
        this._movie = movie;
    }

    setCinema(cinema) {
        this._cinema = cinema;
    }

    setHall(hall) {
        this._hall = hall;
    }

    setShowing(showing) {
        this._showing = showing;
    }

    get Movie() {
        return this._movie;
    }

    get Cinema() {
        return this._cinema;
    }

    get Hall() {
        return this._hall;
    }

    get Showing() {
        return this._showing;
    }

    getSchedule() {
        return this._showing.map(showing => ({
            id: showing.id,
            movie: this._movie.find(movie => movie.id === showing.movieId),
            cinema: this._cinema[0], // Поки що використовуємо перший кінотеатр
            hall: this._hall.find(hall => hall.id === showing.hallId),
            startTime: showing.startTime,
            endTime: showing.endTime,
            date: showing.date // Використовуємо передану дату
        }));
    }
}