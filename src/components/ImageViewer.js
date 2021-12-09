import { useEffect, useState } from "react";
import Loader from "./Loader";
import Compressor from 'compressorjs';

export default function ImageViewer(props) {
	const { images } = props;
	const [localImages, setLocalImages] = useState(new Array(images.length).fill(undefined)); // initialize with nulls for caching
	const [activeIndex, setActiveIndex] = useState(0);
	const isLoading = localImages[activeIndex] === undefined;
	const hasError = localImages[activeIndex] === null;

	useEffect(() => {
		let isActive = true;
		var xhr = new XMLHttpRequest();
		if (activeIndex !== undefined && localImages[activeIndex] === undefined) {
			xhr.open('GET', images[activeIndex].url, true);
			xhr.responseType = 'arraybuffer';
			xhr.onload = function (e) {
				if (this.status === 200) {
					var urlCreator = window.URL || window.webkitURL;
					var myBlob = new Blob([this.response], { type: "image/jpeg" });
					new Compressor(myBlob, {
						quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
						maxWidth: 800,
						maxHeight: 800,
						success: (compressedResult) => {
							if (isActive) { //will not call setState if cleanup task already run and the component is unmounted
								setLocalImages(prev => {
									let arr = [...prev];
									arr[activeIndex] = urlCreator.createObjectURL(compressedResult);
									return arr
								})
							}
						},
					});
				}
			};
			xhr.send();
		}

		//cleanup task if setState called when component unmounted. 
		return function () {
			xhr.abort();
			isActive = false;
		}
	}, [activeIndex, images, localImages]);

	function onClickChange(direction) {
		if (direction === 'prev') {
			setActiveIndex(prev => {
				if (prev - 1 >= 0) { //check if the image is the first image
					return prev - 1
				}
				return prev
			});
		} else if (direction === 'next') {
			setActiveIndex(prev => {
				if (prev + 1 < images.length - 1) { //check if the image is the last image
					return prev + 1
				} else {
					return prev
				}
			});
		}
	}

	return (
		<div className='image-viewer'>
			{hasError && <p>Error loading image</p>}
			{isLoading ? (
				<Loader show fill />
			) : (
				<img
					src={localImages[activeIndex]}
					alt='Property Images'
				/>
			)}
			<button
				id='overlay-btn-left'
				className='overlay-btn'
				title='Show previous image'
				onClick={(e) => onClickChange('prev')}
			>
				<img alt='Prev' src='arrow.png' />
			</button>
			<button
				id='overlay-btn-right'
				className='overlay-btn'
				title='Show next image'
				onClick={(e) => onClickChange('next')}
			>
				<img alt='Next' src='arrow.png' />
			</button>
		</div>
	)
}