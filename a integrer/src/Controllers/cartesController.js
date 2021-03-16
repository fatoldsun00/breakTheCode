
const { Cartes } = require('../Models/cartesModel')

const Carte = (() => {
  const genereCarte = () =>  {
    let cartesShuffled
    try {
      cartesShuffled = Cartes.slice();
      for (let i = cartesShuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartesShuffled[i], cartesShuffled[j]] = [cartesShuffled[j], cartesShuffled[i]];
      }
    } catch (err) {
      console.log(err)
    }
   
    return cartesShuffled
  }

  const getCarte = (idCarte) =>  {
    return Cartes.filter(carte => carte.id==idCarte)[0]
  }
  return {
    genereCarte,
    getCarte
  }
})()

module.exports = {
  Carte
};
