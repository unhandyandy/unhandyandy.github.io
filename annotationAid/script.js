
const transCh = new BroadcastChannel("Translation");

// vocab is boolean, whether to update 
function highlight(text,vocab) {
    if(text===''){
	return;}
    removeNotes(text);
    const randomColor = getRandCol();
    
    colorText(text,randomColor);
    
    // console.log(text);
    // newurl = new URL("https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb="+text+"&wdrst=1");
    const searchterm = searchStr.replace("${text}",text);
    newurl = new URL(searchterm);
    // transCh.postMessage(JSON.stringify(newurl));
			window.open(newurl,"TranslationWindow");

    const red = getWordFreqColor(text);
    const beg = (notesDiv.innerHTML==="") ? "" : "<br>";
    addNote(beg+makeBGString(randomColor,text)+makeBGString(red,": "));
    notesDiv.scrollTop = notesDiv.scrollHeight;
    if(vocab){
	updateVocab(text); }
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
    const regNote = new RegExp(`(<br>)?<span[^>]*>${text}</span><span[^>]*>: </span>[^<]*(<br>|$)`);
    innerHTML = notesDiv.innerHTML;
    const m = innerHTML.match(regNote);
// console.log(m);
    const rep = m[2]
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
    var inner = notesDiv.innerHTML;
    inner += text;
    notesDiv.innerHTML = inner;
    addNoteBox.value = '';
    saveInnards();
}

async function addNoteFromClipboard(){
    const text = await navigator.clipboard.readText();
    addNote(text);
}

function saveInnards(){
    const title = document.title;
    const storageObj = {
	"text":inputText.innerHTML,
	"notes":notesDiv.innerHTML,
	"translation":transText.value,
	"href":searchStr,
	"wordStart":wordStart,
	"savePrefix":savePrefix,
	"fontFamily":inputText.style.fontFamily }
    localStorage.setItem(title,JSON.stringify(storageObj));
    const langObj = {
	"vocabulary":vocabulary,
	"hrefList":hrefList }
    localStorage.setItem("lang:" + savePrefix, JSON.stringify(langObj));

    fillSelector();
}

var inputText,notesDiv,addNoteBox,undoButton,addButton,curSelection,upButton,dnButton,transText,vocabulary,minColorDiff = 256,searchStr = "https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=${text}&wdrst=1",wordStart=false,savePrefix="",selector,controlSelector,hrefList=[],prosodySelector;

function init(){
    upButton = document.getElementById("moveUp");
    dnButton = document.getElementById("moveDn");
    addCBButton = document.getElementById("addFromCB");
    inputText = document.getElementById("text");
    notesDiv = document.getElementById("notesDiv");
    transText = document.getElementById("transText");
    addNoteBox = document.getElementById("addNoteBox");
    addButton = document.getElementById("addButton");
    undoButton = document.getElementById("undoButton");
    selector = document.getElementById("select");
    prosodySelector = document.getElementById("prosody");
    fillSelector();
    controlSelector = document.getElementById("controls");
    upButton.addEventListener("click",()=>{moveLine(1)});
    dnButton.addEventListener("click",()=>{moveLine(-1)});
    addButton.addEventListener("click",()=>{addNote(addNoteBox.value);});
    addCBButton.addEventListener("click",addNoteFromClipboard);
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
	inputText.style.fontFamily = storageObj["fontFamily"];
    }
    restoreLang(savePrefix);
    setWSBText();
}

function restoreLang(lang){
     const langObj = JSON.parse(localStorage.getItem("lang:" + lang));
    if(langObj!==null){
	vocabulary = langObj["vocabulary"];
	hrefList = langObj["hrefList"]; }
    else{
	vocabulary = {};
	hrefList = []; }
    populateHrefs();
    switch(lang){
    case "Yiddish":
    case "Hebrew":
	inputText.setAttribute("dir","rtl");
	break;
    default:
	inputText.setAttribute("dir","ltr");
	break;
    }
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

function replaceText(rep=addNoteBox.value,sel=window.getSelection()){
    // const rep = addNoteBox.value;
    var color;
    if(rep===""){
	color = null; }
    else{
	color = getColorFor(rep);}
    // const sel = window.getSelection();
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
    const newwin = window.open("translation.html","TranslationWindow", "width=500, height=600"); 
    if(newwin){
	newwin.name = "TranslationWindow"; }
}

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

// async function saveAs() {
//     saveInnards();
//     const code = "<html>" + document.documentElement.innerHTML + "</html>";
//     var newHandle
//   try {
//     // create a new handle
//     newHandle = await window.showSaveFilePicker();

//     // create a FileSystemWritableFileStream to write to
//     const writableStream = await newHandle.createWritable();

//     // write our file
//     await writableStream.write(code);

//     // close the file and write the contents to disk.
//     await writableStream.close();
//     window.location.replace(newHandle.name);
//   } catch (err) {
//     console.error(err.name, err.message);
//   }
// }
// function getFolder(){
//     const pathvec = window.location.pathname.split("/");
//     const len = pathvec.length;
//     return(pathvec[len - 2]);
// }
function importNotes(notes){
    const noteslist = notes.split("\n");
    for (i in noteslist){
	var n = noteslist[i];
	if (n===""){
	    break; }
	n = n.split(":");
	highlight(n[0],false);
	addNote(n[1]); }
}

function importText(text){
    const ind1 = text.indexOf("\n");
    const pref = text.slice(0,ind1);
    savePrefix = (pref == "") ? savePrefix : pref;
    const ind2 = text.indexOf("\n", ind1 + 1);
    const href = text.slice(ind1+1,ind2);
    const ind3 = text.indexOf("\n", ind2 + 1);
    const title = text.slice(ind2+1,ind3);
    const ind4 = text.indexOf("\nTranslation\n", ind3 + 1);
    const indAnn = text.indexOf("\nAnnotations\n", ind3 + 1);
    var body = (ind4<0) ? ((indAnn<0) ? text.slice(ind3+1) : text.slice(ind3+1,indAnn)) : text.slice(ind3+1,ind4);
    const notes = (indAnn<0) ? "" : text.slice(indAnn+13);
	    
    body = body.replaceAll("\n","<br>");
    document.title = title;
    var ls,keep;
    if(ls = localStorage[title]){
	keep = !confirm("This text has been imported before.  Are you sure you want to overwrite the existing version?"); }
    if(!(keep && ls)){
	inputText.innerHTML = `<h2>${title}</h2>${body}`;
	notesDiv.innerHTML = "";
	transText.value = (ind4<0) ? "" : (indAnn<0) ? text.slice(ind4+13) : text.slice(ind4+13,indAnn);
	searchStr = (href==="") ? searchStr : href;
	restoreLang(savePrefix);
	if(notes.length>0){
	    importNotes(notes); }}
    else{
	restore(); }
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

	    const reader = new FileReader(); // Create a FileReader object

	    reader.onload = (e) => {
		// The result contains the file's data
		const text = e.target.result;

		// You can now work with the blobData (e.g., display it, send it to a server)
		// fileContentDiv.textContent = `File content (as ArrayBuffer or Data URL): ${blobData.byteLength || blobData.length} bytes`;
		// Depending on how you read it, blobData could be an ArrayBuffer or a Data URL
		// console.log('Blob data:', blobData);
		// const text = await f.text();
		importText(text); }	    
	    
	    reader.onerror = (e) => {
		console.error('Error reading file:', e.target.error); // Handle errors
	    };
	    reader.readAsText(f);
	};

	inp.addEventListener("change",inpAssign)
	inp.click();

	// Choose the appropriate reading method based on your needs:

	// 1. To read as a plain text string:

	// 2. To read as a Data URL (Base64 encoded):
	//reader.readAsDataURL(file); // Suitable for images or if you need a URL representation.

	// 3. To read as an ArrayBuffer (binary data):
	// reader.readAsArrayBuffer(file); // Useful for processing raw binary data (e.g., images).
	
	
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
	const prefix = it.split(":")[0];
	if(prefix!=="lang"){
	    if(!prefix.includes("_score") &&
	       !prefix.includes("_depthTable") &&
	       !prefix.includes("_minimaxAB")){
		nameList.push(it); }}}
    nameList.sort();
    // console.log(nameList);
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

function setHref(v){
    if(v==="New"){
	searchStr = addNoteBox.value;
	if(hrefList.indexOf(searchStr)<0){
	    hrefList.push(searchStr);
	    const newopt =  document.createElement("option");
	    newopt.text = searchStr;
	    const grp = controlSelector.getElementsByTagName("optgroup")[0];
	    grp.appendChild(newopt); }
    }
    else{
	searchStr = v; }
}


function populateHrefs(){
    const grp = controlSelector.getElementsByTagName("optgroup")[0];
    const children = grp.children;
    const cs = [...children];
    while(cs.length>1){
	// children is reduced as each node is removed!
	grp.removeChild(cs.pop()); }
    for(h in hrefList){
	const newopt =  document.createElement("option");
	newopt.text = hrefList[h];
	grp.appendChild(newopt); }
}



function controlHandler(e){
    const v = e.target.value;
    const ind = e.target.selectedIndex;
    // console.log("v: ",v);
    // console.log("e: ",e);
    const op = e.target.options[ind];
    const optgroup = op.parentNode;
    

    if(optgroup.label==="Set Search"){
	setHref(v); }
    else if(v==="Transl. Win."){
	openTranslationWindow(); }
    else if(v==="Find Note"){
	scrollNoteIntoView(window.getSelection().toString()); }
    else if(v==="Lang->Search"){
	makeSearchStr(); }
    else if(v==="Export"){
	exportText(); }
    else if(v==="Font Spacing"){
	toggleFS(); }
    else if(v!=="Controls"){
	toggleWS(); }
    controlSelector.value = "Controls";
}

function toggleFS(){
    const ff = inputText.style.fontFamily;
    inputText.style.fontFamily = (ff==="monospace") ? "proportional" : "monospace";
}
    
function prosodyHandler(e){
    const v = e.target.value;
    const sel = window.getSelection();
    const uc = v.charCodeAt();
    if(v.length===1 && checkAccent(uc)){
	markOne(v,uc,sel); }
    else if(v==="slur"){
	slurText(sel); }
    else if(v.length>1){
	const vlen = 1 + (v.length - 1)/2;
	dotText(sel,vlen,v[0]); }

    prosodySelector.value = "Mark";
    //saveInnards();
}

function dotText(sel,vlen,dot){
    // console.log(vlen);
    if(sel.anchorNode!==sel.extentNode){
	return; }
    const text = sel.toString();
    const len = text.length;
    if(len===2*vlen){
	rep = "";
	for(i=0;i<len;i+=2){
	    rep += text[i]; }
	replaceText(rep,sel); }
    else if(len===vlen){
	rep = "";
	for(i=0;i<len;i+=1){
	    rep += text[i] + dot; }
	replaceText(rep,sel); }
}

function checkAccent(uc){
    return(uc>=768 && uc<=879); }

function slurText(sel){
    if(sel.anchorNode!==sel.extentNode){
	return; }
    const start = sel.anchorOffset;
    const stop = sel.extentOffset;
    const len = sel.anchorNode.length;
    const text = sel.toString();
    if(start===0 && stop===len && sel.anchorNode.parentNode.tagName==='SLUR'){
	sel.anchorNode.parentNode.replaceWith(sel.anchorNode); }
    else{    
	const txt = sel.anchorNode.data;

	const newspan = document.createElement("slur");
	const textNode = document.createTextNode(text);
	newspan.appendChild(textNode);
	const text1 = document.createTextNode(txt.slice(0,start));
	const text2 = document.createTextNode(txt.slice(stop));

	sel.anchorNode.replaceWith(text1,newspan,text2);
    }
}

    

function markOne(v,uc,sel){
    const text = sel.toString();

    if(text.length===2 && checkAccent(text.charCodeAt(1))){
	const rep = text.slice(0,1);
	replaceText(rep,sel); }
    else if(text.length===1){
	const rep = text + v;
	replaceText(rep,sel); }
    saveInnards();
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

function makeSearchStr(){
    var lang;
    switch(savePrefix){
    case 'French':
	lang = 'fr';
	break;
    case 'Spanish':
	lang = 'sp';
	break;
    case 'German':
	lang = 'de';
	break;
    case 'Russian':
	lang = 'ru';
	break;
    case 'Italian':
	lang = 'it';
	break;
    case 'Dutch':
	lang = 'nl';
    }
    searchStr = `https://www.wordreference.com/${lang}en/\${text}`;
}

// function stripColors(html){
//     const newchildren = [];
//     const oldchildren = html.childNodes;
//     const len = oldchildren.length;
//     for( c=0;c<len;c+=1){
// 	const newc = stripColors(oldchildren[c]);
// 	if(typeof(newc)==="Object"){
// 	    newchildren.push(...newc); }
// 	else{
// 	    newchildren.push(newc); }}
//     var tag = html.tagName;
//     tag = (tag===undefined) ? "text" : tag;
//     if(tag==="span" || tag==="h2"){
// 	return(newchildren);  }
//     else{
// 	const res = document.createElement(tag);
// 	res.append(...newchildren);
// 	return(res); }
// }

function stripTags(inner){
    var res = inner;
    if (res.slice(0,4)==="<br>"){
	res = res.slice(4); }
    res = res.replaceAll(/<\/?span[^>]*>/g,"");
    res = res.replaceAll(/<h2>[^<]*<\/h2>/g,"");
    res = res.replaceAll("<br>","\n");
    return(res);
}
    

function exportText(){
    const trans = transText.value;
    const text = stripTags(inputText.innerHTML);
    const notes = stripTags(notesDiv.innerHTML);
    var savestr = "";
    savestr += savePrefix + "\n";
    savestr += searchStr + "\n";
    savestr += document.title + "\n";
    savestr += text + "\n\n\n";
    savestr += "Translation" + "\n";
    savestr += trans + "\n\n\n";
    savestr += "Annotations" + "\n";
    savestr += notes + "\n\n\n";
    saveToFile(savestr);
}


async function saveToFile(text) {
const myBlob = new Blob([text], { type: 'text/plain' });
saveFile(myBlob, document.title); // Call the function to save the Blob
    // try {
    // 	// create a new handle
    // 	const newHandle = await window.showSaveFilePicker();
    // 	const writableStream = await newHandle.createWritable();
    // 	await writableStream.write(text);
    // 	// close the file and write the contents to disk.
    // 	await writableStream.close();
    // } catch (err) {
    // 	console.error(err.name, err.message);
    // }
}




const saveFile = async (blob, suggestedName) => {
  // Feature detection. Check if 'showSaveFilePicker' is available
  // and the app isn't running in an iframe (for security reasons).
  const supportsFileSystemAccess = 'showSaveFilePicker' in window && (() => {
    try {
      return window.self === window.top;
    } catch {
      return false;
    }
  })();

  // If the File System Access API is supported (i.e., 'showSaveFilePicker' exists)...
  if (supportsFileSystemAccess) {
    try {
      // Show the file save dialog with the suggested filename
      const handle = await showSaveFilePicker({ suggestedName });

      // Write the blob to the file chosen by the user
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();

      return; // Exit the function after successfully saving the file
    } catch (err) {
      // Handle the case where the user cancels the save dialog
      if (err.name !== 'AbortError') {
        console.error(err.name, err.message); // Log other errors
      }
      return; // Exit the function
    }
  }

  // Fallback if the File System Access API is not supported (e.g., Firefox)
  // Create a URL for the Blob object
  const blobURL = URL.createObjectURL(blob);

  // Create an invisible anchor (`<a>`) element
  const a = document.createElement('a');
  a.href = blobURL; // Set its `href` to the Blob URL
  a.download = suggestedName; // Set the `download` attribute to the suggested filename
  a.style.display = 'none'; // Hide the element

  // Append the anchor to the document body
  document.body.append(a);

  // Programmatically click the anchor to trigger the download
  a.click();

  // Revoke the Blob URL and remove the anchor element to free up resources
  URL.revokeObjectURL(blobURL);
  document.body.removeChild(a);
};

// // Example usage:
// const myTextData = 'Hello, this is some data to be saved!';
// const myBlob = new Blob([myTextData], { type: 'text/plain' });
// saveFile(myBlob, 'my-document.txt'); // Call the function to save the Blob




// const fileInput = document.getElementById('fileInput');
// const fileContentDiv = document.getElementById('fileContent');

// fileInput.addEventListener('change', (event) => {
//   const file = event.target.files[0]; // Get the selected file

//   if (file) {
//     const reader = new FileReader(); // Create a FileReader object

//     reader.onload = (e) => {
//       // The result contains the file's data
//       const blobData = e.target.result;

//       // You can now work with the blobData (e.g., display it, send it to a server)
//       fileContentDiv.textContent = `File content (as ArrayBuffer or Data URL): ${blobData.byteLength || blobData.length} bytes`;
//       // Depending on how you read it, blobData could be an ArrayBuffer or a Data URL
//       console.log('Blob data:', blobData); 
//     };

//     reader.onerror = (e) => {
//       console.error('Error reading file:', e.target.error); // Handle errors
//     };

//     // Choose the appropriate reading method based on your needs:

//     // 1. To read as a plain text string:
//     // reader.readAsText(file);

//     // 2. To read as a Data URL (Base64 encoded):
//     reader.readAsDataURL(file); // Suitable for images or if you need a URL representation.

//     // 3. To read as an ArrayBuffer (binary data):
//     // reader.readAsArrayBuffer(file); // Useful for processing raw binary data (e.g., images).
//   }
// });
