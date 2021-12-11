import classNames from "classnames";
import React from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Cards from "./Cards";
import Loader from "../common/Loader";

export default function AppBody(props) {
	const { properties, filteredProperties, setFavourites, favourites, isSearch, isFavToggled } = props;
	const windowSize = useWindowSize();
	const appBodyClassName = classNames("app-body", {
		"medium": windowSize === 'sm' || windowSize === 'md'
	});
	const notFound = properties?.length && isSearch && filteredProperties.length === 0;
	const NoFavMsg = () => <p>No properties marked as favourite.</p>;
	const GenericMsg = () => <p>No properties match the searched term. Please reset and try again.</p>;

	return (
		<div className={appBodyClassName}>
			<Loader show={properties === undefined} />
			{properties === null && <p>Please check your internet</p>}
			{notFound && (isFavToggled ? <NoFavMsg /> : <GenericMsg />)}
			<Cards
				properties={filteredProperties}
				setFavourites={setFavourites}
				favourites={favourites}
			/>
		</div>
	)
}