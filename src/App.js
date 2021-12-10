import './App.css';
import { useEffect, useState, useMemo } from 'react';
import Loader from './components/Loader';
import Cards from './components/Cards';
import Pagination from './components/Pagination';
import Logo from './components/Logo';
import SearchBox from './components/SearchBox';
import { LIMEHOME_API, LOCAL_API, PAGE_LIMIT } from './config.json';
import './components/index.css'

function App(props) {

  const [properties, setProperties] = useState(undefined);
  const [favourites, setFavourites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const NoFavMsg = () => <p>No properties marked as favourite.</p>;
  const GenericMsg = () => <p>No properties match the searched term. Please reset and try again.</p>;

  useEffect(() => {
    //fetch properties from the public API provided by limehome
    fetch(LIMEHOME_API).then(res => {
      return res.json()
    }).then(data => {
      if (data.success) {
        setProperties(data.payload);
        setTotalPage(Math.ceil(data.payload.length / 16));
      } else {
        setProperties(null);
      }
    }).catch((e) => {
      setProperties(null);
      console.log(e.message);
      console.log('Error fetching properties, Please check the internet')
    });


    //fetch saved favourite properties item from the local runnning REST API
    fetch(LOCAL_API + "/favourites", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      return res.json();
    }).then(d => {
      return setFavourites(d.data);
    }).catch((e) => {
      console.error(e.message)
      console.log("Error fetching data, please check the local server is running or not")
    });
  }, []);

  const filteredProperties = useMemo(() => {
    let updatedArr = properties ?? [];
    scrollToTop();
    if (properties?.length) {
      if (searchText.length > 0) {
        const updatedArrray = [];
        properties.forEach(t => {
          if (searchText === 'show-fav') { //if show favourite button is activated
            if (favourites.includes(t.id)) {
              updatedArrray.push(t)
            }
          } else if (t.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || t.location.countryName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
            //check in lowercase if search text appears in any property name and country
            updatedArrray.push(t)
          }
        });
        updatedArr = updatedArrray;
      } else {
        updatedArr = properties;
        const updated = properties.slice((currentPage - 1) * PAGE_LIMIT, currentPage * PAGE_LIMIT);
        if (!updated.length) {
          setCurrentPage(totalPage);
        }
        updatedArr = updated;
      }
    }

    return updatedArr;
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
        <Loader show={properties === undefined} />
        {properties === null && <p>Please check your internet</p>}
        {notFound && (searchText === "show-fav" ? <NoFavMsg /> : <GenericMsg />)}
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

function scrollToTop() {
  var myDiv = document.getElementsByClassName('App-body');
  if (myDiv[0]) {
    myDiv[0].scrollTop = 0;
  }
}

