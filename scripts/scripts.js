// query selectors
const submitAction = document.querySelector("form");

const table = document.querySelector("table");

const tableBody = document.querySelector("#tbody");

const resetAction = document.querySelector("#btn-reset");

const tableDiv = document.querySelector("#tablediv");

function getCardName(res) {
  let cardName = res.data.cards.map((card) => card.name);
  return cardName;
}

function getCardText(res) {
  let cardText = res.data.cards.map((card) => card.text);
  return cardText;
}

function getManaCost(res) {
  let cardManaCost = res.data.cards.map((card) => card.manaCost);
  return cardManaCost;
}

function displayManaCostImagery(arr) {
  const symbolImageUrl = {
    X: "X.png",
    // Tap symbol
    T: "T.png",
    // Main colors symbol
    W: "W.png",
    R: "R.png",
    B: "B.png",
    G: "G.png",
    U: "U.png",
    // Numerical symbol
    C: "C.png",
    "0": "0.png",
    "1": "1.png",
    "2": "2.png",
    "3": "3.png",
    "4": "4.png",
    "5": "5.png",
    "6": "6.png",
    "7": "7.png",
    "8": "8.png",
    "9": "9.png",
    "10": "10.png",
    "11": "11.png",
    "12": "12.png",
    "13": "13.png",
    "14": "14.png",
    "15": "15.png",
    // Hybrid symbols
    "W/U": "WU.png",
    "W/B": "WB.png",
    "U/B": "UB.png",
    "U/R": "UR.png",
    "B/R": "BR.png",
    "B/G": "BG.png",
    "R/G": "RG.png",
    "R/W": "RW.png",
    "G/W": "GW.png",
    "G/U": "GU.png",
  };

  const result = arr.map((element) => {
    if (element) {
      let arrOfCosts = element.split("}");
      arrOfCosts = arrOfCosts.map((element) =>
        element.replace("{", "").replace("}", "")
      );
      arrOfCosts.forEach((element, index, arr) => {
        if (symbolImageUrl[element]) {
          arr[
            index
          ] = `<img src="img/${symbolImageUrl[element]}" style="height: 15px; width: 15px;">`;
        }
      });
      return arrOfCosts.join("");
    } else {
      return "No mana cost";
    }
  });
  return result;
}

function createImage(imgUrl) {
  let newImg = document.createElement("img");
  newImg.src = imgUrl;
  return newImg;
}

function getImageUrl(res) {
  let cardImageUrl = res.data.cards.map((card) => {
    if (card.imageUrl) {
      let img = createImage(card.imageUrl);
      return img;
    } else {
      return "No image available";
    }
  });
  return cardImageUrl;
}

function getCardCollection(res) {
  let cardCollection = res.data.cards.map((card) => card.setName);
  return cardCollection;
}

function createParagraphOnBody(p) {
  let newPara = document.createElement("p");
  newPara.innerHTML = p;
  tableDiv.appendChild(newPara);
}

const cardImagePositionOnArray = 0;

function createRow(
  cardImageUrl,
  cardCollection,
  cardName,
  cardText,
  cardManaCost
) {
  let listOfInfo = [
    cardImageUrl,
    cardCollection,
    cardName,
    cardText,
    cardManaCost,
  ];

  let tableBody = document.querySelector("tbody");
  for (let i = 0; i < cardName.length; i++) {
    let newTr = document.createElement("tr");
    let newRow = tableBody.appendChild(newTr);
    for (let j = 0; j < listOfInfo.length; j++) {
      let newTd = document.createElement("td");
      let info = listOfInfo[j][i];
      // verifies if the element is an HTML Img
      if (j === cardImagePositionOnArray && info instanceof HTMLImageElement) {
        newTd.appendChild(info);
      } else {
        newTd.innerHTML = info;
      }
      newRow.appendChild(newTd);
    }
  }
}

submitAction.addEventListener("submit", async function (e) {
  tableBody.innerHTML = "";
  table.hidden = true;
  const input = document.querySelector("input").value.trim();
  const url = "https://api.magicthegathering.io/v1/cards";
  e.preventDefault();
  try {
    let res = await axios.get(`${url}/?name=${input}`);
    if (res.data.cards.length > 0) {
      let cardImageUrl = getImageUrl(res);
      let cardCollection = getCardCollection(res);
      let cardName = getCardName(res);
      let cardText = getCardText(res);
      let cardManaCost = getManaCost(res);
      const allImgs = document.querySelectorAll("img");
      for (img of allImgs) {
        img.classList.add("img-fluid");
      }
      checkHiddenTable();
      cardManaCost = displayManaCostImagery(cardManaCost);
      createRow(cardImageUrl, cardCollection, cardName, cardText, cardManaCost);
    } else {
      createParagraphOnBody("No cards found!");
    }
  } catch (e) {
    createParagraphOnBody(
      "Sorry, we had a problem with your request. Try it again later!"
    );
    console.log(e);
  }
});

resetAction.addEventListener("click", () => {
  tableBody.innerHTML = "";
  checkHiddenTable();
});

function checkHiddenTable() {
  table.hidden = !table.hidden;
}
