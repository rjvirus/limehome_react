import './App.css';
import { useEffect, useState } from 'react';
import LazyLoad from "react-lazy-load";

function App() {

  const [properties, setProperties] = useState(undefined);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    fetch("https://api.limehome.com/properties/v1/public/properties").then(res => {
      return res.json()
    }).then(data => {
      if (data.success) {
        setProperties(data.payload);
      } else {
        setProperties(null);
      }
    });

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch("http://localhost:5001/limehome-95934/us-central1/app/api/favourites", requestOptions).then(res => {
      return res.json();
    }).then(d => {
      return setFavourites(d.data);
    });
  }, []);

  function onClickToggleFav(propertyId, favIndex) {
    document.body.style.cursor = 'wait';
    const isFav = favIndex !== -1;
    const requestOptions = {
      method: isFav ? 'DELETE' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId })
    };
    fetch("http://localhost:5001/limehome-95934/us-central1/app/api/favourites", requestOptions).then(res => {
      return res.json();
    }).then(d => {
      if (d.success) {
        document.body.style.cursor = 'default';
        setFavourites(prev => {
          if(isFav) {
            return prev.filter((_,i) => i !== favIndex);
          } else {
            return [...prev, propertyId]
          }
        });
      }
    }).catch((e) => {
      console.error(e)
    });
  }


  return (
    <div className="App">
      <header className="App-header">
        <img alt='logo' id="app-logo" src="limehome_logo.png" />
      </header>
      <div className="App-body row">
        {!properties && (
          <div id='loader'>
            <img alt='Loader' src='loading.gif' />
          </div>
        )}
        {properties?.map((data) => {
          const favIndex = favourites.indexOf(data.id)
          return (
            <div key={data.id} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <div className="box app-card">
                <div className='header'>
                  <LazyLoad height={250}>
                    <img
                      className="header-img"
                      src={data.images[0].url}
                      alt='Property Images'
                    />
                  </LazyLoad>
                  <button className='action' title='Show previous image' id='left'>
                    <img alt='Prev' src='arrow.png' height="20px" width="10px" />
                  </button>
                  <button className='action' title='Show next image' id='right'>
                    <img alt='Next' src='arrow.png' height="20px" width="20px" />
                  </button>
                </div>
                <div className="body">
                  <div>
                    <p className='name'>{data.name}</p>
                    <p className='city'>{data.location.countryName}</p>
                  </div>
                  <img
                    title={favIndex !== -1 ? 'Remove from Favourites' : 'Add to Favourites'}
                    className="rating-img"
                    src={favIndex !== -1 ? "rating.png" : "rating_blank.png"}
                    onClick={(e) => onClickToggleFav(data.id, favIndex)}
                    alt='favourite'
                  />
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
