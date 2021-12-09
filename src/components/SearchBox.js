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
			<button style={{
				marginLeft: '5px'
			}} onClick={() => onChange('')}>Reset</button>
			<button style={{
				marginLeft: '5px'
			}} onClick={() => onChange('show-fav')}>Show Favourites</button>
		</div>
	)
}