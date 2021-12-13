import classNames from "classnames";
import React from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Logo from "./Logo";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";

export default function AppHeader(props) {
	const { setPage, favCount, searchText, onSearch, page, totalPage } = props;
	const windowSize = useWindowSize();
	const appHeaderClassName = classNames("app-header", {
    'small': windowSize === 'sm',
    'medium': windowSize === 'md',
    'large': windowSize === 'lg' || windowSize === 'xlg'
  });

	return (
		<div className={appHeaderClassName}>
			<Logo updatePage={setPage} />
			<SearchBox favCount={favCount} text={searchText} onSearch={onSearch} />
			<Pagination
				disabled={!!searchText}
				page={page}
				total={totalPage}
				updatePage={setPage}
			/>
		</div>
	)
}