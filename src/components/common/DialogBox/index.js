import React from 'react';
import Modal from 'react-modal';
import './styles.css';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export default function DialogBox(props) {
	const { open, title, onClose, header } = props;
	let subtitle;

	function afterOpenModal() {
		// references are now sync'd and can be accessed.
		if(subtitle) {
			subtitle.style.color = '#c32121';
		}
	}


	return (
		<Modal
			isOpen={open}
			onAfterOpen={afterOpenModal}
			onRequestClose={onClose}
			style={customStyles}
			contentLabel="Example Modal"
		>
			{header ?? (
				<div className='modal-header'>
					<h2 ref={(_subtitle) => (subtitle = _subtitle)}>{title ?? ''}</h2>
					<button onClick={onClose}>x</button>
				</div>
			)}
			<div className='modal-body'>
				{props?.children}
			</div>
		</Modal>
	)
}