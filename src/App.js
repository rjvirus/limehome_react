import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [properties, setProperties] = useState(undefined);
  const [wishlist, setWishlist] = useState(undefined);

  useEffect(() => {
    fetch("https://api.limehome.com/properties/v1/public/properties")
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setProperties(data.payload)
      } else {
        setProperties(null);
      }
    })
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img id="app-logo" src="limehome_logo.png" />
      </header>
      <div className="App-body">
        {properties.map(data => {
          return <p>data</p>
        })}
      </div>
    </div>
  );
}

export default App;
