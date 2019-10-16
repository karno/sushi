import SushiInfo from './SushiInfo';

const MENU_FILE = "sushiro_menu.json";

export async function FetchSushiInfo(): Promise<SushiInfo[]> {
    const resp = await fetch(MENU_FILE);
    const json = await resp.json();
    return Object.keys(json)
        .flatMap(c => json[c].map((item: any): SushiInfo => {
            return {
                category: c,
                cat_id: item.cat,
                ...item
            }
        }))

}
