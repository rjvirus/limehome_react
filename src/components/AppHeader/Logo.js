export default function Logo(props) {

    return (
        <img className="items" alt='logo' id="app-logo" src="limehome_logo.png" onClick={() => props.updatePage(1)} />
    )
}