//-*- js-mode -*-

/*jslint browser: true, devel: true, es5: true */
/*global setDiv, makeTag, cartesianProduct, makeButton, setTagOpt, setTagSty, getDiv, makeValCheck, flatten1, compareNumbers, newButtonOpts, setClickHandler, setOnClick, betterBezier, smallSet, escape, unescape */

var cnv, cnvelm, wdth, hght, cntrHt, cntrWd, sideDev, upDev, dnDev, crcSep, mrgn;
var labelhtml, posLabA, charLab, posCent, drawArc, pi, pieces, rad, posRect;
var controlsHTML, bopts, curShadeClr, colors, colors, colors, colorOps;
var numOffV, numOffH, sin30, cos30, sqrt3, mode, memStack, smllst, emptySet;
//functions:
var drawVenn, shadeRegion, reShadeAll, addColors, drawInkInd, setShadeClrFun;
var reDrawAll, rePrintSizesAll, reDrawAll, cnvArc;

memStack = [];
mode = "Shade";
numOffH = 16;
numOffV = 4;
pi = Math.PI; 
sin30 = 1 / 2;
cos30 = Math.sqrt( 3 ) / 2;
sqrt3 = Math.sqrt( 3 );

charLab = {};
charLab.A = "A";
charLab.B = "B";
charLab.C = "C";
wdth = 960;
hght = 900;
cntrHt = hght / 2;
cntrWd = wdth / 2;
rad = hght / 4.3;
crcSep = rad;
dnDev = 0.10 * hght;
upDev = crcSep * Math.sqrt( 3 ) / 2 - dnDev;
sideDev = crcSep / 2;
mrgn = wdth / 10;
posLab = {};
posLab.A = { x: 2 * mrgn, y: 2 * mrgn };
posLab.B = { x: wdth - 2.2 * mrgn, y: 2 * mrgn };
posLab.C = { x: wdth * 0.30, y: hght - 1.5 * mrgn };
posCent = {};
posCent.A = { x: cntrWd - sideDev, y: cntrHt - upDev };
posCent.B = { x: cntrWd + sideDev, y: cntrHt - upDev };
posCent.C = { x: cntrWd, y: cntrHt + dnDev };
posRect = { "x": mrgn, "y": mrgn, "width": wdth - 2 * mrgn, "height": hght - 2 * mrgn };

labelhtml = "<hbox><input id='labA' class='lab' type='text' size='2'></input>\
&nbsp;:&nbsp;<input id='defA' class='def' type='text' size='40'></input> \
<br></hbox><hbox><input id='labB' class='lab' type='text' size='2'></input>\
&nbsp;:&nbsp;<input id='defB' class='def' type='text' size='40'></input> \
<br></hbox><hbox><input id='labC' class='lab' type='text' size='2'></input>\
&nbsp;:&nbsp;<input id='defC' class='def' type='text' size='40'></input></hbox>";

colors = {};
colors.a = "LightBlue";
colors.b = "Pink";
colors.c = "Purple";
curShadeClr = colors.a;

controlsHTML = repeatTxt( "&nbsp;", 0 );
controlsHTML = repeatTxt( "<br/>", 4 );
bopts = newButtonOpts();
bopts.text = "Two";
bopts.bgColor = "Orange";
bopts.idtext = "bt2or3";
bopts.fontSize = "20";
bopts.width = "150";
controlsHTML += "<br>" + makeButt( bopts );
bopts.text = "Clear Shading";
bopts.idtext = "btClearShading";
bopts.bgColor = "White";
controlsHTML += "<br>" + makeButt( bopts );
bopts.text = "Clear Sizes";
//bopts.width = "9%";
bopts.idtext = "btClearSizes";
controlsHTML += "<br>" + makeButt( bopts );
//bopts.width = "5%";
bopts.bgColor = colors.a;
bopts.idtext = "bt" + colors.a;
bopts.text = "";
controlsHTML += "<br>" + makeButt( bopts );
bopts.bgColor = colors.b;
bopts.idtext = "bt" + colors.b;
controlsHTML += "<br>" + makeButt( bopts );
bopts.bgColor = colors.c;
bopts.idtext = "bt" + colors.c;
controlsHTML += "<br>" + makeButt( bopts );
bopts.bgColor = "White";
bopts.idtext = "btWhite";
controlsHTML += "<br>" + makeButt( bopts );
bopts.bgColor = "Silver";
bopts.text = "&cup;";
bopts.idtext = "btUnion";
controlsHTML += "<br>" + makeButt( bopts );
bopts.text = "&cap;";
bopts.idtext = "btInter";
controlsHTML += "<br>" + makeButt( bopts );
bopts.text = "&#9775;";
bopts.idtext = "btComp";
bopts.bgColor = colors.a;
controlsHTML += "<br>" + makeButt( bopts );
bopts.bgColor = "Silver";
//bopts.width = "6%";
bopts.text = "Push";
bopts.idtext = "btPush";
controlsHTML += "<br>" + makeButt( bopts );
bopts.text = "Pop";
bopts.idtext = "btPop";
controlsHTML += "<br>" + makeButt( bopts );
bopts.text = "Size From Sum";
bopts.idtext = "btSizeSum";
controlsHTML += "<br>" + makeButt( bopts );
bopts.text = "Size From Diff";
bopts.idtext = "btSizeDiff";
controlsHTML += "<br>" + makeButt( bopts );
bopts.text = "Size";
bopts.bgColor = "Orange";
bopts.idtext = "btMode";
controlsHTML += "<br>" + makeButt( bopts );

colorOps = {};
colorOps.union = function( clr ){
    "use strict";
    if ( clr === "White" ){
	return "White";
    }
    return colors.a;
};
colorOps.inter = function( clr ){
    "use strict";
    if ( clr === colors.c ){
	return colors.a;
    }
    return "White";
};

colorOps.comp = function( clr ){
    "use strict";
    if ( clr !== colors.a ){
	return colors.a;
    }
    return "White";
};

// draw a clover at x, y with radius r 
function drawClover( x, y, r ){
    "use strict";
    var c1x, c1y, c2x, c2y, c3x, c3y;
    c1x = x - r / 2;
    c2x = x + r / 2;
    c3x = x;
    c1y = y - r / (2 * sqrt3);
    c2y = c1y;
    c3y = y + r / sqrt3;
    cnv.beginPath();
    cnvArc( c1x, c1y, r, pi / 3, 4 * pi / 3, true );
    cnvArc( c3x, c3y, r, pi, 2 * pi, true );
    cnvArc( c2x, c2y, r, -pi / 3, 2 * pi / 3, true );
    cnv.closePath();
    cnv.strokeStyle = "Black";
    cnv.stroke();
}

// identify part of VD where (x,y) is located 
function locatePnt( x, y ){
    "use strict";
    var da, db, dc, dr, res, tol;
    tol = 5;
    da = Math.sqrt( Math.pow( x - posCent.A.x, 2 ) + Math.pow( y - posCent.A.y, 2 ) );
    db = Math.sqrt( Math.pow( x - posCent.B.x, 2 ) + Math.pow( y - posCent.B.y, 2 ) );
    dc = Math.sqrt( Math.pow( x - posCent.C.x, 2 ) + Math.pow( y - posCent.C.y, 2 ) );
    dr = Math.sqrt( Math.pow( rad, 2) );
    res = {};
    res.A = ( da < dr );
    res.B = ( db < dr );
    res.C = ( dc < dr );
    res.Acirc = ( Math.abs( da - dr ) < tol );
    res.Bcirc = ( Math.abs( db - dr ) < tol );
    res.Ccirc = ( Math.abs( dc - dr ) < tol );
    res.AB = res.Acirc && res.Bcirc;
    res.AC = res.Acirc && res.Ccirc;
    res.BC = res.Ccirc && res.Bcirc;
    res.ABC = res.A && res.B && res.C;
    res.U = ( Math.abs( x - mrgn ) < tol || Math.abs( x - ( wdth - mrgn ) ) < tol || Math.abs( y - mrgn ) < tol || Math.abs( y - ( hght - mrgn ) ) < tol );
    return res;
}

// erase a letter from the canvas 
// function erase( abc, pos ){
//     "use strict";
//     cnv.fillStyle = 'White';
//     cnv.strokeStyle = 'White';
//     cnv.fillText( abc, pos.x, pos.y );
//     //cnv.strokeText( abc, pos.x, pos.y );    
// }

// clear all but the circles 
function clearDia( ){
    "use strict";
    //cnv.fillStyle = "White";
    cnv.clearRect(0, 0, wdth, hght);
    drawVenn();
}

// reset shadings to White 
function resetShade( ){
    "use strict";
    function whfn( reg, nm ){
	pieces[ nm ].color = "White";
    }
    pieces.forEach( whfn );
}

// clear all but the circles and reset shadings to White
function clearVenn( ){
    "use strict";
    clearDia();
    resetShade();
    reDrawAll();
    curShadeClr = colors.a;
    drawInkInd();
}


// change set variable 
function printVar( ev ){
    "use strict";
    var trgid, lb, newchr;
    trgid = ev.target.id;
    lb = trgid.slice( 3 );
    newchr = ev.target.value;
    //erase( charLab[ lb ], posLab[ lb ] );
    cnv.fillStyle = 'Black';
    //cnv.strokeStyle = 'Blue';    
    //cnv.fillText( newchr, posLab[ lb ].x, posLab[ lb ].y );
    charLab[ lb ] = newchr;
    reDrawAll();
    drawVenn();
}

// handle mouse clicks in canvas 
// return region string 
function mouseHandler( ev ){
    "use strict";
    var x, y, loc, bt, reg, num;
    bt = ev.button;
    x = ev.pageX;
    y = ev.pageY;
    x -= cnvelm.offsetLeft;
    y -= cnvelm.offsetTop;
    if ( x < posRect.x || y < posRect.y || x > posRect.x + posRect.width || y > posRect.y + posRect.height ){
	return;
    }
    loc = locatePnt( x, y );
    reg = "";

    switch ( bt ){
    case 1:
	if ( loc.AB ){
	    reg = "AuB"; 
	} else if ( loc.AC ) {
	    reg = "AuC";
	} else if ( loc.BC ){
	    reg = "BuC";
	} else if ( loc.ABC){
	    reg = "AuBuC";
	}
	break;
    case 0:
	if ( loc.AB ){
	    reg = "AB"; 
	} else if ( loc.AC ) {
	    reg = "AC";
	} else if ( loc.BC ){
	    reg = "BC";
	} else if ( loc.Acirc ){
	    reg = "A";
	} else if ( loc.Bcirc ){
	    reg = "B";
	} else if ( loc.Ccirc ){
	    reg = "C";
	} else if ( loc.U ){
	    reg = "U";
	} else if ( loc.A && loc.B && loc.C ){
	    reg = "ABC";
	} else if ( loc.A && loc.B && !loc.C ) {
	    reg = "ABc";
	} else if ( loc.A && !loc.B && loc.C ){
	    reg = "AbC";
	} else if ( !loc.A && loc.B && loc.C ){
	    reg = "aBC";
	} else if ( !loc.A && !loc.B && !loc.C ){
	    reg = "abc";
	} else if ( loc.A && loc.B && loc.C ){
	    reg = "ABC";
	} else if ( loc.A && !loc.B && !loc.C ) {
	    reg = "Abc";
	} else if ( !loc.A && !loc.B && loc.C ){
	    reg = "abC";
	} else if ( !loc.A && loc.B && !loc.C ){
	    reg = "aBc";
	}
	break;
    default:
	console.log( "Click was not inside Venn diagram" );
	break;
    }
    //cnv.fillStyle = 'Red';
    //cnv.fillText( reg, x, y );
    if ( reg === "" ){ return; }
    if ( mode === "Shade" ){
	shadeRegion( reg );
    } else {
	//if ( !pieces[ reg ].showSize ){
	    pieces[ reg ].showSize = true;
	    pieces[ reg ].printSize();
	//} else {
	    num = prompt( "Size = " );
	    if ( num !== null ){
		pieces[ reg ].size = num;
		pieces[ reg ].printSize();
	    }
	//}
    }
}

// redo arc method so it's sane 
// forward = Boolean, meaning counterclockwise
function cnvArc( x, y, r, a1, a2, forward ){
    "use strict";
    var an1, an2;
    if ( forward === undefined ){
	forward = true;
    }
    if ( !forward ){
	an1 = a2;
	an2 = a1;
    } else {
	an1 = a1;
	an2 = a2;
    }
    cnv.arc( x, y, r, -an1, -an2, forward );
}

drawArc = {
    'A': function(f){ "use strict"; 
cnvArc( posCent.A.x, posCent.A.y, rad, pi / 3, 4 * pi / 3, f ); },
    'B': function(f){ "use strict"; 
cnvArc( posCent.B.x, posCent.B.y, rad, -pi / 3, 2 * pi / 3, f ); },
    'C': function(f){ "use strict"; 
cnvArc( posCent.C.x, posCent.C.y, rad, -pi, 0, f ); },    
    'Ab': function(f){ "use strict"; 
cnvArc( posCent.A.x, posCent.A.y, rad, 0, pi / 3, f ); },
    'Abc': function(f){ "use strict"; 
cnvArc( posCent.A.x, posCent.A.y, rad, -pi / 3, 0, f ); },
    'Ac': function(f){ "use strict"; 
cnvArc( posCent.A.x, posCent.A.y, rad, -2 * pi / 3, -pi / 3, f ); },
    'Bc': function(f){ "use strict"; 
cnvArc( posCent.B.x, posCent.B.y, rad, -2 * pi / 3, -pi / 3, f ); },
    'Bac': function(f){ "use strict"; 
cnvArc( posCent.B.x, posCent.B.y, rad, -pi, -2 * pi / 3, f ); },
    'Ba': function(f){ "use strict"; 
cnvArc( posCent.B.x, posCent.B.y, rad, 2 * pi / 3, pi, f ); },
    'Ca': function(f){ "use strict"; 
cnvArc( posCent.C.x, posCent.C.y, rad, 2 * pi / 3, pi, f ); },    
    'Cab': function(f){ "use strict"; 
cnvArc( posCent.C.x, posCent.C.y, rad, pi / 3, 2 * pi /3, f ); },    
    'Cb': function(f){ "use strict"; 
cnvArc( posCent.C.x, posCent.C.y, rad, 0, pi / 3, f ); },
    'Rect': drawRect
};

// write size n at given location 
function writeSize( reg ){
    "use strict";
    if ( !reg.showSize ){
	return;
    }
    var n, x, y;
    n= reg.size;
    x = reg.sizeLoc.x;
    y = reg.sizeLoc.y;
    cnv.font = 'italic 40px Times';
    cnv.fillStyle = "Black";
    cnv.fillText( String( n ), x - numOffH, y - numOffV );
    reg.sizeLine();
}

function nullFun(){
"use strict";
}

var county = {};
county.edges = [];
county.ccw = [];
county.color = "White";
county.comprises = [];
county.size = "?";
county.sizeLoc = { "x": undefined, "y": undefined };
county.printSize = reDrawAll;
county.sizeLine = nullFun;
county.showSize = false;

function newCounty( es, os, cmp, x, y ){
    "use strict";
    var res, loc;
    if ( !x ){
	x = 0;
	y = 0;
    }
    loc = { "x": x, "y": y };
    res = Object.create( county );
    res.edges = es;
    res.ccw = os;
    res.comprises = cmp;
    res.sizeLoc = loc;
    return res;
} 


pieces = {
    "ABC": newCounty( [ "Abc", "Bac", "Cab" ], [ false, false, false ],
		    [ "ABC" ], cntrWd, cntrHt ),
    "aBC": newCounty( [ "Abc", "Bc", "Cb" ], [ false, true, true ],
		      [ "aBC" ], cntrWd + 1.1 * sideDev, cntrHt + 0.6 * dnDev ),
    "AbC": newCounty( [ "Ac", "Bac", "Ca" ], [ true, false, true ],
		    [ "AbC" ], cntrWd - 1.3 * sideDev, cntrHt + 0.7 * dnDev  ),
    "ABc": newCounty( [ "Ab", "Ba", "Cab" ], [ true, true, false ],
		    [ "ABc" ], cntrWd, cntrHt - 1.7 * upDev  ),
    "Abc": newCounty( [ "A", "Ca", "Ba" ], [ true, false, false ],
		    [ "Abc" ], posCent.A.x - 0.4 * rad, posCent.A.y - 0.2 * rad ),
    "aBc": newCounty( [ "B", "Cb", "Ab" ], [ true, false, false ],
		    [ "aBc" ], posCent.B.x + 0.4 * rad, posCent.B.y - 0.2 * rad  ),
    "abC": newCounty( [ "Ac", "Bc", "C" ], [ false, false, true ],
		    [ "abC" ], cntrWd, posCent.C.y + 0.6 * rad  ),
    "abc": newCounty( [ "A", "B", "C", "Rect" ], [ false, false, false, true ],
		    [ "abc" ], wdth - 2 * mrgn, hght - 2 * mrgn  ),
    "AuBuC": newCounty( [ "A", "C", "B"], [ true, true, true ],
		    [ "ABC", "aBC", "AbC", "ABc", "abC", "aBc", "Abc" ].sort(), wdth - mrgn / 1.9, hght - 0.6 * mrgn  ),
    "AB": newCounty( [ "Ab", "Abc", "Bac", "Ba" ], [ true, true, true, true ],
		    [ "ABC", "ABc" ].sort(), cntrWd + 0.9 * mrgn, 0.8 * mrgn  ),
    "AC": newCounty( [ "Ac", "Abc", "Cab", "Ca" ], [ true, true, true, true ],
		    [ "ABC", "AbC" ].sort(), 0.4 * mrgn, 0.8 * hght  ),
    "BC": newCounty( [ "Bc", "Bac", "Cab", "Cb" ], [ true, true, true, true ],
		    [ "ABC", "aBC" ].sort(), wdth - 0.6 * mrgn, 0.8 * hght  ),
    "AuB": newCounty( [ "B", "A", "Ac", "Bc" ], [ true, true, true, true ],
		    [ "ABC", "ABc", "AbC", "Abc", "aBC", "aBc" ].sort(), cntrWd - 0.6 * mrgn, 0.8 * mrgn  ),
    "AuC": newCounty( [ "A", "C", "Cb", "Ab" ], [ true, true, true, true ],
		    [ "ABC", "AbC", "ABc", "Abc", "aBC", "abC" ].sort(), 0.4 * mrgn, cntrHt + mrgn  ),
    "BuC": newCounty( [ "C", "B", "Ba", "Ca" ], [ true, true, true, true ],
		    [ "ABC", "aBC", "ABc", "aBc", "AbC", "abC" ].sort(), wdth - 0.6 * mrgn, cntrHt + mrgn  ),
    "A": newCounty( [ "A", "Ac", "Abc", "Ab" ], [ true, true, true, true ],
		    [ "ABC", "ABc", "AbC", "Abc" ].sort(), 0.4 * mrgn, 2.3 * mrgn  ),
    "B": newCounty( [ "B", "Ba", "Bac", "Bc" ], [ true, true, true, true ],
		    [ "ABC", "ABc", "aBC", "aBc" ].sort(), wdth - 0.6 * mrgn, 2.3 * mrgn  ),
    "C": newCounty( [ "C", "Ca", "Cab", "Cb" ], [ true, true, true, true ],
		    [ "ABC", "AbC", "aBC", "abC" ].sort(), cntrWd, hght - 0.4 * mrgn  ),
    "U": newCounty( [ "Rect" ], [ true ], [ "ABC", "ABc", "AbC", "Abc", "aBC", "aBc", "abC", "abc" ].sort(), wdth - mrgn * 1.5, 0.9 * mrgn )
};


// identify region name from list of elementary constituents 
function idList( lst ){
    "use strict";
    var cnst, nm, res;
    res = "";
    cnst = lst.clone().sort();
    for ( nm in pieces ){
	if ( typeof( pieces[ nm ] ) !== 'function' && cnst.equal( pieces[ nm ].comprises ) ){
	    res = nm;
	    break;
	}
    }
    return res;
}

emptySet = new smallSet();

// form smallSet union of regions named in list 
function ssUnion( lst ){
    "use strict";
    var sslst;
    function ssFun( r ){ return pieces[ r ].ss; }
    sslst = lst.map( ssFun );
    function ssUn( s1, s2 ){ return s1.union( s2 ); }
    return sslst.reduce( ssUn, emptySet );
}

// the union of the first list is contained in the union of the second
// NB: regions are listed by name
function subsetOf( l1, l2 ){
    "use strict";
    var ss1, ss2;
    ss1 = ssUnion( l1 );
    ss2 = ssUnion( l2 );
    return ss1.subset( ss2 );
}

// check that string represents integers 
function checkIntQ( str ){
    "use strict";
    return String( parseInt( str, 10 ) ) === str || typeof( str ) === "number";
}

// find sized intermediate sets between given 
// sets are given as lists of names of regions 
function findIntermediateOfLists( l1, l2 ){
    "use strict";
    var res;
    res = [];
    function chck( r, n ){
	if ( subsetOf( l1, [n] ) && subsetOf( [n], l2 ) && checkIntQ( r.size ) ){
	 res.push( n );   
	} 
    }
    pieces.forEach( chck );
    return res;
}
// find sized intermediate sets between given 
// sets are given as names of regions 
function findIntermediate( nm1, nm2 ){
    "use strict";
    return findIntermediateOfLists( [nm1], [nm2] );
}

// get complement of set given as list of names 
function complement( lst ){
    "use strict";
    var res;
    res = pieces.U.comprises;
    function check( r ){ return !lst.has( r ); }
    return res.filter( check );
}


// determine size of given set
// set given by list of names 
function detSize( lst ){
    "use strict";
    var id, ints, i, cmp, crr, lres;
    id = idList( lst );
    if ( id !== "" && checkIntQ( pieces[ id ].size ) ){
	return pieces[ id ].size;
    }
    ints = findIntermediateOfLists( [], lst);
    for ( i=0; i < ints.length; i += 1){
	crr = ints[ i ];
	cmp = lst.intersection( complement( pieces[ crr ].comprises ) );
	lres = detSize( cmp );
	if ( checkIntQ( lres ) ){
	    return parseInt( pieces[ crr ].size, 10 ) + parseInt( lres, 10 );
	}
    }
    return null;
}

// return max of two regions, undefined if no max 
// regions by name
function maxOf( n1, n2 ){
    "use strict";
    if ( subsetOf( [n1], [n2] ) ){
	return n2;
    } else if ( subsetOf( [n2], [n1] ) ){
	return n1;
    } else {
	return undefined;
    }
}

// drawSizeLine 
function drawSizeLine( x1, y1, x2, y2 ){
    "use strict";
    cnv.beginPath();
    cnv.strokeStyle = "Blue";
    cnv.moveTo( x1, y1 );
    cnv.lineTo( x2, y2 );
    cnv.stroke();
}


pieces.AB.sizeLine = function(){
    "use strict";
    drawSizeLine( cntrWd, posCent.A.y - Math.sqrt( 3 ) / 2 * rad, this.sizeLoc.x, this.sizeLoc.y );
};
pieces.AC.sizeLine = function(){
    "use strict";
    drawSizeLine( posCent.A.x - rad / 2, posCent.A.y + Math.sqrt( 3 ) / 2 * rad, this.sizeLoc.x + 2 * numOffH, this.sizeLoc.y - 4 * numOffV );
};
pieces.BC.sizeLine = function(){
    "use strict";
    drawSizeLine( posCent.B.x + rad / 2, posCent.B.y + Math.sqrt( 3 ) / 2 * rad, this.sizeLoc.x - numOffH, this.sizeLoc.y - 4 * numOffV );
};
pieces.A.sizeLine = function(){
    "use strict";
    drawSizeLine( posCent.A.x - Math.sqrt( 3 ) * rad / 2, posCent.A.y - rad / 2, this.sizeLoc.x + 3 * numOffH, this.sizeLoc.y - 4 * numOffV );
};
pieces.B.sizeLine = function(){
    "use strict";
    drawSizeLine( posCent.B.x + Math.sqrt( 3 ) * rad / 2, posCent.B.y - rad / 2, this.sizeLoc.x - numOffH, this.sizeLoc.y - 4 * numOffV );
};
pieces.C.sizeLine = function(){
    "use strict";
    drawSizeLine( posCent.C.x, posCent.C.y + rad, this.sizeLoc.x, this.sizeLoc.y - 10 * numOffV );
};
pieces.AuB.sizeLine = function(){
    "use strict";
    betterBezier( posCent.A.x, posCent.A.y - rad, 60, 240, this.sizeLoc.x, this.sizeLoc.y );
    betterBezier( posCent.B.x, posCent.B.y - rad, 120, 300, this.sizeLoc.x, this.sizeLoc.y );
};
pieces.AuC.sizeLine = function(){
    "use strict";
    var x2, y2;
    x2 = this.sizeLoc.x + 3 * numOffH;
    y2 = this.sizeLoc.y - 4 * numOffV;
    betterBezier( posCent.A.x - rad, posCent.A.y, 210, 30, x2, y2 );
    betterBezier( posCent.C.x - cos30 * rad, posCent.C.y + rad / 2, 180, 0, x2, y2 );
};
pieces.BuC.sizeLine = function(){
    "use strict";
    var x2, y2;
    x2 = this.sizeLoc.x - numOffH;
    y2 = this.sizeLoc.y - 4 * numOffV;
    betterBezier( posCent.B.x + rad, posCent.B.y, -30, 150, x2, y2 );
    betterBezier( posCent.C.x + cos30 * rad, posCent.C.y + rad / 2, 0, 180, x2, y2 );
};
pieces.AuBuC.sizeLine = function(){
    "use strict";
    var x2, y2;
    x2 = this.sizeLoc.x + 0.56 * numOffH;
    y2 = this.sizeLoc.y - 3 * numOffV;
    drawClover( x2, y2, 26 );
};

// generate smallSet from given region 
function regToSS( reg ){
    "use strict";
    return ssUnion( reg.comprises );
}

smllst = emptySet.clone();
pieces.abc.ss = smllst.spawn( [0] );
pieces.Abc.ss = smllst.spawn( [1] );
pieces.aBc.ss = smllst.spawn( [2] );
pieces.abC.ss = smllst.spawn( [3] );
pieces.ABc.ss = smllst.spawn( [4] );
pieces.AbC.ss = smllst.spawn( [5] );
pieces.aBC.ss = smllst.spawn( [6] );
pieces.ABC.ss = smllst.spawn( [7] );
pieces.AB.ss = regToSS( pieces.AB );
pieces.AC.ss = regToSS( pieces.AC );
pieces.BC.ss = regToSS( pieces.BC );
pieces.AuB.ss = regToSS( pieces.AuB );
pieces.AuC.ss = regToSS( pieces.AuC );
pieces.BuC.ss = regToSS( pieces.BuC );
pieces.AuBuC.ss = regToSS( pieces.AuBuC );
pieces.U.ss = regToSS( pieces.U );
pieces.A.ss = regToSS( pieces.A );
pieces.B.ss = regToSS( pieces.B );
pieces.C.ss = regToSS( pieces.C );


// shade region outside clover 
function shadeCloverComp( clr ){
    "use strict";
    //var newclr;
    //newclr = addColors( clr, pieces.abc.color );
    if ( !clr ){
	clr = pieces.abc.color;
    }
    cnv.fillStyle = clr;
    cnv.beginPath();
    drawRect();
    cnv.closePath();
    cnv.fill();
    pieces.abc.color = clr;
    //writeSize( pieces.abc );
    rePrintSizesAll();
    reShadeAll();
}

// shade region xyz 
function shadeRegion( xyz, clr ){
    "use strict";
    var bnds, i, newclr;
    if ( xyz === "" ){
	clearDia();
	return ;
    }
    bnds = pieces[ xyz ];

    if ( bnds.comprises.length !== 1 ){
	return bnds.comprises.forEach( function( reg ){ shadeRegion( reg, clr ); } );
    }

    if ( !clr ){
	clr = curShadeClr;
    }
    newclr = addColors( clr, bnds.color );
    if ( xyz === "abc" ){
	return shadeCloverComp( newclr );
    }
    if ( xyz === "U" ){
	shadeCloverComp( newclr );
	return shadeRegion( "AuBuC", clr );
    }
    cnv.fillStyle = newclr;
    cnv.beginPath();
    for ( i = 0; i < bnds.ccw.length; i += 1 ){
	drawArc[ bnds.edges[i] ]( bnds.ccw[i] );
    }
    cnv.fill();
    pieces[ xyz ].color = newclr;
    //writeSize( bnds );
    rePrintSizesAll();
    drawVenn();
}


// reshade all regions except ABc 
function reShadeAll(  ){
    "use strict";
    var reg;
    for ( reg in pieces ) {
        if ( typeof( pieces[ reg ] ) !== 'function' && reg !== "abc" && reg.length === 3 && reg[1] !== "u" ){
            shadeRegion( reg, pieces[ reg ].color );
        }
    }
    drawVenn();
}

// reprint sizes in all regions 
function rePrintSizesAll(  ){
    "use strict";
    var reg;
    for ( reg in pieces ) {
        if ( typeof( pieces[ reg ] ) !== 'function' && pieces[ reg ].showSize ){
            writeSize( pieces[ reg ] );
        }
    }
    drawVenn();
}


// redraw everything 
function reDrawAll( ){
    "use strict";
    clearDia();
    reShadeAll();
    shadeCloverComp();
    rePrintSizesAll();
    drawVenn();
}

// carry out union, intersection, or comp
function performOp( opfun ){
    "use strict";
    function regop( reg, n ){
	if ( n.length === 3 && n[1] !== "u" ){
	    pieces[ n ].color = opfun( reg.color );
	}
    }
    pieces.forEach( regop );
    reDrawAll();
    setShadeClrFun( colors.b )();
}

// make onclick function for give operation 
function makeOpFun( opstr ){
    "use strict";
    var clsop = colorOps[ opstr ];
    return function(  ){
	 performOp( clsop );
    };
}


// draw universe of Venn diagram 
function drawRect( ){
    "use strict";
    cnv.rect( posRect.x, posRect.y, posRect.width, posRect.height );
    cnv.stroke();
}

// color addition function 
function addColors( c1, c2 ){
    "use strict";
    if ( c1 === "White" ){
	return "White";
    }
    if ( c2 === "White" ){
	return c1;
    }
    if ( c1 === c2 ){
	return c1;
    }
    return colors.c;
}

// draw venn diagram 
function drawVenn( ){
    "use strict";
    cnv.strokeStyle = "Black";
    cnv.beginPath();
    cnv.arc( posCent.C.x, posCent.C.y, rad, 0, 2*Math.PI );
    cnv.stroke();
    cnv.closePath();
    cnv.beginPath();
    cnv.arc( posCent.A.x, posCent.A.y, rad, 0, 2*Math.PI );
    cnv.stroke();
    cnv.closePath();
    cnv.beginPath();
    cnv.arc( posCent.B.x, posCent.B.y, rad, 0, 2*Math.PI );
    cnv.stroke();
    cnv.closePath();
    //cnv.strokeRect( mrgn, mrgn, wdth - 2 * mrgn, hght - 2 * mrgn );
    drawRect();

    cnv.font = 'italic 60px Times';
    cnv.fillStyle = 'Black';
    cnv.fillText( charLab.A, posLab.A.x, posLab.A.y );
    cnv.fillText( charLab.B, posLab.B.x, posLab.B.y );
    cnv.fillText( charLab.C, posLab.C.x, posLab.C.y );
    cnv.fillText( "U", mrgn * 1.1, 0.9 * mrgn );

    drawInkInd();
}

// draw ink indicator 
function drawInkInd( clr ){
    "use strict";
    var rad;
    rad = 8;
    if ( mode === "Shade" ){
	if ( !clr ){
	    clr = curShadeClr;
	}
	cnv.beginPath();
	cnv.arc( wdth - 2 * rad, 2 * rad, 4 * rad, 0, 2 * pi );
	cnv.closePath();
	cnv.fillStyle = "White";
	cnv.fill();
	cnv.beginPath();
	cnv.arc( wdth - rad, rad, rad, 0, 2 * pi );
	cnv.closePath();
	cnv.fillStyle = clr;
	cnv.fill();
    } else {
	cnv.beginPath();
	cnv.arc( wdth - rad, rad, rad, 0, 2 * pi );
	cnv.closePath();
	cnv.fillStyle = "White";
	cnv.fill();
	cnv.fillStyle = "Black";
	cnv.font = 'normal 40px Times';
	cnv.fillText( "#", wdth - 3 * rad, 3 * rad );
    }
}


// set mode flag 
function toggleMode(  ){
    "use strict";
    var old = mode;
    if ( old === "Shade" ){
	mode = "Size";
    } else {
	mode = "Shade";
    }
    setTagOpt( "btMode", "value", old );
    drawInkInd();
}

//make onclick function for given color
function setShadeClrFun( clr ){
    "use strict";
    var clsclr = clr;
    return function(){ 
	curShadeClr = clsclr; 
	drawInkInd();
	if ( mode !== "Shade" ){ toggleMode(); }
    };
}


// reset all sizes to "?"
function resetSizes( ){
    "use strict";
    function whfn( reg, nm ){
	pieces[ nm ].size = "?";
	pieces[ nm ].showSize = false;
    }
    pieces.forEach( whfn );
    reDrawAll();
 }

// check that region is elementary 
function elemQ( reg ){
    "use strict";
    return reg.comprises.length === 1;
}

// push current color.a shading into memStack 
function stackPush( ){
    "use strict";
    var mem;
    mem = [];
    function addReg( reg, nm ){
	if ( elemQ( reg ) && reg.color === colors.a ){
	    mem.push( nm );
	}
    } 
    pieces.forEach( addReg );
    memStack.push( mem );
}

// pop last mem from stack 
function stackPop(  ){
    "use strict";
    var mem;
    mem = memStack.pop();
    function shadeReg( nm ){
	shadeRegion( nm, colors.b );
    }
    mem.forEach( shadeReg );
}

// assemble list of colors.a elements 
function selectedElem( clr ){
    "use strict";
    var res;
    if ( !clr ){
	clr = colors.a;
    }
    res = [];
    function chck( r, n ){
	if ( elemQ( r ) && r.color === clr ){
	    res.push( n );
	}
    }
    pieces.forEach( chck );
    return res;
}

// compute size of selected region 
function sizeSelected( clr ){
    "use strict";
    var lst, sz;
    if ( !clr ){
	clr = colors.a;
    }
    lst = selectedElem( clr );
    sz = detSize( lst );
    if ( sz ){
	return String( sz );
    } else {
	return "?";
    }
}

// handle calculate size from sum button 
function sizeFromSum( ev ){
    "use strict";
    var sel, sz, id;
    sel = selectedElem();
    id = idList( sel );
    if ( id !== "" ){
	sz = sizeSelected();
	pieces[ id ].size = sz;
	pieces[ id ].showSize = true;
	pieces[ id ].printSize();
    }
}

// handle Size From Diff button 
function sizeFromDiff( ev ){
    "use strict";
    var sel1, sel2, sel3, sz1, sz2, sz3, id2;
    sel2 = selectedElem( colors.c );
    sel1 = [ sel2, selectedElem( colors.a ) ].union();
    sel3 = sel1.intersection( complement( sel2 ) );
    sz1 = detSize( sel1 );
    if ( checkIntQ( sz1 ) ){
	sz3 = detSize( sel3 );
	if ( checkIntQ( sz3 ) ){
	    id2 = idList( sel2 );
	    if ( id2 !== "" ){
		sz2 = sz1 - sz3;
		pieces[ id2 ].size = sz2;
		pieces[ id2 ].showSize = true;
		pieces[ id2 ].printSize();
	    }
	}
    }
}


// pack data about A and B 
function packData(  ){
    "use strict";
    var data2, data3, datastr, names;
    data2 = { "A": pieces.A.size,
	     "B": pieces.B.size,
	     "AuB": pieces.AuB.size,
	     "U": pieces.U.size,
	     "AB": pieces.AB.size,
	     "Ab": ( checkIntQ( pieces.AbC.size ) && checkIntQ( pieces.Abc.size ) ) ? parseInt( pieces.AbC.size, 10 ) + parseInt( pieces.Abc.size, 10 ): "?",
	     "aB": ( checkIntQ( pieces.aBC.size ) && checkIntQ( pieces.aBc.size ) ) ? parseInt( pieces.aBC.size, 10 ) + parseInt( pieces.aBc.size, 10 ) : "?"
	   };
    data3 = {};
    names = { "A": charLab.A,
	      "B": charLab.B,
	      "C": charLab.C
	    };
    function fillF( r, n ){
	data3[ n ] = r.size;
    }
    pieces.forEach( fillF );
    datastr = JSON.stringify( [ data2, data3, names ] );
    return escape( datastr );
}

// switch to two circle diagram 
function toTwo( ){
    "use strict";
    window.location = "./vennTwo01.html?" + packData();
}

// fill on values passed from other page 
function fillPassedValues( ){
    "use strict";
    var data, vals2, vals3, datastr, names;
    datastr = unescape( window.location.search.slice( 1 ) );
    if ( datastr === "" ){ return; }
    data = JSON.parse( datastr );
    vals2 = data[0];
    vals3 = data[1];
    names = data[2];
    function fillF( v, n ){
	if ( checkIntQ( v ) ){
	    pieces[ n ].size = v;
	    pieces[ n ].showSize = true;
	}
    }
    function fillNames( v, n ){
	charLab[ n ] = v;
    }
    vals3.forEach( fillF );
    vals2.forEach( fillF );
    names.forEach( fillNames );
}

// init canvas and rest of page
function initPage(  ){
    "use strict";

    cnvelm = document.getElementById( "vd" );
    cnv = cnvelm.getContext( "2d" );

    drawVenn();

    setDiv( "buttons", controlsHTML );
    setDiv( "labels", labelhtml );
    setTagOpt( "labA", "onchange", printVar );
    setTagOpt( "labB", "onchange", printVar );
    setTagOpt( "labC", "onchange", printVar );
    setOnClick( "btClearShading", clearVenn );
    setOnClick( "btClearSizes", resetSizes );
    setOnClick( "bt" +  colors.a, setShadeClrFun( colors.a ) );
    setOnClick( "bt" +  colors.b, setShadeClrFun( colors.b ) );
    setOnClick( "bt" +  colors.c, setShadeClrFun( colors.c ) );
    setOnClick( "btWhite", setShadeClrFun( "White" ) );
    setOnClick( "btUnion", makeOpFun( "union" ) );
    setOnClick( "btInter", makeOpFun( "inter" ) );
    setOnClick( "btComp", makeOpFun( "comp" ) );
    setOnClick( "btMode", toggleMode );
    setOnClick( "btPush", stackPush );
    setOnClick( "btPop", stackPop );
    setOnClick( "btSizeSum", sizeFromSum );
    setOnClick( "btSizeDiff", sizeFromDiff );
    setOnClick( "bt2or3", toTwo );

    cnvelm.addEventListener( 'click', mouseHandler, false );

    fillPassedValues();
    reDrawAll();
}

setTimeout( initPage, 100 );

