import React, { useState, useEffect } from 'react';
import SushiInfo from './common/SushiInfo';
import { Timeout, SelectRandom } from './common/Common';
import './SushiSlot.css';

interface SushiSingleSlotProps {
    sushies: SushiInfo[],
    sushi: SushiInfo,
    delay: number,
    delayEnabled: boolean,
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
        (async () => {
            // awaiting other slots
            const delay = props.delayEnabled ? (props.delay + 1) : 1;
            for (let _ of [...Array(delay * 40 + 10)]) {
                await Timeout(10);
                setRandomSushi();
            }
            // slotting the category
            for (let _ of [...Array(20)]) {
                await Timeout(10);
                setRandomSushi(props.sushi.category);
            }
            setSushi(props.sushi);
        })();
    }, [props.sushi]);
    if (sushi === undefined) {
        return <p></p>;
    }
    return <p>{sushi.category} <br /> {sushi.name}</p>;
}

interface SushiSlotProps {
    sushies: SushiInfo[]
}

export const SushiSlot: React.FC<SushiSlotProps> = props => {

    const DrawSingle = () => DrawN(1);
    const DrawQuintuple = () => DrawN(5);
    const DrawDecuple = () => DrawN(10);
    const DrawN = (n: number) => {
        setDelayEnabled(true);
        if (props.sushies.length == 0) {
            setSlots([]);
        } else if (twoStageLottery) {
            const categories = new Set(props.sushies.map(s => s.category));
            setSlots([...Array(n)].map(_ => SelectRandom(Array.from(categories)))
                .map(c => SelectRandom(props.sushies.filter(s => s.category === c))));
        } else {
            setSlots([...Array(n)].map(_ => SelectRandom(props.sushies)));
        }
    };

    const DrawAppendOne = () => {
        setDelayEnabled(false);
        if (props.sushies.length == 0) {
            return;
        }
        if (twoStageLottery) {
            console.log('two-stage');
            const categories = new Set(props.sushies.map(s => s.category));
            const category = SelectRandom(Array.from(categories));
            setSlots([...slots].concat([SelectRandom(props.sushies.filter(s => s.category == category))]));
        } else {
            setSlots([...slots].concat([SelectRandom(props.sushies)]));
        }
    };

    const LotteryModeChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTwoStageLottery(e.target.checked);

    const [slots, setSlots] = useState<SushiInfo[]>([]);
    const [twoStageLottery, setTwoStageLottery] = useState<boolean>(true);
    const [delayEnabled, setDelayEnabled] = useState<boolean>(true);

    if (props.sushies.length == 0) {
        return (<p>Loading...</p>);
    } else {
        return (
            <div>
                <div>
                    <p>
                        <button onClick={DrawSingle}>1回引く</button>
                        <button onClick={DrawQuintuple}>5回引く</button>
                        <button onClick={DrawDecuple}>10回引く</button>
                        <label>
                            <input type="checkbox" checked={twoStageLottery} onChange={LotteryModeChanged} />
                            二段階抽選
                        </label>
                    </p>
                    {slots.map((m: SushiInfo, i: number) =>
                        <SushiSingleSlot sushies={props.sushies} sushi={m} delay={i} delayEnabled={delayEnabled} />)}
                    <p>
                        {
                            <button onClick={DrawAppendOne}>追加でもう1回引く</button>
                        }
                    </p>
                </div>
            </div>
        );
    }
}
