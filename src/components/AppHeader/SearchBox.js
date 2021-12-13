export default function SearchBox(props) {
	const { text, onSearch, favCount } = props;

	return (
		<div className='search-box items'>
			<input
				value={text}
				type='text'
				className='search'
				name='search'
				placeholder='Search by name / country'
				onChange={(event) => onSearch(event.target.value)}
			/>
			<button 
				title="Click to reset search results" 
				className='app-btn'
				disabled={!text}
				onClick={() => onSearch('')}
			>
				Reset
			</button>
			<button
				className='app-btn'
				title="Click to show favourite"
				onClick={() => onSearch('show-fav')}
				disabled={text === 'show-fav'}
			>
				Show Favourites 
				{!!favCount && <span class="badge">{favCount}</span>}
			</button>
		</div>
	)
}