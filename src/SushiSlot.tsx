import React, { useState, useEffect } from 'react';
import SushiInfo from './common/SushiInfo';
import './SushiSlot.css';
import { arrayExpression } from '@babel/types';

interface SushiSingleSlotProps {
    sushies: SushiInfo[],
    sushi: SushiInfo,
    delay: number,
}

const SushiSingleSlot: React.FC<SushiSingleSlotProps> = props => {
    return <p>{props.delay} {props.sushi.category} {props.sushi.name}</p>

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
        } else {
            setSlots([...Array(n)].map(_ =>
                props.sushies[Math.floor(Math.random() * props.sushies.length)]
            ));
        }
    };

    const [slots, setSlots] = useState<SushiInfo[]>([]);

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
                    </p>
                    {slots.map((m: SushiInfo, i: number) =>
                        <SushiSingleSlot sushies={props.sushies} sushi={m} delay={i} />)}
                </div>
            </div>
        );
    }
}