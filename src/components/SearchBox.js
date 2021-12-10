export default function SearchBox(props) {
	const { text, onChange } = props;

	return (
		<div className='app-search'>
			<input
				value={text}
				type='text'
				className='search'
				name='search'
				placeholder='Search by name / country'
				onChange={(event) => onChange(event.target.value)}
			/>
			<button className='app-btn' onClick={() => onChange('')}>Reset</button>
			<button
				className='app-btn'
				title="Click on Reset to Toggle Off Favourite"
				onClick={() => onChange('show-fav')}
				disabled={text === 'show-fav'}
			>
				Show Favourites
			</button>
		</div>
	)
}