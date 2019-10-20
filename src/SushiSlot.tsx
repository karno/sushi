import React, { useState, useEffect } from 'react';
import SushiInfo from './common/SushiInfo';
import { Timeout, SelectRandom } from './common/Common';
import './SushiSlot.css';

interface SushiSingleSlotProps {
    sushies: SushiInfo[],
    sushi: SushiInfo,
    delay: number,
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
            for (let _ of [...Array(props.delay * 30 + 10)]) {
                await Timeout(10);
                setRandomSushi();
            }
            // slotting the category
            for (let _ of [...Array(10)]) {
                await Timeout(10);
                setRandomSushi();
            }
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
        if (props.sushies.length == 0) {
            setSlots([]);
        } else if (twoStageLottery) {
            console.log('two-stage');
            const categories = new Set(props.sushies.map(s => s.category));
            setSlots([...Array(n)].map(_ => SelectRandom(Array.from(categories)))
                .map(c => SelectRandom(props.sushies.filter(s => s.category === c))));
        } else {
            console.log('single-stage');
            setSlots([...Array(n)].map(_ => SelectRandom(props.sushies)));
        }
    };

    const LotteryModeChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTwoStageLottery(e.target.checked);

    const [slots, setSlots] = useState<SushiInfo[]>([]);
    const [twoStageLottery, setTwoStageLottery] = useState<boolean>(true);

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
                        <SushiSingleSlot sushies={props.sushies} sushi={m} delay={i} />)}
                </div>
            </div>
        );
    }
}