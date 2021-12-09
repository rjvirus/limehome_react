import { Fragment } from "react";



export default function Loader(props) {
    return props.show ? (
        <div id='loader'>
            <img alt='Loader' src='loading.gif' />
        </div>
    ) : (
        <Fragment />
    )
}