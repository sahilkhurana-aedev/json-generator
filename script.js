$( document ).ready(function() {
	$("#input").on("change", function (e) {
	   var file = e.target.files[0];
	   // input canceled, return
	   if (!file) return;
	   
	   var FR = new FileReader();
	   FR.onload = function(e) {
		 var data = new Uint8Array(e.target.result);
		 var workbook = XLSX.read(data, {type: 'array'});
		 var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
		 // header: 1 instructs xlsx to create an 'array of arrays'
		 var result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
		 
		 // data preview
		 var output = document.getElementById('result');
		 var linksarr = formatLinksJSON(result);
		 var links = { links: linksarr};
		 download(links, 'links_'+ new Date().toLocaleString() + '.txt', 'text/plain')
		 // output.innerHTML = JSON.stringify(links, null, 2);
	   };
	   FR.readAsArrayBuffer(file);
	});
	
	function formatLinksJSON(result) {
		var topRow;
		var resultLinks = [];
		result.forEach((row,index) => {
			if (true) {
				if (index == 0) {
					topRow = row; // contains the names
				} else {
					topRow.forEach((targetElement, topRowIndex) => {
						if (targetElement && row[0] != targetElement) {
							resultLinks.push({
								soruce: row[0],
								target: targetElement,
								value: row[topRowIndex]
							});
						}
					});

				}
			}
		});
		return resultLinks;
	}
	
	function download(content, fileName, contentType) {
		var a = document.createElement("a");
		var file = new Blob([JSON.stringify(content, null, 2)], {type: contentType});
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	}
	
});




