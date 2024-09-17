// Given this 'postData' util function, write a React TypeScript component page called RidiImageGenerater allow user to input bookId, when click "Generate" button, postData function will be executed, the jsonResponse will be shown in a JSON mapper component; If user click "Download All" button all the images of src urls in jsonResponse will be downloaded

export async function postData(url = "", data = {}) {
  try {
    // Sending the POST request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

/**
    postData("https://ridibooks.com/api/web-viewer/generate", {
    book_id: "2404013544",
    }).then((jsonResponse) => {
    if (jsonResponse) {
    // Handle the JSON response data
    console.log("Received JSON:", jsonResponse);
    }
    });
 */
