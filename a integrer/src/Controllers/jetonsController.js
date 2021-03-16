
const { Jetons } = require('../Models/jetonsModel')

const Jeton = (() => {

  const genereJetons = (nbrJoueurs) => {
    try{
      //On clone les jetons
      let tempJettons = Jetons.slice()
      let arrJetonsJoueurs = []
      //Distribution
      for(let nbrJettons=0;nbrJettons<(nbrJoueurs*5);nbrJettons++) {
          let indexRandom = Math.floor(Math.random() * tempJettons.length) 
          if (!arrJetonsJoueurs[(nbrJettons%nbrJoueurs)]) arrJetonsJoueurs[(nbrJettons%nbrJoueurs)] = []
          arrJetonsJoueurs[(nbrJettons%nbrJoueurs)].push(tempJettons[indexRandom])
          tempJettons.splice(indexRandom,1 )
      }
  
      //sort des chiffres et des couleurs
      for(k in arrJetonsJoueurs) {
        arrJetonsJoueurs[k]=arrJetonsJoueurs[k].sort((a,b) => (a.val > b.val) ? 1 : ((b.val > a.val) ? -1 : ((b.coul=='blanc') ? -1 : 1)))
      }
      return arrJetonsJoueurs
    } catch (err) {
      console.log(err)
    }
  }

  return {
    genereJetons
  }
  /****************************** Private *******************************************/
})()

module.exports = {
  Jeton
};
