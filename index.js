// Index

function redirect(data) {
  sessionStorage.setItem("siteData", JSON.stringify(data));
  value = data.nota_total;
  if (value.endsWith("Site seguro")) {
    window.location.href = "safe.html";
  } else if (value.endsWith("Site questionavel")) {
    window.location.href = "suspicious.html";
  } else {
    window.location.href = "unsafe.html";
  }
}

function sanatize(value) {
  return value;
}

function loadAnimation() {
  topCloud = document.getElementById("top-cloud");
  botCloud = document.getElementById("bot-cloud");
  topCloudDiv = document.getElementById("top-wrapper");
  botCloudDiv = document.getElementById("bot-wrapper");

  topCloud.classList.toggle("top-close");
  botCloud.classList.toggle("bot-close");
  topCloudDiv.classList.toggle("top-wrapper-active");
  botCloudDiv.classList.toggle("bot-wrapper-active");
}

function fetchLink() {
  loadAnimation();
  const input = document.getElementById("input-link");
  let url = sanatize(input.value);
  let data;
  if (url != "") {
    if (!url.startsWith("https://")) {
      url = "https://" + url;
    }
    console.log(url);
    data = fetch(
      `https://egapi.onrender.com/api/scan?url=${url}&verif=0`
    )
      .then((res) => res.json())
      .then((data) => redirect(data))
      .catch((error) => console.log(error));
  }
}


// Response Pages

function getJSON() {
    data = JSON.parse(sessionStorage.getItem("siteData"));
    //console.log(data);
    document.getElementById("box-right").innerHTML = data.site;
    return data;
}

function displayJSON(data) {
    string = "";
    console.log(data)
    for (key in data) {
        if (data.hasOwnProperty(key)) {
          string += `${key}: ${data[key]}<br>`
        }
    }
    // console.log(string)
    document.getElementById("box-right").innerHTML = string;
}