import { useState } from "react";
import { useSnackbar } from 'react-simple-snackbar';
import ImageViewer from './ImageViewer';

export default function Card(props) {
	const { id, images, name, location, position, selected, setFavourites } = props;
	const [openSnackbar, closeSnackbar] = useSnackbar();

	function onClickToggleFav(propertyId, name, favIndex) {
    document.body.style.cursor = 'wait';
    const requestOptions = {
      method: selected ? 'DELETE' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId })
    };
    fetch("http://localhost:5001/limehome-95934/us-central1/app/api/favourites", requestOptions).then(res => {
      return res.json();
    }).then(d => {
      if (d.success) {
        setFavourites(prev => {
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
    }).finally(() => {
      document.body.style.cursor = 'default';
    });
  }

	return (
		<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={id}>
			<div className="box app-card">
				<ImageViewer images={images} />
				<div className="body">
					<div>
						<p className='name'>{name}</p>
						<p className='city'>{location.countryName}</p>
					</div>
					<img
						title={selected ? 'Remove from Favourites' : 'Add to Favourites'}
						className="rating-img"
						src={selected ? "rating.png" : "rating_blank.png"}
						onClick={(e) => onClickToggleFav(id, name, position)}
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