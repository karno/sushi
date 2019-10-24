import React, { useState, useEffect } from 'react';
import SushiInfo from './common/SushiInfo';
import { Timeout, SelectRandom } from './common/Common';
import { PostTwitter } from './common/Twitter';
import './SushiSlot.css';

interface SushiSingleSlotProps {
    sushies: SushiInfo[],
    sushi: SushiInfo,
    delay: number,
    delayEnabled: boolean,
    onCompleted?: () => void,
}

const SushiSingleSlot: React.FC<SushiSingleSlotProps> = props => {
    const [sushi, setSushi] = useState<SushiInfo | undefined>(undefined);
    const setRandomSushi = (category: string | undefined = undefined) => {
        if (category === undefined) {
            setSushi(SelectRandom(props.sushies));
        } else {
            setSushi(SelectRandom(props.sushies.filter(s => s.category === category)));
        }
    };
    useEffect(() => {
        // fetch menu
        let recall = false;
        (async () => {
            // awaiting other slots
            const delay = props.delayEnabled ? (props.delay) : 0;
            for (let _ of [...Array(delay * 80 + 40)]) {
                await Timeout(10);
                setRandomSushi();
            }
            // slotting in the category
            for (let _ of [...Array(40)]) {
                await Timeout(10);
                setRandomSushi(props.sushi.category);
            }
            setSushi(props.sushi);
            if (!recall && props.onCompleted) {
                props.onCompleted();
            }
        })();
        return () => { recall = true; }
    }, [props.sushi]);
    if (sushi === undefined) {
        return <p></p>;
    }
    return (
        <div className="Sushi">
            <div className="SushiCategory">{sushi.category}</div>
            <div className="SushiName">{sushi.name}</div>
            <div className="SushiEnergy">{sushi.energy}kcal</div>
            <div className="SushiPrice">{sushi.price}円</div>
        </div>);
}

interface SushiSlotProps {
    sushies: SushiInfo[]
}

export const SushiSlot: React.FC<SushiSlotProps> = props => {

    const DrawSingle = () => Draw(1);
    const DrawQuintuple = () => Draw(5);
    const DrawDecuple = () => Draw(10);

    const DrawAppendOne = () => {
        Draw(1, true);
    };

    const Draw = (n: number, append: boolean = false) => {
        setDelayEnabled(!append);
        setDisplayFooter(false);
        if (props.sushies.length == 0) {
            if (!append) {
                setSlots([]);
            }
        } else if (twoStageLottery) {
            const categories = new Set(props.sushies.map(s => s.category));
            const news = [...Array(n)].map(_ => SelectRandom(Array.from(categories)))
                .map(c => SelectRandom(props.sushies.filter(s => s.category === c)));
            setSlots(append ? [...slots].concat(news) : news);
        } else {
            const news = [...Array(n)].map(_ => SelectRandom(props.sushies));
            setSlots(append ? [...slots].concat(news) : news);
        }
    };

    const DrawCallback = (n: number) => {
        if (n == (slots.length - 1)) {
            setDisplayFooter(true);
        }
    };


    const LotteryModeChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTwoStageLottery(e.target.checked);

    const [slots, setSlots] = useState<SushiInfo[]>([]);
    const [twoStageLottery, setTwoStageLottery] = useState<boolean>(true);
    const [delayEnabled, setDelayEnabled] = useState<boolean>(true);
    const [displayFooter, setDisplayFooter] = useState<boolean>(false);

    if (props.sushies.length == 0) {
        return (<p>Loading...</p>);
    } else {
        return (
            <div>
                <div>
                    <header className="SushiSlot-Header">
                        ガチャを引く:
                        <button onClick={DrawSingle}>1皿</button>
                        <button onClick={DrawQuintuple}>5皿</button>
                        <button onClick={DrawDecuple}>10皿</button>
                        <label>
                            <input type="checkbox" checked={twoStageLottery} onChange={LotteryModeChanged} />
                            二段階抽選
                        </label>
                    </header>
                    <div className="SushiSlot-Body">
                        {
                            slots.length == 0
                                ? <p className="SushiStandby">ここに表示されます</p>
                                : slots.map((m: SushiInfo, i: number) =>
                                    <SushiSingleSlot
                                        key={i}
                                        sushies={props.sushies}
                                        sushi={m}
                                        delay={i}
                                        delayEnabled={delayEnabled}
                                        onCompleted={() => DrawCallback(i)}
                                    />)}
                    </div>
                    {
                        displayFooter
                            ? (
                                <div className="SushiSlot-Footer">
                                    <p>
                                        合計
                                        {slots.map(s => s.price).reduce((a, x) => a + x, 0)} 円,
                                        {slots.map(s => s.energy).reduce((a, x) => a + x, 0)} kcal
                                        <button onClick={DrawAppendOne} >追加でもう1回引く</button>
                                        <a className="twitter-share-button" href="#" onClick={e => PostTwitter(slots)}>Tweet</a>
                                    </p>
                                </div>
                            )
                            : <div />}
                </div >
            </div >
        );
    }
}
