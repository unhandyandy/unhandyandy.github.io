
const transCh = new BroadcastChannel("Translation");

function highlight(text) {
    if(text===''){
	return;}
    removeNotes(text);
    const randomColor = getRandCol();
    
    colorText(text,randomColor);
    
    // console.log(text);
    // newurl = new URL("https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb="+text+"&wdrst=1");
    newurl = new URL(searchStr.replace("${text}",text));
    transCh.postMessage(JSON.stringify(newurl));

    const red = getWordFreqColor(text);
    addNote("<br>"+makeBGString(randomColor,text)+makeBGString(red,": "));
    notesDiv.scrollTop = notesDiv.scrollHeight;

    updateVocab(text);
}

function colorText(text,color){
    var innerHTML = inputText.innerHTML;
    const len = text.length;
    const collen = color.length;
    const bounce = 39 + collen;
    var diff = 0;
    const ms = innerHTML.matchAll(text);
    var m = ms.next();
    while(!m.done){
	const j = m.value["index"] + diff;
	const i = innerHTML.indexOf("span",j);
	if(i<0 || innerHTML.slice(i-1,i)!=="/"){
	    if(!wordStart || j<=0 || innerHTML.slice(j-1,j)===" " || innerHTML.slice(j-1,j)===">" || innerHTML.slice(j-1,j)==="\n" || innerHTML.slice(j-1,j)==="'" || innerHTML.slice(j-1,j)==="'\""){
		innerHTML = innerHTML.slice(0,j)+"<span style=\"background-color:"+color+"\">"+text+"</span>"+innerHTML.slice(j+len);
		inputText.innerHTML = innerHTML;
		diff += bounce;
	    }}
	m = ms.next();
    }}

function makeBGString(col,text){
    return("<span  style=\"background-color:"+col+"\">"+text+"</span>");
}

function updateReds(){
    
}
    
function highlightone(sel) {
    const start = sel.anchorOffset;
    const stop = sel.extentOffset;
    const text = sel.toString();
    if(start===stop){
	return;}
    removeNotes(text);
    const randomColor = getRandCol();
    var txt = sel.anchorNode.data;

    const newspan = document.createElement("span");
    newspan.style.backgroundColor = randomColor;
    const textNode = document.createTextNode(text);
    newspan.appendChild(textNode);
    const text1 = document.createTextNode(txt.slice(0,start));
    const text2 = document.createTextNode(txt.slice(stop));

    sel.anchorNode.replaceWith(text1,newspan,text2);

    // console.log(text);
    newurl = new URL(searchStr.replace("${text}",text));
    transCh.postMessage(JSON.stringify(newurl));
    addNote("<br>"+"<span  style=\"background-color:"+randomColor+"\">"+text+"</span>: ");
    notesDiv.scrollTop = notesDiv.scrollHeight;

    updateVocab(text);
}

function unHL() {
    var inputText = document.getElementById("text");	 
    var innerHTML = inputText.innerHTML;
    innerHTML = innerHTML.replaceAll(/<span[^>]*>/gm,'');
    innerHTML = innerHTML.replaceAll(/<\/span>/gm,'');
    inputText.innerHTML = innerHTML;
    notesDiv.innerHTML = '';
}
function unHLone(text) {
    var inputText = document.getElementById("text");	 
    var innerHTML = inputText.innerHTML;
    const regText = new RegExp(`<span[^>]*>${text}<\/span>`,"gm");
    innerHTML = innerHTML.replaceAll(regText,text);
    inputText.innerHTML = innerHTML;
    const regNote = new RegExp(`<br><span[^>]*>${text}</span><span[^>]*>: </span>[^<]*(<br>|$)`);
    innerHTML = notesDiv.innerHTML;
    const m = innerHTML.match(regNote);
    const rep = m[1]
    innerHTML = innerHTML.replace(regNote,rep);
    notesDiv.innerHTML = innerHTML;
    vocabulary[text] -= 1;  
}

function getNoteChars(){
    var res = [];
    const innerHTML = notesDiv.innerHTML;
    const ms = innerHTML.matchAll(/<span [^>]*>([^<: ]+)/gm);
    var m = ms.next();
    while(!m.done){
	res.push(m.value[1]);
	m = ms.next();
    }
    return(res);
}

function getColors(){
    var res = [];
    const innerHTML = notesDiv.innerHTML;
    const ms = innerHTML.matchAll(/background-color:([^"]*)\"/gm);
    var m = ms.next();
    while(!m.done){
	if(!res.includes(m.value[1])){
	    res.push(m.value[1]); }
	m = ms.next();
    }
    return(res);
}

function getRandCol(){
    var cols = getColors();
    const col0 = "#000000";
    cols.push(col0);
    var randomColor,diff,ds;
    var diff = 0;
    var cnt = 0;
    // const toid = setTimeout(()=>this.minDiff /= 2,1000);
    while(diff<minColorDiff){
	if(cnt>100){
	    cnt = 0;
	    minColorDiff /= 2;}
	// console.log(minColorDiff);
	const r1 = Math.floor(Math.random()*128);
	randomColor = r1 + 128;
	const r2 = Math.floor(Math.random()*128);
	randomColor += (r2 + 128)*256;
	const r3 = 254 - (r1 + r2);
	randomColor += r3*256**2;
	randomColor = randomColor.toString(16).padStart(6,'0');
	// while (randomColor.length<6){randomColor = "0"+randomColor;}
	randomColor = "#" + randomColor.toString(16);
	const ds = cols.map((c)=>colorDist(randomColor,c));
	diff = Math.min(...ds);
	// console.log(randomColor);
	cnt += 1
    }
    // clearTimeout(toid);
    return(randomColor);
}

function colorDist(c1,c2){
    const c1h = [c1.slice(1,3),c1.slice(3,5),c1.slice(5)];
    const c2h = [c2.slice(1,3),c2.slice(3,5),c2.slice(5)];
    const c1d = c1h.map((s)=>parseInt(s,16));
    const c2d = c2h.map((s)=>parseInt(s,16));
    const diffs = [0,1,2].map((i)=>Math.abs(c1d[i]-c2d[i]));
    const d = diffs.reduce((x,y)=>x+y);
    return(d);
}


function removeNotes(text){
    const chars = getNoteChars();
    for(i in chars){
	if(text.match(chars[i])){
	    unHLone(chars[i]);
	}
    }
}



function addNote(text){
    inner = notesDiv.innerHTML;
    inner += text;
    notesDiv.innerHTML = inner;
    addNoteBox.value = '';
}
function saveInnards(){
    const title = document.title;
    // localStorage.setItem(title+"-text", inputText.innerHTML);
    // localStorage.setItem(title+"-notes", notesDiv.innerHTML);
    // localStorage.setItem(title+"-translation", transText.value);
    // localStorage.setItem(title+"-href",searchStr);
    // localStorage.setItem(title+"-wordStart",JSON.stringify(wordStart));
    // localStorage.setItem(title+"-savePrefix",savePrefix);
    const storageObj = {
	"text":inputText.innerHTML,
	"notes":notesDiv.innerHTML,
	"translation":transText.value,
	"href":searchStr,
	"wordStart":wordStart,
	"savePrefix":savePrefix }
    localStorage.setItem(title,JSON.stringify(storageObj));
    localStorage.setItem(savePrefix + "-vocabulary", JSON.stringify(vocabulary));

    fillSelector();
}
// function forgetInnards(){
//     const title = document.title;
//     localStorage.removeItem(title+"-text");
//     localStorage.removeItem(title+"-notes");
//     localStorage.removeItem(title+"-translation");
//     location.reload();
// }
var inputText,notesDiv,addNoteBox,undoButton,addButton,curSelection,upButton,dnButton,transText,vocabulary,minColorDiff = 256,searchStr = "https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=${text}&wdrst=1",wordStart=false,savePrefix="",selector,controlSelector;
function init(){
    upButton = document.getElementById("moveUp");
    dnButton = document.getElementById("moveDn");
    inputText = document.getElementById("text");
    notesDiv = document.getElementById("notesDiv");
    transText = document.getElementById("transText");
    addNoteBox = document.getElementById("addNoteBox");
    addButton = document.getElementById("addButton");
    undoButton = document.getElementById("undoButton");
    selector = document.getElementById("select");
    fillSelector();
    controlSelector = document.getElementById("controls");
    upButton.addEventListener("click",()=>{moveLine(1)});
    dnButton.addEventListener("click",()=>{moveLine(-1)});
    addButton.addEventListener("click",()=>{addNote(addNoteBox.value);});
    undoButton.addEventListener("click",()=>{
	const chars = getNoteChars();
	c = chars.slice(-1)[0];
	unHLone(c);
	// inner = notesDiv.innerHTML;
	// lio = inner.lastIndexOf("<br>");
	// notesDiv.innerHTML = inner.slice(0,lio);
    });
    addNoteBox.addEventListener("keydown",(e)=>{
	if(e.key==='Enter'){
	    addNote(addNoteBox.value)
	}});
}


function restore(){
    const title = document.title;
    const storageObj = JSON.parse(localStorage.getItem(title));
    if(storageObj!==null){
	inputText.innerHTML = storageObj["text"];
	notesDiv.innerHTML = storageObj["notes"];
	transText.value = storageObj["translation"];
	searchStr = storageObj["href"];
	wordStart = storageObj["wordStart"];
	savePrefix = storageObj["savePrefix"];
    }
    if(vocabulary = localStorage.getItem(savePrefix + "-vocabulary")){
	vocabulary = JSON.parse(vocabulary); }
    else{
	vocabulary = {}; }

    setWSBText();
}

function updateVocab(text){
    if(vocabulary[text]===undefined){
	vocabulary[text] = 1; }
    else{
	vocabulary[text] += 1; }
}

function findNotesLine(text){
    const notes = notesDiv.innerHTML;
    const regex = new RegExp(`<br><[^>]*>${text}<[^>]*><span[^>]*>: </span>[^<]*(<br>|$)`)
    const m = notes.match(regex);
    if(m===null){
	return(null); }
    const start = m.index;
    const len = m[0].length - m[1].length;
    return({"start":start,"stop":start+len});
}

function scrollNoteIntoView(text){
    const spanlist = notesDiv.getElementsByTagName('span');
    var el = null;
    for(i in spanlist){
	if(spanlist[i].innerHTML===text){
	    el = spanlist[i];
	    break; }}
    if(el===null){
	return(null); }
    el.scrollIntoView(false);
}

function notesNextLine(stop){
    const notes = notesDiv.innerHTML;
    if(notes.length<stop){
	return(null); }
    const m = notes.slice(stop+4).match(/(<br>|$)/);
    const nextstop = m.index + stop + 4;
    // console.log(m);
    return(nextstop);
}

function notesPrevLine(start){
    const notes = notesDiv.innerHTML;
    if(start===0){
	return(null); }
    const txt = notes.slice(0,start);
    const prevstart = txt.lastIndexOf("<br>");
    return(prevstart);
}

function liftLine(start,stop){
    if(start===0){
	return(null); }
    const prevstart = notesPrevLine(start);
    var notes = notesDiv.innerHTML;
    const head = notes.slice(0,prevstart);
    const l1 = notes.slice(prevstart,start);
    const l2 = notes.slice(start,stop);
    const tail = notes.slice(stop);
    notes = head + l2 + l1 + tail;
    notesDiv.innerHTML = notes;
}

function dropLine(start,stop){
    var notes = notesDiv.innerHTML;
    if(stop > notes.length){
	return(null); }
    const nextstop = notesNextLine(stop);
    const head = notes.slice(0,start);
    const l1 = notes.slice(start,stop);
    const l2 = notes.slice(stop,nextstop);
    const tail = notes.slice(nextstop);
    notes = head + l2 + l1 + tail;
    notesDiv.innerHTML = notes;
}

function moveLine(dir){
    var sel = window.getSelection().anchorNode.nodeValue;
    const chars = getNoteChars();
    sel = (chars.includes(sel)) ? sel : curSelection;
    curSelection = sel;
    const line = findNotesLine(sel);
    if(dir>0){
	liftLine(line.start,line.stop);
    } else {
	dropLine(line.start,line.stop);	}
}

function replaceText(){
    const rep = addNoteBox.value;
    var color;
    if(rep===""){
	color = null; }
    else{
	color = getColorFor(rep);}
    const sel = window.getSelection();
    var txt = sel.anchorNode.data;
    const start = sel.anchorOffset;
    const stop = sel.extentOffset;

    if(color===null){
	txt = txt.slice(0,start) + rep + txt.slice(stop);
	sel.anchorNode.data = txt;
    }else{
	const newspan = document.createElement("span");
	newspan.style.backgroundColor = color;
	const textNode = document.createTextNode(rep);
	newspan.appendChild(textNode);
	const text1 = document.createTextNode(txt.slice(0,start));
	const text2 = document.createTextNode(txt.slice(stop));
	sel.anchorNode.replaceWith(text1,newspan,text2);
    }
    colorAllChars();
}

function getColorFor(text){
    const notes = notesDiv.innerHTML;
    const regex = new RegExp(`background-color:([^"]*)">${text}`);
    const m = notes.match(regex);
    if(m!==null){
	return(m[1]);
    }else{
	return(null);
    }}

function getWordFreq(w){
    if(w==="Text"){return(0);}
    // console.log("w: ",w);
    const f = vocabulary[w];
    // console.log("f: ",f);
    const res = (f===undefined) ? 0 : f;
    // console.log("freq: ",res);
    return(res);
}

function rgb(r,g,b){
    const num = b + g*256 + r*256**2;
    return("#"+num.toString(16));
}
    
function getWordFreqColor(w){
    const m = Math.max(...Object.values(vocabulary));
    const f = getWordFreq(w);
    const r = 255;
    const g = 255 - Math.floor(f/m*128);
    return(rgb(r,g,g));
}

function colorAllChars(){
    const chars = getNoteChars();
    const colors = chars.map(getColorFor);
    for(i in chars){
	const col = colors[i];
	if(col!==null){
	    colorText(chars[i],col); }
    }}

function openTranslationWindow(){
    window.open("translation.html","", "width=500, height=600"); }

// function openSettingsDialog(){
//     const form = document.createElement("form");
//     const inner = "<fieldset> \
//     <legend>Start with word?</legend>\
//     <div>\
//       <input type=\"radio\" id=\"Choice1\" name=\"contact\" value=\"Word\" />\
//       <label for=\"contactChoice1\">Word</label>\
// \
//       <input type=\"radio\" id=\"Choice2\" name=\"contact\" value=\"Character\" />\
//       <label for=\"contactChoice2\">Character</label>\
// \
//     </div>\
//     <div>\
//       <button type=\"submit\">Submit</button>\
//     </div>\
//   </fieldset>";
//     form.innerHTML = inner;
//     const body = document.getElementsByTagName("body")[0];
//     body.appendChild(form);
// }

function toggleWS(){
    wordStart = !wordStart;
    setWSBText();
}

function setWSBText(){
    const wss = document.getElementById("wordStartOpt")
    wss.innerHTML = `WS: ${wordStart}`;
    // const oldtn = wsb.childNodes[0];
    // const newtn = document.createTextNode("WS: " + wordStart.toString());
    // oldtn.replaceWith(newtn);
}

function setInputText(){
    var text = transText.value;
    transText.value = "";
    const title = text.slice(0,text.match("\n").index).replaceAll(" ","_");
    text = text.replaceAll("\n","<br>\n");
    text = text.replace("<br>","</h2>");
    text = "<h2>" + text;
    inputText.innerHTML = text;
    notesDiv.innerHTML = "";
    document.title = title;
}

async function saveAs() {
    saveInnards();
    const code = "<html>" + document.documentElement.innerHTML + "</html>";
    var newHandle
  try {
    // create a new handle
    newHandle = await window.showSaveFilePicker();

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(code);

    // close the file and write the contents to disk.
    await writableStream.close();
    window.location.replace(newHandle.name);
  } catch (err) {
    console.error(err.name, err.message);
  }
}
// function getFolder(){
//     const pathvec = window.location.pathname.split("/");
//     const len = pathvec.length;
//     return(pathvec[len - 2]);
// }

function importText(text){
    const ind1 = text.indexOf("\n");
    const pref = text.slice(0,ind1);
    savePrefix = (pref == "") ? savePrefix : pref;
    const ind2 = text.indexOf("\n", ind1 + 1);
    const href = text.slice(ind1+1,ind2);
    const ind3 = text.indexOf("\n", ind2 + 1);
    const title = text.slice(ind2+1,ind3);
    const ind4 = text.indexOf("\nTranslation\n", ind3 + 1);
    var body = (ind4<0) ? text.slice(ind3+1) : text.slice(ind3+1,ind4);
    body = body.replaceAll("\n","<br>");
    document.title = title;
    inputText.innerHTML = `<h2>${title}</h2>${body}`;
    notesDiv.innerHTML = "";
    transText.value = (ind4<0) ? "" : text.slice(ind4+13);
    searchStr = (href==="") ? searchStr : href;
    restore();
}

async function loadItem(v){
    if(v==="Import File"){
	// the following two lines fail on older browsers:
	// const [fid] = await window.showOpenFilePicker();
	// const f = await fid.getFile();
	const inp = document.createElement("input");
	inp.setAttribute("type","file");

	async function inpAssign(e){
	    const f = await e.target.files[0];
	    const text = await f.text();
	    importText(text); }	    
	inp.addEventListener("change",inpAssign)
	inp.click();
    }
    else if(v!=="Import File"){
	document.title = v;
	restore(); }
    selector.value = "Load";
}

function getLSnames(){
    const ls = localStorage;
    const len = ls.length;
    const nameList = [];
    for(i=0;i<len;i+=1){
	const it = ls.key(i);
	if(it.split("-").reverse()[0]!=="vocabulary"){
	    nameList.push(it); }}
    nameList.sort();
    return(nameList);
}

function fillSelector(){
    const nl = getLSnames();
    var inner = "<option>Load</option><option>Import File</option><optgroup label=\"Saves:\">";
    for(i in nl){
	inner += `<option>${nl[i]}</option>`; }
    inner += "</optgroup>";
    selector.innerHTML = inner;
}

function controlHandler(v){
    // console.log("controlHandler...");
    if(v==="Transl. href"){
	searchStr = addNoteBox.value; }
    else if(v==="Transl. Win."){
	openTranslationWindow(); }
    else if(v==="Find Note"){
	scrollNoteIntoView(window.getSelection().toString()); }
    else if(v!=="Controls"){
	toggleWS(); }
    controlSelector.value = "Controls";
}

// function selToColor(sel){
//     const par = sel.anchorNode.parentNode;
//     if(par.tagName!=='SPAN'){
// 	return(undefined); }
//     else{
// 	const bg = par.attributes.style.value;
// 	const col = bg.split(":")[1];
// 	return(col); }
// }
