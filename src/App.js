import './App.css';
import { useEffect, useState, useMemo } from 'react';
import { LIMEHOME_API, LOCAL_API, PAGE_LIMIT } from './config.json';
import './components/styles.css';
import AppBody from './components/AppBody';
import AppHeader from './components/AppHeader';

function App(props) {
  const [properties, setProperties] = useState(undefined);
  const [favourites, setFavourites] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchText, setSearchText] = useState('');

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
      console.error(e.message);
      setFavourites(null);
      console.log("Error fetching data, please check the local server is running or not")
    });
  }, []);

  //filters the property when search iniatiated or favourite toggled
  const filteredProperties = useMemo(() => {
    let updatedArr = properties ?? [];
    if (properties?.length) {
      if (searchText.length > 0) {
        const updatedArrray = [];
        properties.forEach(t => {
          if (isFavToggled(searchText)) { //if show favourite button is activated
            if (favourites?.includes(t.id)) {
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
  //TODO: too many dependecnies, needs cleanup

  return (
    <div className="App">
      <AppHeader
        page={currentPage}
        totalPage={totalPage}
        searchText={searchText}
        favCount={favourites?.length}
        setCurrentPage={setCurrentPage}
        onChangeSearch={(txt) => setSearchText(txt)}
      />
      <AppBody
        isSearch={!!searchText}
        isFavToggled={isFavToggled(searchText)}
        favourites={favourites}
        properties={properties}
        filteredProperties={filteredProperties}
        setFavourites={setFavourites}
      />
    </div>
  );
}

export default App;

export function scrollToTop() {
  var myDiv = document.getElementsByClassName('app-body');
  if (myDiv[0]) {
    myDiv[0].scrollTop = 0;
  }
}

export const isFavToggled = (s) => (s === "show-fav");

