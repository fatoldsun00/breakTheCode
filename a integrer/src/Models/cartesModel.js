const AppError = require('../Services/AppError')

let Cartes = [{
  id:1,
  label: "Combien de chiffres blanc as-tu",
  fn: (jetons)=>{
    let nbrJeton = 0
    for (const [k, jeton] of Object.entries(jetons)) {
      if (jeton.coul == 'blanc'){
        nbrJeton++
      }
    }
    return nbrJeton
    return jetons.filter(jeton => jeton.coul == 'blanc').length
  }
},{
  id:2,
  label: "Combien de chiffres noir as-tu",
  fn: (jetons)=>{
    let nbrJeton = 0
    for (const [k, jeton] of Object.entries(jetons)) {
      if (jeton.coul == 'noir'){
        nbrJeton++
      }
    }
    return nbrJeton
    return jetons.filter(jeton => jeton.coul == 'noir').length
  }
},{
  id:3,
  label: "Quel est la sommes des tes chiffres blanc",
  fn: (jetons)=>{
    let somme = 0
    for (const [k, jeton] of Object.entries(jetons)) {
      if (jeton.coul == 'blanc'){
        somme += jeton.val
      }
    }
    return somme
  }
},{
  id:4,
  label: "Quel est la sommes des tes chiffres noir",
  fn: (jetons)=>{
    let somme = 0
    for (const [k, jeton] of Object.entries(jetons)) {
      if (jeton.coul == 'noir'){
        somme += jeton.val
      }
    }
    return somme
  }
},{
  id:5,
  label: "Quel est la sommes des tes chiffres du milieu",
  fn: (jetons)=>{
    return jetons[1].val+jetons[2].val+jetons[3].val
  }
},{
  id:6,
  label: "Combien de chiffres blanc as-tu",
  fn: (jetons)=>{
    let nbrJeton = 0
    for (const [k, jeton] of Object.entries(jetons)) {
      if (jeton.coul == 'blanc'){
        nbrJeton++
      }
    }
    return nbrJeton
  }
},
]
module.exports = {
  Cartes
};
