import SushiInfo from './SushiInfo';

const TWITTER_MAX = 280;
const SOURCE_URL = "https://celestian.io/ssr/";
const HASHTAG = "スシローガチャ";

const strByteLen = (s: string): number => s.split('')
    .map(c => c.charCodeAt(0))
    .map(c => (
        (c >= 0x0 && c < 0x81) ||
        (c === 0xf8f0) ||
        (c >= 0xff61 && c < 0xffa0) ||
        (c >= 0xf8f1 && c < 0xf8f4))
        ? 1 : 2)
    .reduce((x, y) => x + y, 0);

export function BuildShareText(sushies: SushiInfo[]): string {
    if (sushies.length == 0) return "";
    const preamble = "🍣スシローガチャ🍣";

    const totalPrice = sushies.map(s => s.price).reduce((x, y) => x + y, 0);
    const totalEnergy = sushies.map(s => s.energy).reduce((x, y) => x + y, 0);
    const total = `合計 ${totalPrice}円, ${totalEnergy}kcal`;
    const postamble = `${SOURCE_URL} #${HASHTAG}`;

    let commitSushi = preamble;
    for (let i = 0; i < sushies.length; ++i) {
        const remain = sushies.length - i - 1;
        const ellipsis = remain > 0 ? `ほか ${remain}皿` : "";
        const sushiName = `・${sushies[i].name} `;
        const s = [commitSushi, sushiName, total, ellipsis, postamble];
        if (strByteLen(s.join("\n")) >= TWITTER_MAX) {
            commitSushi += '\n' + ellipsis;
            break;
        }
        commitSushi += '\n' + sushiName;
    }
    return commitSushi + "\n" + total;
}

export function PostTwitter(sushies: SushiInfo[]) {
    if (sushies.length == 0) return;

    const url = "https://twitter.com/intent/tweet?" + [
        "text=" + encodeURIComponent(BuildShareText(sushies)),
        "url=" + encodeURIComponent(SOURCE_URL),
        "hashtags=" + encodeURIComponent(HASHTAG)
    ].join("&");
    if (window.open(url) === null) {
        window.location.href = url;
    }
}

export function PostMastodon(sushies: SushiInfo[]) {
    if (sushies.length == 0) return;

    const text = [BuildShareText(sushies), "#" + HASHTAG].join(" ");
    const url = "https://mastoshare.net/post.php?text=" + encodeURIComponent(text);
    if (window.open(url) === null) {
        window.location.href = url;
    }

}