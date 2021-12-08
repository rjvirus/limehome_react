import './App.css';
import { useEffect, useState } from 'react';
import LazyLoad from "react-lazy-load";

function App() {

  const [properties, setProperties] = useState(undefined);
  const [wishlist, setWishlist] = useState(undefined);

  useEffect(() => {
    fetch("https://api.limehome.com/properties/v1/public/properties")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProperties(data.payload);
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
      <div className="App-body row">
        {!properties && (
          <div id='loader'>
            <img src='loading.gif' />
          </div>
        )}
        {properties?.map(data => {
          return (

            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <div className="box app-card">
                <LazyLoad height={250}>
                  <img
                    style={{ backgroundColor: "grey" }}
                    className="header-img"
                    src={data.images[0].url}
                  />
                </LazyLoad>

                <div className="body">
                  <p className='name'>{data.name}</p>
                  <img className="rating-img" src="rating_blank.png" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
