window.onload = (event) => {
	const myButton = document.getElementById("myButton");
	const myButton2 = document.getElementById("myButton2");
	const myButton3 = document.getElementById("myButton3");
	
	myButton.addEventListener("click", () => {
		console.log(Excel.files[0]);
		const formData = new FormData();
		formData.append('file', Excel.files[0]);

		fetch('http://localhost:8000/cluster_count_analysis', {
			method: 'POST',
			body: formData,
			credentials: 'include'
		})
		.then(response => {
			const reader = response.body.getReader();
			return new ReadableStream({
				start(controller){
					return pump();
					function pump(){
						return reader.read().then(({done, value}) => {
							if(done){
								controller.close();
								console.log("done!");
								return;
							}
							controller.enqueue(value);
							return pump();
						})
					}
				}
			})
		})
		.then((stream) => new Response(stream))
		.then((response) => response.blob())
		.then((blob) => URL.createObjectURL(blob))
		.then((url) => {
			image = document.getElementById('myImg');
			image.src = url;
		})
		.catch(error => {
			console.error(error);
		});
	}
);

	myButton2.addEventListener("click", () => {
		console.log(Excel.files[0]);
		const formData = new FormData();
		formData.append('file', Excel.files[0]);

		fetch('http://localhost:8000/return_wordcount', {
			method: 'POST',
			body: formData
		})
		.then(response => {
			const reader = response.body.getReader();
			return new ReadableStream({
				start(controller){
					return pump();
					function pump(){
						return reader.read().then(({done, value}) => {
							if(done){
								controller.close();
								console.log("done!");
								return;
							}
							controller.enqueue(value);
							return pump();
						})
					}
				}
			})
		})
		.then((stream) => new Response(stream))
		.then((response) => response.blob())
		.then((blob) => URL.createObjectURL(blob))
		.then((url) => {
			image = document.getElementById('myImg');
			image.src = url;
		})
		.catch(error => {
			console.error(error);
		});
	}

	
);

myButton3.addEventListener('click', () => ldaTest())
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

function ldaTest(){
	fetch('http://localhost:8000/monthly_dist?clusters=14',
	{
		method: 'POST',
		credentials: 'include'
	} )
}

const inputFile = document.querySelector('input[type="file"]');



