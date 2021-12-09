import './App.css';
import { useEffect, useState, useRef, useMemo } from 'react';
import Loader from './components/Loader';
import Card from './components/Card';

const pageLimit = 16;

function App() {

  const [properties, setProperties] = useState(undefined);
  const [favourites, setFavourites] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = useRef(0);

  useEffect(() => {
    fetch("https://api.limehome.com/properties/v1/public/properties").then(res => {
      return res.json()
    }).then(data => {
      if (data.success) {
        setProperties(data.payload);
        totalPage.current = Math.ceil(data.payload.length / 16);
      } else {
        setProperties(null);
      }
    });

    fetch("http://localhost:5001/limehome-95934/us-central1/app/api/favourites", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      return res.json();
    }).then(d => {
      return setFavourites(d.data);
    });
  }, []);

  function onChangeSearch(event) {
    setSearchText(event.target.value);
  }

  const filteredProperties = useMemo(() => {
    let invArr = properties ?? [];

    if (properties?.length) {
      if (searchText.length > 0) {
        const updatedArrray = [];
        properties.forEach(t => {
          if (t.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || t.location.countryName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
            updatedArrray.push(t)
          }
        });
        invArr = updatedArrray;
      } else {
        invArr = properties;
        const updated = properties.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);
        if (!updated.length) {
          setCurrentPage(totalPage.current);
        }
        invArr = updated;
      }
    }

    return invArr;
  }, [searchText, properties, currentPage]);

  return (
    <div className="App">
      <div className="App-header">
        <img alt='logo' id="app-logo" src="limehome_logo.png" />
        {!searchText && (
          <div className='pagination'>
            <span style={{ fontSize: '12px', marginRight: '5px' }}>{currentPage} of {totalPage.current}</span>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>{'< Previous'}</button>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPage.current || totalPage.current === 0}>{'Next >'}</button>
          </div>
        )}
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
      <div
        className="App-body"
      >
        <Loader show={!properties} />
        {properties?.length && !!searchText.length && filteredProperties.length == 0 && (
          <p>No properties found</p>
        )}
        <div className="row">
          {filteredProperties?.map((data) => {
            const favIndex = favourites.indexOf(data.id)
            return (
              <Card {...data} position={favIndex} setFavourites />
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;


