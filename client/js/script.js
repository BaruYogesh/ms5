window.onload = (event) => {
	const myButton = document.getElementById("myButton");
	
	myButton.addEventListener("click", () => {
	console.log(Excel.files[0]);
	formData.append('file', Excel.files[0]);

	fetch('http://127.0.0.1:8000/cluster_count_analysis', {
		method: 'POST',
		body: formData
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.error(error);
	});
});

	console.log("page is fully loaded");
  };



function openFile(event){
	const input = event.target;
	const reader = new FileReader();
	reader.onload = function() {
		const text = reader.result;
		console.log(text);
	};
	reader.readAsText(input.value);
}

const inputFile = document.querySelector('input[type="file"]');

const formData = new FormData();



