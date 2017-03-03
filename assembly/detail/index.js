(function(){

    return;
	function setMargin(){
		var wrapWidth = document.querySelector('.works>.wrap').clientWidth;
		var itemWidth = 320 + 4 * 2;
		var margin = (wrapWidth - itemWidth * 4) / 8;
		var items = document.querySelectorAll('.wrap>li');
		for(var i = 0; i < items.length; i++){
			items[i].style.margin = '5px ' + (margin - 2) + 'px';
		}
	};
	setMargin();

	window.onresize = function(){
		setMargin();
	}

})();
