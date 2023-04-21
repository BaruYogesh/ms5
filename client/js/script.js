window.onload = (event) => {
    const myButton = document.getElementById("myButton");
    const myButton2 = document.getElementById("myButton2");
    const myButton3 = document.getElementById("myButton3");

    myButton.addEventListener("click", () => {
        console.log(Excel.files[0]);
        const formData = new FormData();
        formData.append("file", Excel.files[0]);

        fetch("http://localhost:8000/cluster_count_analysis", {
            method: "POST",
            body: formData,
            credentials: "include",
        })
            .then((response) => {
                const reader = response.body.getReader();
                return new ReadableStream({
                    start(controller) {
                        return pump();
                        function pump() {
                            return reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    console.log("done!");
                                    return;
                                }
                                controller.enqueue(value);
                                return pump();
                            });
                        }
                    },
                });
            })
            .then((stream) => new Response(stream))
            .then((response) => response.blob())
            .then((blob) => URL.createObjectURL(blob))
            .then((url) => {
                image = document.getElementById("myImg");
                image.src = url;
            })
            .catch((error) => {
                console.error(error);
            });
    });

    myButton2.addEventListener("click", () => {
        console.log(Excel.files[0]);
        const formData = new FormData();
        formData.append("file", Excel.files[0]);

        fetch("http://localhost:8000/return_wordcount", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                const reader = response.body.getReader();
                return new ReadableStream({
                    start(controller) {
                        return pump();
                        function pump() {
                            return reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    console.log("done!");
                                    return;
                                }
                                controller.enqueue(value);
                                return pump();
                            });
                        }
                    },
                });
            })
            .then((stream) => new Response(stream))
            .then((response) => response.blob())
            .then((blob) => URL.createObjectURL(blob))
            .then((url) => {
                image = document.getElementById("myImg");
                image.src = url;
            })
            .catch((error) => {
                console.error(error);
            });
    });

    myButton3.addEventListener("click", () => ldaTest());

    const resultJSONExample = {
        0: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_0.png",
            topic0: ["series", "or", "your"],
            topic1: ["registration", "event", "template"],
        },
        1: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_1.png",
            topic0: ["captions", "closed", "is"],
            topic1: ["slido", "events", "registration"],
        },
        2: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_2.png",
            topic0: ["remote", "application", "webex"],
            topic1: ["broadcast", "message", "disable"],
        },
        3: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_3.png",
            topic0: ["ipad", "virtual", "menu"],
            topic1: ["web", "mobile", "you"],
        },
        4: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_4.png",
            topic0: ["webinars", "lobby", "languages"],
            topic1: ["whiteboard", "you", "app"],
        },
        5: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_5.png",
            topic0: ["recordings", "default", "meeting"],
            topic1: ["management", "administration", "now"],
        },
        6: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_6.png",
            topic0: ["of", "polling", "report"],
            topic1: ["session", "practice", "an"],
        },
        7: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_7.png",
            topic0: ["participant", "remove", "lobby"],
            topic1: ["statistics", "change", "end"],
        },
        8: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_8.png",
            topic0: ["webex", "meetings", "focus"],
            topic1: ["your", "self", "video"],
        },
        9: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_9.png",
            topic0: ["camera", "stage", "video"],
            topic1: ["all", "feature", "option"],
        },
        10: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_10.png",
            topic0: ["add", "reactions", "windows"],
            topic1: ["or", "ports", "maximum"],
        },
        11: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_11.png",
            topic0: ["their", "name", "settings"],
            topic1: ["device", "join", "hear"],
        },
        12: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_12.png",
            topic0: ["registration", "your", "update"],
            topic1: ["layout", "recording", "stage"],
        },
        13: {
            graph: "1ed0a37d-d9ba-46a8-810e-7959cc68b7e9_13.png",
            topic0: ["company", "registry", "meeting"],
            topic1: ["000", "video", "duplicated"],
        },
    };

    populateCarousel(resultJSONExample);

    console.log("page is fully loaded");
};

function openFile(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function () {
        const text = reader.result;
        console.log(text);
    };
    reader.readAsText(input.value);
}

function ldaTest() {
    fetch("http://localhost:8000/monthly_dist?clusters=14", {
        method: "POST",
        credentials: "include",
    });
}

const inputFile = document.querySelector('input[type="file"]');

function populateCarousel(results) {
    let indicators = document.getElementById("carouselIndicators");
    let images = document.getElementById("carouselImages");

    Object.values(results).forEach((result, i) => {
        let indicatorElement = document.createElement("button");
        indicatorElement.setAttribute("type", "button");
        indicatorElement.setAttribute(
            "data-bs-target",
            "#carouselExampleIndicators"
        );
        indicatorElement.setAttribute("data-bs-slide-to", `${i}`);
        indicatorElement.setAttribute("aria-label", `Slide ${i++}`);

        indicators.appendChild(indicatorElement);

        let itemElement = document.createElement("div");
        let itemImageElement = document.createElement("img");
        let itemCaptionElement = document.createElement("div");

        let captionLabelElement = document.createElement("h5");
        let captionTopicsElement = document.createElement("p");

        itemElement.className = "carousel-item";

        itemImageElement.setAttribute(
            "src",
            `http://localhost:8000/imgs/${result.graph}`
        );
        itemImageElement.classList.add(["d-block"]);

        itemCaptionElement.classList.add([
            "carousel-caption",
            "d-none",
            "d-md-block",
        ]);

        captionLabelElement.innerText = `Cluster ${i} topics:`;
        captionTopicsElement.innerText = `${result.topic0.join(
            ", "
        )} | ${result.topic1.join(", ")}`;

        itemCaptionElement.appendChild(captionLabelElement);
        itemCaptionElement.appendChild(captionTopicsElement);

        itemElement.appendChild(itemImageElement);
        itemElement.appendChild(itemCaptionElement);

        images.appendChild(itemElement);
    });

    indicators.children.item(0).classList.add("active");
    images.children.item(0).classList.add("active");
}
