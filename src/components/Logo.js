export default function Logo(props) {

    return (
        <img alt='logo' id="app-logo" src="limehome_logo.png" onClick={() => props.updatePage(1)}/>
    )
}