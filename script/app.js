(function(){
  const showModal = (id) => {
    addClass(document.getElementById('modal-'+id), 'enabled');
  }

  const addClass = (e, c) => {
    try {
      if(!(e.getAttribute('class')||'').match(new RegExp('(^|\\s)'+c+'(\\s|$)'))){
        e.setAttribute('class', (e.getAttribute('class') ? e.getAttribute('class') + ' ' : '') + c);
      }
    } catch (e) { }
    return e;
  }

  const remClass = (e, c) => {
    try {
      if((e.getAttribute('class')||'').indexOf(c) > -1){
        e.setAttribute('class', (e.getAttribute('class')||'').replaceAll(new RegExp('(^|\\s)'+c+'(\\s|$)', 'g'), ' '));
      }
    } catch (e) { }
    return e;
  }

  const hasClass = (e, c) => {
    if((e.getAttribute('class')||'').match(new RegExp('(^|\\s)'+c+'(\\s|$)'))){
      return true;
    }
    return false;
  }

  const toggleClass = (e, c) => {
    if(hasClass(e, c)){
      remClass(e, c);
    }else{
      addClass(e, c);
    }
  }


  let WORD    = ""
  let WORDMAP = {}
  let VALIDWD = {}
  let ROW     = 1
  let COL     = 1

  for(let i=0;i<PUZZLES.length;i++){
    VALIDWD[PUZZLES[i]] = true
  }

  const colors = (input) => {
    let x = []
    for(var i=0; i<WORD.length; i++){
      console.log(input[i], WORD[i])
      if(input[i] == WORD[i]){
        x.push("green")
      } else if(WORDMAP[input[i]]){
        x.push("yellow")
      } else {
        x.push("gray")
      }
    }
    return x
  }


  let startgame = () => {
    resetkeyboard()
    WORD    = PUZZLES[Math.floor(Math.random() * PUZZLES.length)].toUpperCase()
    WORDMAP = {}
    COL     = 1
    ROW     = 1
    for(let i=0;i<WORD.length;i++){
      WORDMAP[WORD[i]] = true
    }
    //set up game table
    //TODO: this should generate the tr/td
    for(let i=1;i<=6;i++){
      for(let j=1;j<=5;j++){
        document.getElementById("try"+i+"-"+j).innerHTML = ""
        document.getElementById("try"+i+"-"+j).setAttribute("class", "")
      }
    }
  }
  const handleinput = (e) => {
    if(((e.which >= 65 && e.which <= 90) || e.which == 13 || e.which == 8) && !e.ctrlKey && !e.shiftKey && WORD != ""){
      e.preventDefault && e.preventDefault()
      if(e.which == 8){
        document.getElementById("try"+ROW+"-"+COL).innerHTML = ""
        COL-=COL<=1?0:1
      } else if (e.which == 13 && COL == 5) {
        let w = ""
        for(let i=1;i<=5;i++){
          w += document.getElementById("try"+ROW+"-"+i).innerHTML.toUpperCase()
        }
        let cs = colors(w)
        let win = true
        for(let i=1;i<=5;i++){
          win = win && cs[i-1] == 'green'
          addClass(document.getElementById("key-"+w[i-1]), "kbkey-"+cs[i-1])
          addClass(document.getElementById("try"+ROW+"-"+i), "color-"+cs[i-1])
        }
        ROW++
        COL=1
        if(win==true || ROW > 6){
          WORD = ""
        }
      } else if(COL <= 5 && e.which != 13){
        document.getElementById("try"+ROW+"-"+COL).innerHTML = (""+e.key).toUpperCase()
        COL+=COL>=5?0:1
      }
      console.log(e.key)
    }
  }
  const kbrows = ["qwertyuiop", "asdfghjkl", "EzxcvbnmB"]
  const resetkeyboard = () => {
    let kb = document.getElementById("kb-ctr")
    kb.innerHTML = ""
    for(let i=0;i<kbrows.length;i++){
      let inner = document.createElement("div")
      inner.setAttribute("class", "kbrow")
      for(let j=0;j<kbrows[i].length;j++){
        let el = document.createElement("div")
        el.setAttribute("class", "kbkey")
        el.setAttribute("id", "key-"+kbrows[i][j].toUpperCase())
        if(kbrows[i][j] == "E"){
          el.innerText = "Enter"
          el.addEventListener('mousedown', (e) => {e.preventDefault(); handleinput({which:13})})
        } else if(kbrows[i][j] == "B"){
          el.innerText = "⌫"
          el.addEventListener('mousedown', (e) => {e.preventDefault(); handleinput({which:8})})
        } else {
          el.innerText = kbrows[i][j].toUpperCase()
          el.addEventListener('mousedown', (e) => {e.preventDefault(); handleinput({which:65,key:el.innerText})})
        }
        inner.appendChild(el)
      }
      kb.appendChild(inner)
    }
  }
  
  startgame()
  document.addEventListener('keydown', handleinput)
  document.getElementById("newgame").addEventListener('click', startgame)

})()
