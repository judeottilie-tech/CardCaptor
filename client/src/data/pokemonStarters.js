export const STARTER_LINES = [
  { stage1: "Bulbasaur", stage2: "Ivysaur", stage3: "Venusaur" },
  { stage1: "Charmander", stage2: "Charmeleon", stage3: "Charizard" },
  { stage1: "Squirtle", stage2: "Wartortle", stage3: "Blastoise" },
  { stage1: "Chikorita", stage2: "Bayleef", stage3: "Meganium" },
  { stage1: "Cyndaquil", stage2: "Quilava", stage3: "Typhlosion" },
  { stage1: "Totodile", stage2: "Croconaw", stage3: "Feraligatr" },
  { stage1: "Treecko", stage2: "Grovyle", stage3: "Sceptile" },
  { stage1: "Torchic", stage2: "Combusken", stage3: "Blaziken" },
  { stage1: "Mudkip", stage2: "Marshtomp", stage3: "Swampert" },
  { stage1: "Turtwig", stage2: "Grotle", stage3: "Torterra" },
  { stage1: "Chimchar", stage2: "Monferno", stage3: "Infernape" },
  { stage1: "Piplup", stage2: "Prinplup", stage3: "Empoleon" },
  { stage1: "Snivy", stage2: "Servine", stage3: "Serperior" },
  { stage1: "Tepig", stage2: "Pignite", stage3: "Emboar" },
  { stage1: "Oshawott", stage2: "Dewott", stage3: "Samurott" },
  { stage1: "Chespin", stage2: "Quilladin", stage3: "Chesnaught" },
  { stage1: "Fennekin", stage2: "Braixen", stage3: "Delphox" },
  { stage1: "Froakie", stage2: "Frogadier", stage3: "Greninja" },
  { stage1: "Rowlet", stage2: "Dartrix", stage3: "Decidueye" },
  { stage1: "Litten", stage2: "Torracat", stage3: "Incineroar" },
  { stage1: "Popplio", stage2: "Brionne", stage3: "Primarina" },
  { stage1: "Grookey", stage2: "Thwackey", stage3: "Rillaboom" },
  { stage1: "Scorbunny", stage2: "Raboot", stage3: "Cinderace" },
  { stage1: "Sobble", stage2: "Drizzile", stage3: "Inteleon" },
  { stage1: "Sprigatito", stage2: "Floragato", stage3: "Meowscarada" },
  { stage1: "Fuecoco", stage2: "Crocalor", stage3: "Skeledirge" },
  { stage1: "Quaxly", stage2: "Quaxwell", stage3: "Quaquaval" },
];

export const getSpriteUrl = (pokemonName) =>
  `https://play.pokemonshowdown.com/sprites/ani/${pokemonName.toLowerCase()}.gif`;

const NATIONAL_DEX_NUMBER = {
  Bulbasaur: 1, Ivysaur: 2, Venusaur: 3,
  Charmander: 4, Charmeleon: 5, Charizard: 6,
  Squirtle: 7, Wartortle: 8, Blastoise: 9,
  Chikorita: 152, Bayleef: 153, Meganium: 154,
  Cyndaquil: 155, Quilava: 156, Typhlosion: 157,
  Totodile: 158, Croconaw: 159, Feraligatr: 160,
  Treecko: 252, Grovyle: 253, Sceptile: 254,
  Torchic: 255, Combusken: 256, Blaziken: 257,
  Mudkip: 258, Marshtomp: 259, Swampert: 260,
  Turtwig: 387, Grotle: 388, Torterra: 389,
  Chimchar: 390, Monferno: 391, Infernape: 392,
  Piplup: 393, Prinplup: 394, Empoleon: 395,
  Snivy: 495, Servine: 496, Serperior: 497,
  Tepig: 498, Pignite: 499, Emboar: 500,
  Oshawott: 501, Dewott: 502, Samurott: 503,
  Chespin: 650, Quilladin: 651, Chesnaught: 652,
  Fennekin: 653, Braixen: 654, Delphox: 655,
  Froakie: 656, Frogadier: 657, Greninja: 658,
  Rowlet: 722, Dartrix: 723, Decidueye: 724,
  Litten: 725, Torracat: 726, Incineroar: 727,
  Popplio: 728, Brionne: 729, Primarina: 730,
  Grookey: 810, Thwackey: 811, Rillaboom: 812,
  Scorbunny: 813, Raboot: 814, Cinderace: 815,
  Sobble: 816, Drizzile: 817, Inteleon: 818,
  Sprigatito: 906, Floragato: 907, Meowscarada: 908,
  Fuecoco: 909, Crocalor: 910, Skeledirge: 911,
  Quaxly: 912, Quaxwell: 913, Quaquaval: 914,
};

export const getPortraitUrl = (pokemonName) => {
  const dexNumber = NATIONAL_DEX_NUMBER[pokemonName];
  const id = String(dexNumber).padStart(4, "0");
  return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${id}/Normal.png`;
};
