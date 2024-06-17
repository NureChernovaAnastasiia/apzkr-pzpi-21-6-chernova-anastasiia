import { ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, BASKET_ROUTE, MOVIE_ROUTE, CINEMA_HALL_ROUTE, FEEDBACK_ROUTE, RECOMMENDATIONS_ROUTE, SCHEDULE_ROUTE, MENU_ROUTE, TICKET_LIST_ROUTE, HALLS_MANAGMENT_ROUTE, EMPLOYEES_ROUTE, CINEMA_ROUTE} from "./utils/consts";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Basket from "./pages/Basket";
import Movie from "./pages/MovieDetails";
import FeedbackForm from "./pages/FeedbackForm";
import Recommendations from "./pages/Recommendations";
import Schedule from "./pages/Schedule";
import TicketList from "./pages/TicketList";
import CinemaHome from "./pages/Cinema";
import CinemaHall from "./pages/CinemaHall";
import Menu from "./pages/Menu";
import HallsManagement from "./pages/HallsManagement";
import EmployeesPage from "./pages/Employees";

export const authRoutes = [
    { path: ADMIN_ROUTE, Component: Admin },
    { path: BASKET_ROUTE, Component: Basket },
    { path: FEEDBACK_ROUTE, Component: FeedbackForm },
    { path: RECOMMENDATIONS_ROUTE, Component: Recommendations },
    { path: TICKET_LIST_ROUTE, Component: TicketList },
    { path: `${CINEMA_HALL_ROUTE}/:id/:scheduleId`, Component: CinemaHall },
    { path: HALLS_MANAGMENT_ROUTE, Component: HallsManagement },
    { path: EMPLOYEES_ROUTE, Component: EmployeesPage},
];

export const publicRoutes = [
    { path: LOGIN_ROUTE, Component: Auth },
    { path: REGISTRATION_ROUTE, Component: Auth },
    { path: `${MOVIE_ROUTE}/:id`, Component: Movie },
    { path: SCHEDULE_ROUTE, Component: Schedule },
    { path: MENU_ROUTE, Component: Menu },
    { path: CINEMA_ROUTE, Component: CinemaHome },
]; 
