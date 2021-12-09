import './App.css';
import { useEffect, useState, useMemo } from 'react';
import Loader from './components/Loader';
import Card from './components/Card';
import Pagination from './components/Pagination';
import Logo from './components/Logo';
import SearchBox from './components/SearchBox';

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
  }, [searchText, properties, currentPage, totalPage]);

  const notFound = properties?.length && !!searchText.length && filteredProperties.length === 0;

  return (
    <div className="App">
      <div className="App-header">
        <Logo updatePage={setCurrentPage} />
        {!searchText && (
          <Pagination page={currentPage} total={totalPage} updatePage={setCurrentPage} />
        )}
        <SearchBox text={searchText} onChange={(txt) => setSearchText(txt)} />
      </div>
      <div
        className="App-body"
      >
        <Loader show={!properties} />
        {notFound && (
          <p>No properties found</p>
        )}
        <div className="row">
          {filteredProperties?.map((data) => {
            const indexInDB = favourites.indexOf(data.id)
            return (
              <Card 
                key={data.id}
                selected={indexInDB !== -1} 
                position={indexInDB}
                updateFavourites={setFavourites}
                {...data} 
              />
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;


