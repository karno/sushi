import React, { useState, useEffect } from 'react';
import SushiInfo from './common/SushiInfo';
import { Timeout, SelectRandom } from './common/Common';
import { PostTwitter, PostMastodon } from './common/Share';
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

export interface SushiSlotProps {
    sushies: SushiInfo[]
}

export const SushiSlot: React.FC<SushiSlotProps> = props => {

    const CatchAndDraw = (n: number) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        Draw(n);
    };

    const DrawAppendOne = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
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
                        <div><p>ガチャを引く:</p></div>
                        <div className="DrawButton"><a href="#" onClick={CatchAndDraw(1)}>1皿</a></div>
                        <div className="DrawButton"><a href="#" onClick={CatchAndDraw(5)}>5皿</a></div>
                        <div className="DrawButton"><a href="#" onClick={CatchAndDraw(10)}>10皿</a></div>
                        <div>
                            <input id="two-stage" type="checkbox" checked={twoStageLottery} onChange={LotteryModeChanged} />
                            <label htmlFor="two-stage">二段階抽選</label>
                        </div>
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
                                    <div className="Statistics">
                                        <p>
                                            合計
                                        {slots.map(s => s.price).reduce((a, x) => a + x, 0)} 円,
                                        {slots.map(s => s.energy).reduce((a, x) => a + x, 0)} kcal
                                        </p>
                                    </div>

                                    <div className="DrawButton">
                                        <a href="#" onClick={DrawAppendOne}>もう1皿引く</a>
                                    </div>
                                    <div className="SushiSlot-Share">
                                        <a className="PostTwitter" href="#" onClick={e => PostTwitter(slots)}> ツイート </a>
                                        <a className="PostMastodon" href="#" onClick={e => PostMastodon(slots)}> トゥート </a>
                                    </div>
                                </div>
                            )
                            : <div />
                    }
                </div >
            </div >
        );
    }
}
