import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

interface SushiInfo {
  category: string;
  name: string;
  price: number;
  energy: number;
  link: string;
  id: number;
  cat_id: number;
}

interface SushiHandler {
  sushi: SushiInfo;
}

const Sushi: React.FC<SushiHandler> = (prop) => {
  return (
    <div className="sushi">
      <h3><a href={prop.sushi.link}>{prop.sushi.category} - {prop.sushi.name}</a> </h3>
      <p>{prop.sushi.price} yen, {prop.sushi.energy} kcal</p>
    </div>
  )
}

const App: React.FC = () => {
  const [menu, setMenu] = useState<SushiInfo[] | undefined>(undefined);

  useEffect(() => {
    // fetch menu
    (async () => {
      const resp = await fetch("sushiro_menu.json");
      let json = await resp.json();
      const sushies = Object.keys(json)
        .map(c => [c, json[c]])
        .flatMap(t => t[1].map((item: any) => {
          return {
            category: t[0],
            name: item.name,
            price: item.price,
            energy: item.energy,
            link: item.link,
            id: item.id,
            cat_id: item.cat
          }
        }));

      setMenu(sushies);
    })();
  });

  if (menu == undefined) {
    return (
      <div className="App">
        <header className="App-header">
          <p>loading...</p>
        </header>
      </div>
    )
  }
  return (
    <div className="App">
      <header className="App-header">
        {menu.map(s => <Sushi sushi={s} />)}
      </header>
    </div>
  );
}

export default App;
