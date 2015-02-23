//-*-mode: Javascript; -*-

/*jslint browser: true, devel: true */

function repeatTxt (txt,n) {
    "use strict";
    var res = "", i;
    for (i=0;i<n;i++) {
	res += txt;
    }
    return res;
}

function brN (n) {
    "use strict";
    return repeatTxt("<br>",n);
}

function nbspN (n) {
    "use strict";
    return repeatTxt("&nbsp;",n);
}

function setDiv (divid,cntnt) {
    "use strict";
    document.getElementById(divid).innerHTML = cntnt;
}
function getDiv (divid) {
    "use strict";
    return document.getElementById(divid).innerHTML;
}

// set option opt of tag with ID id to value val
function setTagOpt( id, opt, val ){
    "use strict";
    var el = document.getElementById(id);
    el[opt] = val;
}

// set style option opt of tag with ID id to value val
function setTagSty( id, opt, val ){
    "use strict";
    var el = document.getElementById(id);
    el.style[opt] = val;
}

Function.prototype.method = function (name, func) {
    "use strict";
    this.prototype[name] = func;
    return this;
};




function makeTag (tag,txt,opts) {
    "use strict";
    if (!opts) {
	opts = "";
    }
    return "<"+tag+" "+opts+">" + txt + "</"+tag+">";
}


function smallSet() {
    this.bin = 0;
    this.add = function (n) {
      this.bin |= 1<<n; };
    this.remove = function (n) {
      this.bin -= this.bin & 1<<n; }
    var that = this;
    this.union = function (ss) {
	if ( ss === undefined ){
	    ss = new smallSet();
	}
	res = new smallSet();
	res.bin = that.bin | ss.bin;
      return res; };
    this.has = function (n) {
	var bit = 1<<n;
	var res = (that.bin & bit) > 0;
      return res; }
    this.inter = function (ss) {
	res = new smallSet();
	res.bin = this.bin & ss.bin;
      return res; }
    this.minus = function (ss) {
	res = new smallSet();
	res.bin = this.bin - (this.bin & ss.bin);
      return res; }
    this.subset = function (ss) {
      return ss.bin == (ss.bin | this.bin); };
    this.superset = function (ss) {
      return ss.subset(this); };
    this.equal = function (ss) {
      return this.bin === ss.bin; };
    this.complement = function () {
	var res = new smallSet(0);
	res.bin = ~ this.bin;
      return res; };
    this.spawn = function (lst) {
	var res = new smallSet();
	lst.forEach(function(x){ res.add(x); });
	return res;
    };
    this.emptyQ = function() {
      return this.bin == 0; };
    this.clone = function() {
	var res = new smallSet();
	res.bin = this.bin;
      return res; };
  this.size = function(){
    var res = 0;
    //console.debug("this.bin = %s",this.bin);
    for(var i=0;i<31;i++){
    //console.debug((this.bin & (1<<i)) > 0);
      if((this.bin & (1<<i)) > 0){res++;};
    };
    return res;
  };
    this.toList = function(){
	var res = [];
	for(var i=0;i<30;i++){
	    if(this.has(i)){
		res.push(i);
	    };
	};
	return res;
    };
    this.randomElem = function(){
	var lst = this.toList();
	return randomElem(lst);
    };
};


// var testset1 = new smallSet()

// testset1.add(5)
// testset1.add(10)

// var testset2 = new smallSet()

// testset2.add(5)
// testset2.add(15)

function logicalOr(a,b){
  return a || b;
};

function cloneList(lst){
  var res = [];
  var len = lst.length;
  for(var i=0;i<len;i++){
    res[i] = lst[i].clone();
  };
  return res;
};


Array.prototype.clone = function(){
    var res = [];
    var len = this.length;
    for(var i=0;i<len;i++){
	var newobj;
	if(typeof(this[i])=='object'){
	    newobj = this[i].clone();
	}
	else{
	    newobj = this[i];
	};
	res[i] = newobj;
    };
    return res;
};


function randomElem(ar){
    var len = ar.length;
    var ind = Math.floor(Math.random()*len);
    return ar[ind];
};

function matrixTranspose(mat){
    var nr = mat.length;
    var nc = mat[0].length;
    var res = [];
    for(var i=0;i<nc;i++){
	res[i] = [];
    };
    var fun1 = function(x,i){
	res[i].push(x);
    };
    var fun2 = function(r){
	r.forEach(fun1);
    };
    mat.forEach(fun2);
    return res;
};

function flatten1(mat){
    return mat.reduce(function(a,b){
			     return a.concat(b);
			 },[]);
};

function cartesianProd(l1,l2){
    var res = [];
    var fun = function(e1){
	return function(e2){
	    return [e1,e2];
	};
    };
    res = l1.map(function(e1){
		      return l2.map(fun(e1));
		 });
    return flatten1(res);
};

Array.prototype.equal = function(arr){
    if(this.length != arr.length){
	return false;
    };
    return this.every(function(e,i){
			  if(typeof(e) === "object"){
			      return e.equal(arr[i]);
			  }
			  else{
			      return e === arr[i];
			  };
		      });
};

String.prototype.equal = function(str){
    return this == str;
};
Number.prototype.equal = function(x){
    return this == x;
};
String.prototype.clone = function(){
    return this.concat();
};

Array.prototype.has = function(elem){
    return this.some(function(e){
			 return elem.equal(e);
		     });
};

Array.prototype.indexOfProp = function(pred){
    var res = this.map(pred);
    return res.indexOf(true);
};

// Array.prototype.removeAll = function(elem){
//     var res = [];
//     var fun = function(e){
// 	if(!elem.equal(e)){
// 	    res.push(e);
// 	};
//     };
//     this.forEach(fun);
//     return res;
// };

// remove all elements equal to elem from array 
Array.prototype.removeAll = function ( elem ){
    "use strict";
    // return true if e not equal to elem
    var newlst;
    function fun( e ){
	return !elem.equal(e);
    }
    newlst = this.filter( fun );
    this.length = 0;
    this.push.apply( this, newlst );
    return this;
}

Array.prototype.removeAllC = function ( elem ){
    "use strict";
    // return true if e equal to elem
    var cp = this.clone();
    cp.removeAll( elem );
    return cp;
}

Array.prototype.removeAllOfListC = function ( lst ){
    "use strict";
    // return true if e equal to elem
    var cp = this.clone();
    function eafnc( el ){
	cp.removeAll( el );
    }    
    lst.forEach( eafnc );
    return cp;
}



function lookUp(mat,loc){
    return mat[loc[0]][loc[1]];
};

Array.prototype.vectorAdd = function(vct){
    return this.map(function(x,i){
			return x + vct[i];
		    });
};

Array.prototype.scalarMult = function(s){
    return this.map(function(x){
			   return x*s;
		       });
};

Array.prototype.vectorMinus = function(vct){
    return this.map(function(x,i){
			return x - vct[i];
		    });
};

Array.prototype.map2 = function(fun,o){
    if(o===undefined){
	o = this;
    };
    var res = this.clone();
    var fun1 = function(lst){
	return lst.map(fun,o);
    };
    return this.map(fun1,o);
};
Array.prototype.forEach2 = function(fun,o){
    if(o===undefined){
	o = this;
    };
    var res = this.clone();
    var fun1 = function(lst){
	lst.forEach(fun,o);
    };
    this.forEach(fun1,o);
};
Array.prototype.filter2 = function(fun,o){
    if(o===undefined){
	o = this;
    };
    var res = this.clone();
    var fun1 = function(lst){
	return lst.filter(fun,o);
    };
    return this.map(fun1,o);
};

function numberSequence(start,finish,del){
    if(del===undefined){
	del = 1;
    };
    var res = [start];
    var cur = start + del;
    while(cur<=finish){
	res.push(cur);
	cur += del;
    };
    return res;
};

Array.prototype.count = function(pred){
    var res = this.filter(pred);
    return res.length;
};

function setMatEntry(mat,loc,val){
    mat[loc[0]][loc[1]] = val;
};

function makeConstantArraySimp(num,len){
    var res = [];
    for(var i=0;i<len;i++){
	res.push(num);
    };
    return res;
};

function makeConstantArray(val,len){
    var res = [];
    for(var i=0;i<len;i++){
	res.push(val.clone());
    };
    return res;
};

Math.plus = function(x,y){
    return x + y;
};
Math.minus = function(x,y){
    return x - y;
};
Math.sign = function( x ){
    if ( x > 0 ){
	return 1;
    } else if ( x < 0 ){
	return -1;
    } else {
	return 0;
    }
};


function fixedPoint(x0,fun){
    var cur = x0;
    var nxt = fun(cur);
    while(!cur.equal(nxt)){
	cur = nxt;
	nxt = fun(cur);	
    };
    return cur;
};

function repeat(x0,fun,n){
    var cur = x0;
    for(var i = 0;i<n;i++){
	cur = fun(cur);		
    };
    return cur;
};

// function extend(child, supertype){  
//     child.prototype.__proto__ = supertype.prototype;  
// };

function cartesianProduct (a1,a2) {
    var resProduct = [];
    function fn1 (a,b) {
	resProduct.push([a,b]);
    };
    function fn2 (ar,b) {
	ar.forEach(function(x){fn1(x,b)});
    };
    a2.forEach(function(x){fn2(a1,x)});
    return resProduct;
};


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    this.push.apply(this, rest);
    return this;
};
Array.prototype.removeC = function(from, to) {
    var rest, res;
    rest = this.slice((to || from) + 1 || this.length);
    res = this.clone();
    res.length = from < 0 ? res.length + from : from;
    res.push.apply(res,rest);
    return res;
};


Array.prototype.last = function() {
    return this[ this.length - 1 ];
}


Array.prototype.dropLastC = function( n ) {
    return this.slice( 0, this.length - n );
}

function compareNumbers(a, b)
{
  return a - b;
}

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}
//newObject = Object.create(oldObject);

// returns a boolean function that checks whether fun is equal to cns 
function makeValCheck( fun, cns ){
    "use strict";
    return function (x) { return fun( x ) === cns; }
}

Array.prototype.union = function() {
    "use strict";
    var res = this.clone();
    if ( this.every( Array.isArray )) {
	return flatten1( res );
    } else {
	return res;
    }
}

Array.prototype.intersection = function( lst ) {
    "use strict";
    var res = this.clone();
    function common( el ){
	return lst.has( el );
    }
    return res.filter( common );
}

Array.prototype.connected = function( lst, rel ){
    "use strict";
    function fun( el ){
	return lst.some( function ( e ){ return rel( e, el ); })
    }
    return this.some( fun );
};

// converts list of strings to single string with space between each element 
Array.prototype.stringListToString = function ( ){
    "use strict";
    function cnct( s1, s2 ){
	return s1 + " " + s2;
    }
    return this.reduce( cnct, "" );
};

// lexicographical order on lists of numbers 
// right to left!
// Destructive!
function lexicalListOrderD( l1, l2 ){
    "use strict";
    var h1, h2, sub;
    if ( l1.length === 0 ){
	return true;
    }
    if ( l2.length === 0 ){
	return "equal";
    }
    h1 = l1.pop();
    h2 = l2.pop();
    if ( typeof( h1 ) === "number" && typeof( h1 ) === "number" ){
	if ( h1 < h2 ) {
	    return true;
	} else if ( h1 > h2 ) {
	    return false;
	} else{
	    return lexicalListOrderD( l1, l2 );
	}
    } else {
	h1.reverse();
	h2.reverse();
	sub = lexicalListOrderD( h1, h2 );
	if ( sub !== "equal" ){
	    return sub;
	} else {
	    return lexicalListOrderD( l1, l2 );
	}
    }
}

// lexicographical order on lists of numbers 
// left to right
// nondestructive
function lexicalListOrder( l1, l2 ){
    "use strict";
    var c1, c2;
    c1 = l1.clone();
    c2 = l2.clone();
    c1.reverse();
    c2.reverse();
    return lexicalListOrderD( c1, c2 );
}

// sort list of lists of numbers lexicographically 
function sortLists( lst ){
    "use strict";
    lst.sort( lexicalListOrder );
}

// destructive dot product 
function dotD( l1, l2 ){
    "use strict";
    if ( l1.length === 0 && l2.length === 0 ) {
	return 0;
    }
    var h1, h2;
    h1 = l1.pop();
    h2 = l2.pop();
    return h1 * h2 + dotD( l1, l2 );
}

Array.prototype.dot = function( lst ){
    "use strict";
    var c1, c2;
    c1 = this.clone();
    c2 = lst.clone();
    return dotD( c1, c2 );
};


// return best item in lst according to preference func prf 
// cur = current best
function bestWRT( lst, prf, cur ){
    "use strict";
    if ( !cur ){
	cur = lst.pop();
    }
    var hd, nwcr;
    if ( lst.length === 0 ) {
	return cur;
    }
    hd = lst.pop();
    nwcr = ( prf( cur, hd ) ) ? cur : hd;
    return bestWRT( lst, prf, nwcr );
}

function best( lst ){
    "use strict";
    return bestWRT( lst, lexicalListOrder );
}

// sets function for onClick 
function setOnClick( id, fnc ){
    "use strict";
    document.querySelector( '#' + id ).addEventListener( 'click', fnc, false);
}

// set handler for button click 
function setClickHandler( id, fnc ){
    "use strict";
    document.addEventListener('DOMContentLoaded', function () {
	setTimeout( function(){
	    setOnClick( id, fnc);
	}, 
		    300 );
    }
			     )
}



function makeButton (txt,idtxt,func,width,height,fsize,bgcolor,ffamily) {
    "use strict";
    if (!width) {
	width = "1*";
    }
    if (!height) {
	height = "1*";
    }
    if (!fsize) {
	fsize = "14";
    }
    if ( !bgcolor ) {
	bgcolor = "Chartreuse";
    }    
    if ( !ffamily ) {
	ffamily = "Georgia, Times New Roman, Comic Sans MS, Helvetica, Palatino";
    }    
    var stytxt = "style='width:" + width + ";font-family:" + ffamily + ";background-color:" + bgcolor + ";height:" + height + ";font-size:" + fsize + ";'";
    setClickHandler( idtxt, func );
    return "<input type='button' value='"+txt+"' "+stytxt+" id='"+idtxt+"'>";
}

var buttonOpts = {
    "text": "Button", "idtext": "button", "width": "1*", "height": "1*", "fontSize": "14", "bgColor": "Chartreuse", "fontFamily": "Georgia, Times New Roman, Comic Sans MS, Helvetica, Palatino", "fontStyle": "normal"
};

// buttonOpts maker 
function newButtonOpts( ){
    "use strict";
    var res = Object.create( buttonOpts );
    return res;
}

// produce HTML for button
function makeButt ( bopts ) {
    "use strict";   
    var stytxt = "style='width:" + bopts.width + ";font-family:" + bopts.fontFamily + ";font-style:" + bopts.fontStyle + ";background-color:" + bopts.bgColor + ";height:" + bopts.height + ";font-size:" + bopts.fontSize + ";'";
    return "<input type='button' value='"+bopts.text+"' "+stytxt+" id='"+bopts.idtext+"'>";
}

if (typeof Object.prototype.forEach !== 'function') {
    Object.prototype.forEach = function ( fnc ) {
	"use strict";
	var p;
	for ( p in this ){
	    if ( typeof( this[ p ] ) !== 'function' ){
		fnc( this[ p ], p );
	    }
	}
    };
}



function betterBezier( x1, y1, a1, a2, x2, y2, scale ){
    "use strict";
    var scale, cos1, sin1, cos2, sin2;
    if ( !scale ){
	scale = 40;
    }
    cos1 = Math.cos( a1 / 360 * 2 * pi );
    sin1 = Math.sin( a1 / 360 * 2 * pi ); 
    cos2 = Math.cos( a2 / 360 * 2 * pi );
    sin2 = Math.sin( a2 / 360 * 2 * pi ); 
    cnv.beginPath();
    cnv.strokeStyle = "Blue";
    cnv.moveTo( x1, y1 );
    cnv.bezierCurveTo( x1 + scale * cos1, y1 - scale * sin1, x2 + scale * cos2, y2 - scale * sin2, x2, y2 );
    cnv.stroke();
}
