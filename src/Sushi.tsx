import React, { useState, useEffect } from 'react';
import SushiInfo from './common/SushiInfo';

import './Sushi.css';

interface SushiInfoProps {
    sushi: SushiInfo
};

export const Sushi: React.FC<SushiInfoProps> = (prop) => {
    return (
        <div className="sushi">
            <h3><a href={prop.sushi.link}>{prop.sushi.category} - {prop.sushi.name}</a> </h3>
            <p>{prop.sushi.price} yen, {prop.sushi.energy} kcal</p>
        </div>
    )
}
