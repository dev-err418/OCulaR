const key = "add your google cloud vision api key";
const url = `https://vision.googleapis.com/v1/images:annotate?key=${key}`;

const createBody = (image) => {
   const body = {
      requests: [
         {
	    image: {
	       content: image,
	    },
	    features: [
	       {
	          type: "TEXT_DETECTION",
		  maxResults: 1,
	       },
	    ],
	 },
      ],
   };

   return body;
}

const callGoogleVision = async (image) => {
   const body = createBody(image);
   const response = await fetch(url, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json",},body: JSON.stringify(body),});
   const result = await response.json()
   const detectedText = result.responses[0].fullTextAnnotation;
   const boundingBoxes = result.responses[0].textAnnotations;
   // array : [ { vertices: [ {x: , y: } ] }]
   detectedText.boundingBoxes = boundingBoxes;
   console.log("helperFunctions", result)
   return detectedText ? detectedText : {text: "This image doesn't contain text"}
}

export default callGoogleVision;
