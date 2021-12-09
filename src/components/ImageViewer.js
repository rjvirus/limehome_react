import { useState } from "react";
import LazyLoad from "react-lazy-load";

export default function ImageViewer(props) {
	const { images } = props;

	const [activeIndex, setActiveIndex] = useState(0);

	function onClickChange(direction) {
		if (direction === 'prev') {
			setActiveIndex(prev => {
				if (prev - 1 > 0) {
					return prev - 1
				}
				return prev
			});
		} else if (direction === 'next') {
			console.log(images.length)
			setActiveIndex(prev => {
				if (prev + 1 < images.length - 1) {
					return prev + 1
				} else {
					return prev
				}
			});
		}
	}

	return (
		<div className='image-box'>
			<LazyLoad height={250}>
				<img
					className="header-img"
					src={images[activeIndex].url}
					alt='Property Images'
				/>
			</LazyLoad>
			<button className='action' title='Show previous image' id='left' onClick={(e) => onClickChange('prev')}>
				<img alt='Prev' src='arrow.png' height="20px" width="10px" />
			</button>
			<button className='action' title='Show next image' id='right' onClick={(e) => onClickChange('next')}>
				<img alt='Next' src='arrow.png' height="20px" width="20px" />
			</button>
		</div>
	)
}