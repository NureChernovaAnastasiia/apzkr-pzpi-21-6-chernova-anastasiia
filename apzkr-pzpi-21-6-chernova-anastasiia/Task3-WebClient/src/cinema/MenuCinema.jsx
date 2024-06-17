import { makeAutoObservable } from "mobx";
//тестування
export default class MenuCinema {
    constructor() {
        this._menu = [
            {
                id: 1,
                name:'Popcorn',
                description:'small',
                price: 40,
                imgURL: "https://mycandle.com.ua/images/detailed/2/popkorn-min.jpg"
            },
            {
                id: 2,
                name:'Coca-Cola',
                description:'0.5',
                price: 30,
                imgURL: "https://www.coca-cola.com/content/dam/onexp/by/be/brands/coca-cola/by_coca-cola_prod_classic_750x750_v2.jpg"
            }
        ];


        makeAutoObservable(this);
    }

    setMenu(menu) {
        this._movie = movie;
    }


    get Menu() {
        return this._menu;
    }
}