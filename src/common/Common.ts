import SushiInfo from './SushiInfo';
import MersenneTwister from 'mersenne-twister';

const MENU_FILE = "sushiro_menu.json";
const MT_GENERATOR = new MersenneTwister();

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

export async function Timeout(msec: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, msec));
}

export function SelectRandom<T>(list: T[]): T {
    if (MT_GENERATOR) {
        return list[Math.floor(MT_GENERATOR.random() * list.length)]
    } else {
        // failed reading MT?
        return list[Math.floor(Math.random() * list.length)]
    }
}