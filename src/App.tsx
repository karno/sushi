import React, { useState, useEffect } from 'react';
import { Sushi } from './Sushi';
import { SushiSlot } from './SushiSlot';
import { FetchSushiInfo } from './common/Common';
import SushiInfo from './common/SushiInfo';
import './App.css';


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
