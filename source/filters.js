

Whack

.addFilter("pow", function(num, pow){
	return Math.pow(num, pow);
})


.addFilter("plural", function(count, words){
	return count + " " + (words = typeof words === 'string' ?  words.split(',') : words)[ count % 10 == 1 && count % 100 != 11 ? 0
		: (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) ? 1 : 2];
});