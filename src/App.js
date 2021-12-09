import './App.css';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'react-simple-snackbar';
import Loader from './components/Loader';
import ImageViewer from './components/ImageViewer';

function App() {

  const [properties, setProperties] = useState(undefined);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [searchText, setSearchText] = useState('');

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

  useEffect(() => {
    if (properties?.length) {
      if (searchText.length > 0) {
        const updatedArrray = [];
        properties.forEach(t => {
          if (t.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || t.location.countryName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
            updatedArrray.push(t)
          }
        });
        setFilteredProperties(updatedArrray);
      } else {
        setFilteredProperties(properties);
      }
    }
  }, [searchText, properties]);

  function onClickToggleFav(propertyId, name, favIndex) {
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
        setFavourites(prev => {
          if (isFav) {
            openSnackbar(name.capitalize() + ' removed from Favourites');
            return prev.filter((_, i) => i !== favIndex);
          } else {
            openSnackbar(name.capitalize() + ' added to Favourites');
            return [...prev, propertyId]
          }
        });
      }
    }).catch((e) => {
      console.error(e)
    }).finally(() => {
      document.body.style.cursor = 'default';
    });
  }

  function onChangeSearch(event) {
    setSearchText(event.target.value);
  }


  return (
    <div className="App">
      <div className="App-header">
        <img alt='logo' id="app-logo" src="limehome_logo.png" />
        <div className='app-search'>
          <input
            value={searchText}
            type='text'
            className='search'
            name='search'
            placeholder='Search by name / country'
            onChange={onChangeSearch}
          />
          <button style={{
            marginLeft: '5px'
          }} onClick={() => setSearchText('')}>Reset</button>
        </div>
      </div>
      <div className="App-body row">
        <Loader show={!properties} />
        {properties?.length && filteredProperties.length == 0 && (
          <p>No properties found</p>
        )}
        {filteredProperties?.map((data) => {
          const favIndex = favourites.indexOf(data.id)
          return (
            <div key={data.id} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <div className="box app-card">
                <ImageViewer images={data.images} />
                <div className="body">
                  <div>
                    <p className='name'>{data.name}</p>
                    <p className='city'>{data.location.countryName}</p>
                  </div>
                  <img
                    title={favIndex !== -1 ? 'Remove from Favourites' : 'Add to Favourites'}
                    className="rating-img"
                    src={favIndex !== -1 ? "rating.png" : "rating_blank.png"}
                    onClick={(e) => onClickToggleFav(data.id, data.name, favIndex)}
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


String.prototype.capitalize = function () {
  return this.replace(/(^|\s)([a-z])/g,
    function (m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
};