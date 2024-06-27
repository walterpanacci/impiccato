const wordContainer = document.querySelector(".word-container");
const errorsContainer = document.querySelector(".errors-container");
const buttonLetter = document.querySelector(".button-guess-letter");
const buttonWord = document.querySelector(".button-guess-word");
const guessLetter = document.querySelector(".guess-letter");
const guessWord = document.querySelector(".guess-word");
const hangman = document.querySelector(".hangman");
const comments = document.querySelector(".comments");
const overlay = document.querySelector(".overlay");
const modalWindow = document.querySelector(".modal-window");
const buttonRestart = document.querySelectorAll(".button-restart");
const winningWindow = document.querySelector(".winning-window");
const losingText = document.querySelector(".losing-text");
const winningText = document.querySelector(".winning-text");
const body = document.querySelector("body");
const buttonsBookmark = document.querySelectorAll(".button-bookmark");
const bookmarksTitle = document.querySelector(".bookmarks-title");
const bookmarksContainer = document.querySelector(".bookmarks");

let errors = 0;
let word = "";
let wordArray = [];
const storage = localStorage.getItem("bookmarks");
let bookmarks = storage ? JSON.parse(storage) : [];
let listaParole = trovaParole();
let nParole = 0;

async function trovaParole() {
  const res = await fetch(
    "https://gist.githubusercontent.com/walterpanacci/99cd0a675093021ef1500cfa284eb263/raw/ad6438a37eeb4596b848aa79f5682f68d6adc12c/gist.json"
  );
  data = await res.json();
  listaParole = data.parole;
  nParole = listaParole.length;
  renderWord();
  console.log(data.parole, 1);
}

const renderBookmark = function (el) {
  bookmarksContainer.insertAdjacentHTML(
    "beforeend",
    `<div class='bookmarked' word='${el}'>${el}<button class='remove-bookmark'>Rimuovi dai preferiti</button></div>
    `
  );
};

if (storage) {
  //console.log(storage);
  bookmarksTitle.classList.remove("hidden");
  bookmarks.forEach((el) => renderBookmark(el));
}

const getWord = function () {
  const n = Math.floor(Math.random() * nParole);
  console.log(listaParole[n]);
  return listaParole[n];
};

const renderWord = function () {
  word = getWord();
  wordContainer.innerHTML = "";
  wordArray = word.split("");
  wordArray.forEach((el, i) =>
    wordContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="covered" data-number=${i}>_</div>
      <div class="letter hidden" data-number=${i}>${el}</div>`
    )
  );
};
const checkGuess = function (letter) {
  guessLetter.value = "";
  comments.textContent = "";
  if (letter.length !== 1) {
    //console.log("ok");
    comments.textContent =
      "Devi inserire SOLO UNA lettera. Sarò generoso, questa non te la conterò come errore...";
    return;
  }
  if (!wordArray.includes(letter)) {
    errors++;
    errorsContainer.insertAdjacentHTML(
      "afterbegin",
      `<div class="error">${letter}</div>`
    );
    hangman.setAttribute("src", `img/hangman-${errors}.png`);
  } else
    wordArray.forEach((el, i) => {
      if (el === letter) {
        document
          .querySelector(`.letter[data-number='${i}']`)
          .classList.remove("hidden");
        document
          .querySelector(`.covered[data-number='${i}']`)
          .classList.add("hidden");
        //console.log(errors);

        return;
      }
    });
  if (errors === 6) {
    const x = Math.trunc(Math.random() * (losing - 1) + 1);
    losingText.innerHTML = `Hai perso, la parola era <strong>${word}</strong><br>${losingQuotes[x]}`;
    /*modalWindow.insertAdjacentHTML(
      "afterbegin",
      `<p>Hai perso, la parola era: <strong>${word}</strong>. ${losingQuotes[1]}</p>`
    );*/
    hangman.setAttribute("src", `img/hangman-${errors}.png`);
    buttonLetter.classList.add("game-finished");
    buttonWord.classList.add("game-finished");
    modalWindow.classList.remove("hidden");
    //overlay.classList.remove("hidden");
  }
};

buttonLetter.addEventListener("click", function (e) {
  e.preventDefault();
  comments.textContent = "";
  const letter = guessLetter.value.toLowerCase();
  checkGuess(letter);
});

buttonWord.addEventListener("click", function (e) {
  e.preventDefault();
  const guess = guessWord.value;
  if (guess.length === 0) {
    comments.textContent =
      "Devi inserire una parola prima di premere il pulsante...farò finta di niente...";
    return;
  }

  if (guess === word) {
    comments.textContent = "";
    const x = Math.trunc(Math.random() * (winning - 1) + 1);
    winningText.innerHTML = `🎉🎉 Proprio così, la parola era <strong class='solution'>${word}</strong><br><blockquote>${winningQuotes[x]}</blockquote>`;
    document
      .querySelectorAll(".covered")
      .forEach((el) => el.classList.add("hidden"));
    document
      .querySelectorAll(".letter")
      .forEach((el) => el.classList.remove("hidden"));
    body.classList.add("winner");
    winningWindow.classList.remove("hidden");
  } else {
    guessWord.value = "";
    errors++;
    comments.textContent = "NNNNNNNNNO...";
    hangman.setAttribute("src", `../img/hangman-${errors}.png`);
    if (errors === 6) {
      //console.log(losingText);
      losingText.insertAdjacentElement = losingQuotes[1];
      buttonLetter.classList.add("game-finished");
      buttonWord.classList.add("game-finished");
    }
  }
});

function restart() {
  errors = 0;
  renderWord();
  guessLetter.value = "";
  guessWord.value = "";
  errorsContainer.innerHTML = "";
  buttonLetter.classList.remove("game-finished");
  buttonWord.classList.remove("game-finished");
  hangman.setAttribute("src", `../img/hangman-${errors}.png`);
  modalWindow.classList.add("hidden");
  winningWindow.classList.add("hidden");
  //overlay.classList.add("hidden");
  body.classList.remove("winner");
}

buttonRestart.forEach((el) =>
  el.addEventListener("click", function (e) {
    e.preventDefault();
    restart();
  })
);
//localStorage.clear();
buttonsBookmark.forEach((el) =>
  el.addEventListener("click", function (e) {
    e.preventDefault();
    bookmarks.push(word);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    renderBookmark(word);
    restart();
    //console.log(bookmarks);
  })
);

bookmarksContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const remove = e.target.closest(".remove-bookmark");
  if (!remove) return;
  const word = remove.closest(".bookmarked").getAttribute("word");
  bookmarks = bookmarks.filter((el) => el !== word);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  const child = document.querySelector(`.bookmarked[word=${word}]`);
  bookmarksContainer.removeChild(child);
  //console.log(child, "ok");
});

const winningQuotes = {
  1: "La vittoria appartiene al più perseverante. - Napoleone Bonaparte",
  2: "La vittoria è sempre possibile per la persona che si rifiuta di fermarsi. - Napoleon Hill",
  3: "La vittoria appartiene a chi crede fermamente in essa e lotta per ottenerla. - Sidney Sheldon",
  4: "La vittoria è un viaggio, non una destinazione. La gioia non sta nel terminare l'attività, ma nell'esperienza stessa. - Greg Anderson",
  5: 'La vittoria è la somma di piccoli sforzi ripetuti giorno dopo giorno." - Robert Collier',
  6: '"La vittoria è dolce ma deve essere accompagnata dalla modestia. - Louis Nizer',
  7: "La vittoria nei giochi è un equilibrio tra talento e tenacia. - Colleen Hoover",
  8: "Vincere non è tutto; è l’unica cosa che conta. - Henry Russell Sanders",
  9: "Nessun vincitore crede al caso. - Friedrich Nietzsche",
  10: "Non è mai solo un gioco quando stai vincendo - George Carlin",
  11: "Crogiolarsi nelle vittorie non è meno pericoloso che recriminare nelle sconfitte. - Roberto Gervaso",
};

const winning = Object.keys(winningQuotes).length;

const losingQuotes = {
  1: "La sconfitta non è la fine; può essere l'inizio di qualcosa di migliore. - Zig Ziglar",
  2: "La sconfitta non è amara a meno che tu non la consideri tale; e se la consideri tale, allora la sconfitta è certa. - Napoleon Hill",
  3: "Non sono stato sconfitto. Ho solo trovato 10.000 modi che non funzionano. - Thomas Edison",
  4: "La sconfitta può essere la più grande delle vittorie se impari qualcosa da essa. - Malcolm S. Forbes",
  5: "La sconfitta non è mai definitiva finché non si smette di provare. - Mike Ditka",
  6: "La sconfitta non è il peggior fallimento. Non provare mai è il vero fallimento. - George Edward Woodberry",
  7: "La sconfitta è solo il test che devi superare per apprezzare il trionfo. - Leon Brown",
  8: "La sconfitta non arriva quando si perde; arriva quando si smette di provare. - Jennifer Nettles",
  9: "La sconfitta può essere dolorosa, ma è anche un'opportunità per rialzarsi più forte di prima. - Rafael Nadal",
  10: "La sconfitta non è mai definitiva, a meno che non si accetti come tale. - Bruce Lee",
  11: "La sconfitta è solo un altro modo per diventare migliori. - Lesley Visser",
  12: "La sconfitta non è un'opzione. Il successo è l'unico risultato accettabile.\" - Henry Rollins",
  13: '"La sconfitta è un\'insegnante straordinaria, e la perseveranza è il suo corso di studio." - Robin Sharma',
};
const losing = Object.keys(losingQuotes).length;
