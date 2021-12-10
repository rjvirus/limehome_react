import React from 'react';
import { scrollToTop } from '../App';

export default function Pagination(props) {
	const { page, total, updatePage, show = true, disabled } = props;
	const localPage = disabled ? 1 : page;
	const localTotal = disabled ? 1 : total;

	const onClickChange = (action) => {
		scrollToTop();
		if(action === 'prev') {
			updatePage(localPage - 1)
		} else {
			updatePage(localPage + 1)
		}
	}

	return show ? (
		<div className='pagination items'>
			<span className='detail'>{localPage} of {localTotal}</span>
			<button
				className='app-btn'
				disabled={localPage === 1}
				onClick={() => onClickChange('prev')}
			>
				{'< Prev'}
			</button>
			<button 
				className='app-btn'
				onClick={() => onClickChange('next')} 
				disabled={localPage === localTotal || localTotal === 0}
			>
				{'Next >'}
			</button>
		</div>
	) : null
}