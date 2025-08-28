const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

// Modal
const modal = document.getElementById("pokemonModal");
const modalContent = document.querySelector(".modal-content");
const modalName = document.getElementById("modalName");
const modalTypes = document.getElementById("modalTypes");
const modalImage = document.getElementById("modalImage");
const modalAbilities = document.getElementById("modalAbilities");
const modalBaseStatus = document.getElementById("modalBaseStatus");
const spanClose = document.querySelector(".close");

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function openModal(pokemon) {
  modal.classList.add("show");

  modalContent.style.background = getTypeColor(pokemon.types[0]);

  modalName.textContent = `#${pokemon.number} ${capitalize(pokemon.name)}`;

  modalTypes.innerHTML = "";
  pokemon.types.forEach((type) => {
    const li = document.createElement("li");
    li.textContent = type;
    li.style.backgroundColor = getTypeColor(type);
    modalTypes.appendChild(li);
  });

  modalAbilities.innerHTML = "<h2>Habilidades</h2>";
  pokemon.abilities.forEach((ability) => {
    const li = document.createElement("li");
    li.className = 'habilidade';
    li.textContent = capitalize(ability);
    modalAbilities.appendChild(li);
  });

  modalBaseStatus.innerHTML = "<h2>Status base</h2>";
  pokemon.stats.forEach((stat) => {
    const li = document.createElement("li");
    li.className = 'status';
    li.textContent = `${capitalize(stat.name)}: ${stat.value}`;
    modalBaseStatus.appendChild(li);
  })

  modalImage.src = pokemon.photo;
  modalImage.alt = pokemon.name;
}

spanClose.onclick = () => {
  modal.classList.remove("show");
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.classList.remove("show");
  }
};

function getTypeColor(type) {
  const colors = {
    normal: "#a6a877",
    grass: "#77c850",
    fire: "#ee7f30",
    water: "#678fee",
    electric: "#f7cf2e",
    ice: "#98d5d7",
    ground: "#dfbf69",
    flying: "#a98ff0",
    poison: "#a040a0",
    fighting: "#bf3029",
    psychic: "#f65687",
    dark: "#725847",
    rock: "#b8a137",
    bug: "#a8b720",
    ghost: "#6e5896",
    steel: "#b9b7cf",
    dragon: "#6f38f6",
    fairy: "#f9aec7",
  };
  return colors[type] || "#000";
}

pokemonList.addEventListener("click", (event) => {
  const li = event.target.closest("li.pokemon");
  if (!li) return;

  const number = li.querySelector(".number").textContent.replace("#", "");

  pokeApi.getPokemons(0, maxRecords).then((pokemons) => {
    const clickedPokemon = pokemons.find((p) => p.number == number);
    if (clickedPokemon) openModal(clickedPokemon);
  });
});
