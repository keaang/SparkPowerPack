
function sortObjectBy(array, srtKey, srtOrder){
    if (srtOrder =="A"){
        if (srtKey =="title" || srtKey =="name"){
            return array.sort(function (a, b) {
                var x = a[srtKey].toLowerCase(); var y = b[srtKey].toLowerCase();
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }); //return array.sort(function (a, b) { 
        } //if (srtKey =="title" || srtKey =="name")
        else
        {
	        return array.sort(function (a, b) {
	            var x = a[srtKey]; var y = b[srtKey];
	            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	        }); //return array.sort(function (a, b) {
        } //else
    } //if (srtOrder =="A")

    if (srtOrder =="D"){
        if (srtKey =="title" || srtKey =="name"){
            return array.sort(function (a, b) {
                var x = a[srtKey].toLowerCase(); var y = b[srtKey].toLowerCase();
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }); //return array.sort(function (a, b) {
        } //if (srtKey =="title" || srtKey =="name")
        else
        {
	        return array.sort(function (a, b) {
	            var x = a[srtKey]; var y = b[srtKey];
	            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	        }); //return array.sort(function (a, b) {
		} //else
    } //if (srtOrder =="D")
}