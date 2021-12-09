import { useEffect, useState } from "react";
import Loader from "./Loader";
import Compressor from 'compressorjs';

export default function ImageViewer(props) {
	const { images } = props;
	const [localImages, setLocalImages] = useState(new Array(images.length).fill(undefined));
	const [activeIndex, setActiveIndex] = useState(0);
	const isLoading = localImages[activeIndex] === undefined;

	useEffect(() => {
		if (activeIndex !== undefined && localImages[activeIndex] === undefined) {
			var xhr = new XMLHttpRequest();
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
							setLocalImages(prev => {
								let arr = [...prev];
								arr[activeIndex] = urlCreator.createObjectURL(compressedResult);
								return arr
							})
						},
					});
				}
			};
			xhr.send();
		}
	}, [activeIndex, images, localImages]);

	function onClickChange(direction) {
		if (direction === 'prev') {
			setActiveIndex(prev => {
				if (prev - 1 >= 0) {
					return prev - 1
				}
				return prev
			});
		} else if (direction === 'next') {
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
		<div className='image-viewer'>
			{isLoading ? (
				<Loader show fill />
			) : (
				<img
					src={localImages[activeIndex]}
					alt='Property Images'
				/>
			)}
			<button
				id='left-overlay'
				className='overlay-btn'
				title='Show previous image'
				onClick={(e) => onClickChange('prev')}
			>
				<img alt='Prev' src='arrow.png' />
			</button>
			<button
				className='overlay-btn'
				title='Show next image'
				id='right-overlay'
				onClick={(e) => onClickChange('next')}
			>
				<img alt='Next' src='arrow.png' />
			</button>
		</div>
	)
}