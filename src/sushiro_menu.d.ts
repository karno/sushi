declare module './sushiro_menu.json' {
    interface SushiMenu {
        name: string;
        price: number;
        energy: number;
        link: string;
        id: number;
        cat: number;
        [key: string]: any;
    }

    interface Categories {
        [key: string]: SushiMenu[];
    }

    const value: Categories;

    export default value;
}
