window.onload = (event) => {
	const myButton = document.getElementById("myButton");
	const myButton2 = document.getElementById("myButton2");
	
	myButton.addEventListener("click", () => {
		console.log(Excel.files[0]);
		const formData = new FormData();
		formData.append('file', Excel.files[0]);

		fetch('http://127.0.0.1:8000/cluster_count_analysis', {
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

	myButton2.addEventListener("click", () => {
		fetch('http://127.0.0.1:8000/monthly_dist?clusters=14', {
			method: 'POST'
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
		.then((blob) => openFile(blob))
		.then((file_data) => {
			JSZip.loadAsync(data)
			.then( (data) => {
				console.log(data);
			});
		})
		// .then((blob) => URL.createObjectURL(blob))
		// .then((href) => {
		// 	image = document.getElementById('myImg');
		// 	image.src = url;
		// })
		.catch(error => {
			console.error(error);
		});
	}
);

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



