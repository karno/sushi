import React, { useState, useEffect } from 'react';
import { Sushi } from './Sushi';
import { SushiSlot } from './SushiSlot';
import { FetchSushiInfo } from './common/Common';
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

const App: React.FC = () => {
  const [menu, setMenu] = useState<SushiInfo[] | undefined>(undefined);

  useEffect(() => {
    // fetch menu
    (async () => {
      setMenu(await FetchSushiInfo());
    })();
  }, []);

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
      <SushiSlot sushies={menu} />
    </div>
  );
}

export default App;
