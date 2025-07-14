// Index

function redirect(data) {
  sessionStorage.setItem("siteData", JSON.stringify(data));
  value = data.nota_total;
  if (value == undefined) {
    loadAnimation();
    return;
  }
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
  loadAnim = document.getElementById("loader"); 
  textBox = document.getElementById("TextBox");
  topCloud = document.getElementById("top-cloud");
  botCloud = document.getElementById("bot-cloud");
  topCloudDiv = document.getElementById("top-wrapper");
  botCloudDiv = document.getElementById("bot-wrapper");

  topCloud.classList.toggle("top-close");
  botCloud.classList.toggle("bot-close");
  topCloudDiv.classList.toggle("top-wrapper-active");
  botCloudDiv.classList.toggle("bot-wrapper-active");
  textBox.classList.toggle("hidden");
  loadAnim.classList.toggle("hidden");  
}

function fetchLink() {
  vul = document.getElementById("vulnera").checked;
  if (vul) {
    vul = 1;
  } else {
    vul = 0;
  }
  
  autohttps = document.getElementById("auto-https").checked;
  const input = document.getElementById("input-link");
  if (input.value == "") {
    return;
  }
  let url = sanatize(input.value);
  let data;
  if (url != "") {
    if (!url.startsWith("https://") && !autohttps) {
      url = "https://" + url;
    }
    console.log(`https://egapi.onrender.com/api/scan?url=${url}&verif=${vul}`);

    loadAnimation();
    data = fetch(`https://egapi.onrender.com/api/scan?url=${url}&verif=${vul}`)
      .then((res) => res.json())
      .then((data) => redirect(data))
      .catch((error) => console.log(error));
  }
}

// Response Pages

function nerds(data) {
  stringTagNerds = "";
  stringInfoNerds = "";
  websiteName = "";
  console.log(data);

  tagNerds = document.getElementById("inner-left-nerds");
  infoNerds = document.getElementById("inner-right-nerds");
  for (key in data) {
    if (data.hasOwnProperty(key)) {
      stringTagNerds += key + ": <br>";
      stringInfoNerds += data[key] + "<br>"
    }
  }

  infoNerds.innerHTML = stringInfoNerds;
  tagNerds.innerHTML = stringTagNerds;
}

function getJSON() {
  data = JSON.parse(sessionStorage.getItem("siteData"));
  //console.log(data);
  //document.getElementById("box-right").innerHTML = data.site;
  return data;
}

function displayJSON(data) {
  stringTag = "";
  stringInfo = "";
  websiteName = "o link";
  console.log(data);

  tag = document.getElementById("inner-left");
  info = document.getElementById("inner-right");
  for (key in data) {
    if (data.hasOwnProperty(key)) {
      switch (key) {
        case "ano_criacao":
          if (data[key] == "Nao foi possivel obter o ano de criacao") {
            break;
          }
          stringTag += "Ano de Criação:<br>";
          stringInfo += data[key] + "<br>";
          break;
        case "tempo_de_existencia":
          if (data[key] == "Nao foi possivel obter o tempo de criacao anos") {
            break;
          }
          stringTag += "Tempo de existência:<br>";
          stringInfo += data[key] + "<br>";
          break;
        case "hospedado":
          stringTag += "O site utiliza o servidor:<br>";
          stringInfo +=
            data[key].replace("O site utiliza o servidor: ", "") + "<br>";
          break;
        case "ssl":
          stringTag += "Certificado SSL:<br>";
          temp =
            data[key].replace("O website ", "").charAt(0).toUpperCase() +
            data[key].replace("O website ", "").slice(1);
          stringInfo += temp + "<br>";
          break;
        case "vulneravel_a_alteracao":
          if (data[key] == "Sem scan") {
            break;
          }
          stringTag += "O site é vulnerável<br>";
          stringInfo += "<br>";
          break;
        case "vulneravel_a_dataleak":
          if (data[key] == "Sem scan") {
            break;
          }
          stringTag += "O dados são vulneráveis<br>";
          stringInfo += "<br>";
          break;
        case "tipo_de_uso":
          stringTag += "Tipo de uso:<br>";
          stringInfo += data[key] + "<br>";
          break;
        case "whois":
          nerds(data["whois"]);
          break;
        case "download":
          stringTag += "O site faz download:<br>";
          if (data[key]["tipo_de_arquivo"] == null) {
            stringInfo += data[key]["content_type"] + "<br>";
          } else {
            stringInfo += "O site baixa arquivos<br>";
          }
          break;
        case "site":
          websiteName = data[key]
            .replace("https://", "")
            .replace("http://", "");
          break;
        case "nota_dos_usuarios":
          if (data[key] == null) {
            break;
          }
          stringTag += "Classificação por usuários:<br>";
          stringInfo += data[key] + "<br>";
          break;
        case "ip_total_reports":
          stringTag += "Esse ip foi reportado:<br>";
          if (data[key] != "1") {
            stringInfo += data[key] + " vezes<br>";
          } else {
            stringInfo += data[key] + " veze<br>";
          }
          break;
        case "ALERTA":
          stringTag += "ALTO PERIGO: <br>";
          stringInfo += data[key] + "<br>";
          document.getElementById("nerd-button").classList.toggle("hidden");
          break;
      }
    }
  }

  nota = data["nota_total"];
  if (nota[1] == '0') {
    nota = "10";
  } else {
    nota = nota[0];
  }

  nota = parseInt(nota);
  nota = 10 - nota;

  info.innerHTML = stringInfo;
  tag.innerHTML = stringTag;
  document.getElementById("website-name").innerHTML = websiteName;
  document.getElementById("nota").innerHTML = `${nota}/10`;
}
