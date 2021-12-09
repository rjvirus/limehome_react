import './App.css';
import { useEffect, useState, useMemo } from 'react';
import Loader from './components/Loader';
import Cards from './components/Cards';
import Pagination from './components/Pagination';
import Logo from './components/Logo';
import SearchBox from './components/SearchBox';
import './components/index.css'

const pageLimit = 16;

function App(props) {

  const [properties, setProperties] = useState(undefined);
  const [favourites, setFavourites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    fetch("https://api.limehome.com/properties/v1/public/properties").then(res => {
      return res.json()
    }).then(data => {
      if (data.success) {
        setProperties(data.payload);
        setTotalPage(Math.ceil(data.payload.length / 16));
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
    }).catch((e) => {
      console.error(e.message)
    });
  }, []);

  const filteredProperties = useMemo(() => {
    let invArr = properties ?? [];

    if (properties?.length) {
      if (searchText.length > 0) {
        const updatedArrray = [];
        properties.forEach(t => {
          if (searchText === 'show-fav') {
            if (favourites.includes(t.id)) {
              updatedArrray.push(t)
            }
          } else if (t.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || t.location.countryName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
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
  }, [searchText, properties, currentPage, totalPage, favourites]);

  const notFound = properties?.length && !!searchText.length && filteredProperties.length === 0;

  return (
    <div className="App">
      <div className="App-header">
        <Logo updatePage={setCurrentPage} />
        <SearchBox text={searchText} onChange={(txt) => setSearchText(txt)} />
        <Pagination disabled={!!searchText} page={currentPage} total={totalPage} updatePage={setCurrentPage} />
      </div>
      <div className="App-body">
        <Loader show={!properties} />
        {notFound && <p>No properties found</p>}
        <Cards
          properties={filteredProperties}
          setFavourites={setFavourites}
          favourites={favourites}
        />
      </div>
    </div>
  );
}

export default App;

