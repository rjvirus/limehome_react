import { useSnackbar } from 'react-simple-snackbar';
import ImageViewer from './ImageViewer';
import { LOCAL_API } from '../../config.json';

export default function Card(props) {
  const { id, images, name, location, position, selected, updateFavourites } = props;
  const [openSnackbar] = useSnackbar();
  const ratingTooltip = selected ? 'Remove from Favourites' : 'Add to Favourites';
  const ratingImgSrc = selected ? "rating.png" : "rating_blank.png"

  function onClickToggleFav(propertyId, name) {
    document.body.style.cursor = 'wait';
    fetch(LOCAL_API + "/favourites", {
      method: selected ? 'DELETE' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId })
    }).then(res => {
      return res.json();
    }).then(d => {
      if (d.success) {
        updateFavourites(prev => {
          if (selected) {
            openSnackbar(capitalize(name) + ' removed from Favourites');
            return prev.filter((_, i) => i !== position);
          } else {
            openSnackbar(capitalize(name) + ' added to Favourites');
            return [...prev, propertyId]
          }
        });
      }
    }).catch((e) => {
      console.error(e)
      openSnackbar("Failed to communicate with server");
    }).finally(() => {
      document.body.style.cursor = 'default';
    });
  }

  return (
    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={id}>
      <div className="box card">
        <ImageViewer images={images} />
        <div className="body">
          <div>
            <p className='name'>{name}</p>
            <p className='city'>{location.countryName}</p>
          </div>
          <img
            title={ratingTooltip}
            className="rating-img"
            src={ratingImgSrc}
            onClick={(e) => onClickToggleFav(id, name)}
            alt='favourite'
          />
        </div>
      </div>
    </div>
  )
}

const capitalize = function (s) {
  return s.replace(/(^|\s)([a-z])/g,
    function (m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
};