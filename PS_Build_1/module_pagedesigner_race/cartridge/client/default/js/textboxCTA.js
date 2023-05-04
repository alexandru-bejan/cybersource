window.onload = function () {
	const textboxContainer = document.getElementsByClassName('text-box-container');
	let textboxContLength = textboxContainer.length;
	for(let i =0; i< textboxContLength; i++) {
		if(textboxContainer[i].style.backgroundColor){
			document.getElementsByClassName('mobile-2r-1c')[i].style.backgroundColor = textboxContainer[i].style.backgroundColor;			
		}	
	} 
};
