export default function SearchBox(props) {
	const { text, onChange } = props;

	return (
		<div className='search-box items'>
			<input
				value={text}
				type='text'
				className='search'
				name='search'
				placeholder='Search by name / country'
				onChange={(event) => onChange(event.target.value)}
			/>
			<button 
				title="Click to reset search results" 
				className='app-btn' 
				onClick={() => onChange('')}
			>
				Reset
			</button>
			<button
				className='app-btn'
				title="Click to show favourite"
				onClick={() => onChange('show-fav')}
				disabled={text === 'show-fav'}
			>
				Show Favourites
			</button>
		</div>
	)
}