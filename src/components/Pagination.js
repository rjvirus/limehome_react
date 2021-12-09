import React from 'react';

export default function Pagination(props) {
    const { page, total, updatePage, show = true } = props;

    return show ? (
        <div className='pagination'>
            <button style={{ marginRight: '3px'}} disabled={page === 1} onClick={() => updatePage(page - 1)}>
                {'< Prev'}
            </button>
            <span style={{ fontSize: '12px', marginRight: '5px' }}>{page} of {total}</span>
            <button onClick={() => updatePage(page + 1)} disabled={page === total || total === 0}>
                {'Next >'}
            </button>
        </div>
    ) : null
}