import Vue from 'vue'

/*
let listeners = []

Vue.directive('hide-on-click', {
  bind (el, binding, vnode) {
  },
  unbind () {
    document.body.removeEventListener('click', event)
  },
  update (el, binding, vnode) {
    let selfCloseOnClik

    // definition de l'event à lever
    let closeOnClick = function (event) {
      let refreshListener = []
      listeners.forEach((listener, index) => {
        let fire = false
        if (listener.modifiers.anywhere) {
          fire = true
        }

        if (listener.modifiers.outside) {
          if (!(listener.el === event.target || listener.el.contains(event.target))) {
            fire = true
          }
        }

        if (listener.modifiers.inner) {
          if ((listener.el === event.target || listener.el.contains(event.target))) {
            fire = true
          }
        }
        if (fire) {
          listener.vnode.context[listener.expression] = false
        } else {
          refreshListener.push(listener)
        }
      })
      listeners = refreshListener
      if (listeners === undefined || !listeners.length) document.body.removeEventListener('click', selfCloseOnClik)
    }
    // bind new
    if (binding.value && !binding.oldValue) { // si la valeur de lexpression est differente du precendent update
      // On attache l'event au click selon le modifier
      if (!listeners.length) document.body.addEventListener('click', selfCloseOnClik = closeOnClick)
      listeners.push({
        el,
        modifiers: binding.modifiers,
        expression: binding.expression,
        vnode: vnode
      })
    }
  }
})

// Enregistrer une directive globale appelée `v-focus`
Vue.directive('focus', {
  // Quand l'élément lié est inséré dans le DOM...
  inserted: function (el) {
    // L'élément prend le focus
    if (el.nodeName === 'INPUT') {
      el.focus()
    } else {
      // on recherche le premier input enfant
      el.querySelector('input').focus()
    }
  }
})
*/

// Enregistrer une directive globale appelée `v-focus`

let onClickFN = []

Vue.directive('tongue', {
  /*bind: (el, binding) => {
    let display = true
    let classParent = undefined
    //let onClickFN = undefined
    let id = Math.random().toString(36).substr(2, 9)
    if (typeof(binding.value) === "string") {
      classParent=binding.value
    }
    if (typeof(binding.value) === "object") {
      classParent=Object.keys(binding.value)[0]
      if(Object.values(binding.value)[0]) {
        display = true
      } else display = false
    }
    console.log(binding.value)

    if (classParent && display) {
      console.log(binding.value)

      //Ajout de l'element tongue
      let element = document.createElement("div")
      element.classList.add(classParent+"__tongue")
      element.classList.add("tongue")

      //Ajout du listener
      const listenerID =element.addEventListener("click", () => {
        if (el.classList.contains(classParent+"--developpe")) {
          el.classList.remove(classParent+"--developpe")
        } else {
          el.classList.add(classParent+"--developpe")
        }
      });
      onClickFN.push({[id]:listenerID})
      element.setAttribute("data-listenerID", listenerID);

      el.appendChild(element)
    }

    // if (!display) {
    //   console.log(el)
    //   if (el.querySelector('.tongue'))  el.querySelector('.tongue').removeEventListener("click",onClickFN).removeChild()

    // }
  },*/
  componentUpdated: (el,binding )=> {
    /*if (typeof(binding.value) === "object") {
      if(Object.values(binding.value)[0]) {
        console.log(binding.value)
      } else {
        el.querySelector('.tongue').removeEventListener(click,onClickFN).removeChild()
      }
    }*/
    if (binding.value != binding.oldValue) {
      let display = true
      let classParent = undefined
      if (typeof(binding.value) === "string") {
        classParent=binding.value
      }
      if (typeof(binding.value) === "object") {
        classParent=Object.keys(binding.value)[0]
        if(Object.values(binding.value)[0]) {
          display = true
        } else display = false
      }
      console.log(binding.value)
  
      if (classParent && display) {
        console.log(binding.value)
  
        //Ajout de l'element tongue
        let element = document.createElement("div")
        element.classList.add(classParent+"__tongue")
        element.classList.add("tongue")
  
        //Ajout du listener
        element.addEventListener("click", () => {
          if (el.classList.contains(classParent+"--developpe")) {
            el.classList.remove(classParent+"--developpe")
          } else {
            el.classList.add(classParent+"--developpe")
          }
        });

        el.appendChild(element)
      }
  
      if (!display) {
        let element = el.querySelector('.tongue')
        if (element) {
          

          element.removeChild('.tongue')
        }
  
      }
    }
  },
  unbind: (el) => {
    el.removeChild(el.querySelector('.tongue'))
  }
})

