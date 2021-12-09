import React from 'react';

export default function Pagination(props) {
    const { page, total, updatePage, show = true, disabled } = props;
    const localPage = disabled ? 1 : page;
    const localTotal = disabled ? 1 : total;

    return show ? (
        <div className='pagination'>
            <span className='detail'>{localPage} of {localTotal}</span>
            <button style={{ marginRight: '3px'}} disabled={localPage === 1} onClick={() => updatePage(localPage - 1)}>
                {'< Prev'}
            </button>
            <button onClick={() => updatePage(localPage + 1)} disabled={localPage === localTotal || localTotal === 0}>
                {'Next >'}
            </button>
        </div>
    ) : null
}