import classNames from "classnames";
import React from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Logo from "./Logo";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";

export default function AppHeader(props) {
	const { setCurrentPage, favCount, searchText, onChangeSearch, page, totalPage } = props;
	const windowSize = useWindowSize();
	const appHeaderClassName = classNames("app-header", {
    'small': windowSize === 'sm',
    'medium': windowSize === 'md',
    'large': windowSize === 'lg' || windowSize === 'xlg'
  });

	return (
		<div className={appHeaderClassName}>
			<Logo updatePage={setCurrentPage} />
			<SearchBox favCount={favCount} text={searchText} onChange={onChangeSearch} />
			<Pagination
				disabled={!!searchText}
				page={page}
				total={totalPage}
				updatePage={setCurrentPage}
			/>
		</div>
	)
}