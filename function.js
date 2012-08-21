var epsilon = 10E-6;
var sometemp=0;
function sameSign (pt1,pt2,l1,l2) {
    function value(v) {
        if (l1.x==l2.x) {
            return (v.x-l1.x);
        }
        else {
            tt=(l1.y-l2.y)/(l1.x-l2.x);
            return v.y-v.x*tt-l1.y+l1.x*tt;
        }
    }
    if (value(pt1)*value(pt2) < 0) {
        return false;
    }
    else return true;
}    


function eqnLine(pt1,pt2) {
    impactLine=new Vector(0,0);
 //   ck ( " x ", pt1.x, ", ", pt2.x );
    if(pt1.x-pt2.x==0)    
    {
        impactLine.x=1/pt1.x,
        impactLine.y=0;
    }
    else {
        var m=(pt2.y-pt1.y)/(pt2.x-pt1.x);
        var k=pt1.y-m*pt1.x;
        impactLine.x=-m/k;
        impactLine.y=1/k;
    }
    return impactLine;
}

function eqnLinePtM(pt,m) {
    
    if(m!=Infinity && m!=-Infinity) {
  //      ck ( pt.x, " , ", pt.y, " , ", m );
  //      ck ( " m wasn't infinity ",  ( -1 * m ) / (pt.y - ( m * pt.x) ), 1 / ( pt.y - (m * pt.x) )  );
        return new Vector( -m / (pt.y - ( m * pt.x) ), 1 / ( pt.y - (m * pt.x) ) );
    }
    
    return new Vector(1/pt.x,0);
}

function ptIntersectionLines(l1,l2) {
    var a1=l1.x;
    var b1=l1.y;
    var a2=l2.x;
    var b2=l2.y;
    if(a1*b2-b1*a2==0) {return "np";}
    var x1= (b2-b1)/(a1*b2-b1*a2);
    var y1= (a1-a2)/(a1*b2-b1*a2);
    return new Vector(x1,y1);
}

function isCorrect(a,c,b) {
    var x=(a.x-b.x)*(b.x-c.x);
    if (x>0) {
        return true;
    }
    else return false;
}

function findDist(a,b) {
    return Math.sqrt(Math.pow(a.x-b.x,2) + ((a.y-b.y)*(a.y-b.y))) ; 
}
/*
function collision(b1,b2) {
	var intersection;
	var edgeVect;
	var arr= new Array(b1, b2);
	var points;
	ptCollision=new Vector(0,0);
	vect=new Vector();
	for(var i=0;i<arr.length;i++) {
		var vert1=blocks[i].getVertices();
		var blockpoint=new Array();
		for(var k=0;k<4;k++) {
			var vV=getVelocity(vert1[k],i);
			rect=blocks[arr[(i+1)%2]];
			result=surfaceCollision(vert1[k],vV,rect,vect,ptCollision);
			if(result==true) {		
				a=new Vector();		
				blockpoint.push(a.push(newVec(ptCollision),newVec(rect)));
            }
        }
		if(blockpoint.length==2) {
			intersection=multC(add_v(blockpoint[0][0],blockpoint[1][0]),0.5);
			edgeVect=blockpoint[0][1];
        }
		else points.push(blockpoint[0]);
	}
	if(intersection == undefined) {
		intersection=new Vector(0,0);
//		intersection
		for(var i=0;i<points.length;i++) {
			intersection=add_v(intersection,points[i][1]);
        }
		intersection=multC(intersection,1/points.length);
		edgeVect=newVec(points[0][1]);
	}
	
}*/


function surfaceCollision(vertex,i,rect,j,impactVec,ptCollision) {
		var points=new Array();	
		vert=rect.getVertices();
		var vV=getVelocity(vertex,i);
		var temp,line,intersect,jVel,relVel,edge;
		
		relVel=sub_v(vV,rect.v);
    for(var t=0;t<4;t++) {
    	var intersectflag=true;
    	edge=eqnLine(vert[t],vert[(t+1)%4]);
    	for(var rec=0;rec<20;rec++) {
   		 line=eqnLinePtM(vertex,relVel.y/relVel.x);
       intersect=ptIntersectionLines(line,edge);
       if (intersect == "np") {
       		intersectflag=false;  break;  
       }
       jVel=getVelocity(intersect,j)
       relVel=sub_v(vV,jVel);
      }
      if(intersectflag==false) {
      	continue;
      }
	    var v1=sub_v(intersect,vertex);
    	   var v2=dotProduct(v1,relVel);
    	
         if (v2>0) {
		       		 var a= new Array();
               tresult=isCorrect(vert[t],vert[(t+1)%4],intersect);
               if(tresult == true) {
               a.push(t);
               a.push(intersect);
               a.push(relVel.getMod());
               points.push(a); }
    	 }
    }
    if(points.length == 0) {return false;}
    var index=0;
    var tim=findDist(points[0][1],vertex)/points[0][2]; 
    var timepass=points[0][2];   
    //ck(findDist(points[0][1],vertex),points[0][2]);        
    for(var jf=0;jf<points.length;jf++) {
    	var a=findDist(vertex,points[jf][1])/points[jf][2];
    	
    	//ck(a);
    	if(a<tim) {
                tim=a;
                index=jf;
                timepass=points[jf][2];       
        }
        }
       
    
		    	if(get_write()==1684 && i==2 && j==1 && vertex.x<=250 && vertex.y>=400) {
       			if(sometemp==0) sometemp++;
       			else {
							//ck("okay... checking is indeed being done..next slide");
							vertchecker();
							ck(tim);
							
							//ck(result);
							//ck(vert[k]);
						}
					}
    if(tim>dt) return false;

			var iff=points[index][0];
			var sub=sub_v(vert[iff],vert[(iff+1)%4]);
      imp=perp_v(sub);
      assign(ptCollision,points[index][1]);
      assign(impactVec,imp);
			if(get_write2()>=230) {ck("inside surface collision ",timepass) ;}
            //ck(ptCollision,impactLine);
            	//ck(getVelocity(new Vector(305.80,479.99),0));
            	//ck(vertex,intersect);
            	
 //   ck(vect.x, vect.y);   
 	//	ck(tim); 
 					//ck(vertex,i,j);
        return true;
    }










/* var epsilon = 10E-8;
                
function sameSign (pt1,pt2,l1,l2) {
    function value(v) {
        if (l1.x==l2.x) {
            return (v.x-l1.x);
        }
        else {
            tt=(l1.y-l2.y)/(l1.x-l2.x);
            return v.y-v.x*tt-l1.y+l1.x*tt;
        }
    }
    if (value(pt1)*value(pt2) < 0) {
        return false;
    }
    else return true;
}    


function eqnLine(pt1,pt2) {
    vect=new Vector(0,0);
    if(pt1.x-pt2.x==0)    
    {
        vect.x=1/pt1.x,
        vect.y=0;
    }
    else {
        var m=(pt2.y-pt1.y)/(pt2.x-pt1.x);
        var k=pt1.y-m*pt1.x;
        vect.x=-m/k;
        vect.y=1/k;
    }
    return vect;1
}

function eqnLinePtM(pt,m) {
    if(m!=Infinity) {
        return new Vector(-m/(pt.y-m*pt.x),1/(pt.y-m*pt.x));
    }
    else return new Vector(1/pt.x,0);
}

function ptIntersectionLines(l1,l2) {
    var a1=l1.x;
    var b1=l1.y;
    var a2=l2.x;
    var b2=l2.y;
    if(a1*b2-b1*a2==0) return "np";
    var x1= (b2-b1)/(a1*b2-b1*a2);
    var y1= (a1-a2)/(a1*b2-b1*a2);
    return new Vector(x1,y1);
}

function isCorrect(a,c,b) {
    var x=(a.x-b.x)*(b.x-c.x);
    if (x>0) {
        return true;
    }
    else return false;
}

function findDist(a,b) {
    return Math.sqrt(Math.pow(a.x-b.x,2) + ((a.y-b.y)*(a.y-b.y))) ; 
}

*/
function printArray ( ar )
{
    var str = " ";
    for ( var index = 0; index < ar.length; ++index )
    {
        str = str + " " + ar[index];
    }
    
    ck(str);
    
}

/*
function surfaceCollision(vertex,vV,rect,vect,ptCollision) {
    vV.multiply(-dt);
    var line=eqnLinePtM(vertex,vV.y/vV.x);
    vert=rect.getVertices();
    var points=new Array();
    var surface=new Array();
    for(var i=0;i<4;i++) {
  //      ck(" ( ", vert[i].x, ", ", vert[i].y, " ) for the vertex ", i );
       var edge=eqnLine(vert[i],vert[(i+1)%4]);
       var intersect=ptIntersectionLines(line,edge);
        if (intersect != "np") {
            
            result=isCorrect(vert[i],vert[(i+1)%4],intersect);
            if(result == true) {
                var a= new Array();
                a.push(i);
                a.push(intersect);
                points.push(a);
                
            }
        }
    }
    if(points.length > 0) {
        var i=points[0][0]; 
        var dist=findDist(points[0][1],vertex);            
        for(j=0;j<points.length;j++) {
            var a=findDist(vertex,points[j][1]);
            if(a<dist) {
                dist=a;
                i=points[j][0];
            }
        }
        if(dist > vV.getMod()) {
      //      ck("1");
            return false;}
        else {
   //         ck( " collide at point (", intersect.x, ", ",  intersect.y, " )" );   
            edge=eqnLine(vert[i],vert[(i+1)%4]),
            intersect=ptIntersectionLines(line,edge);
            assign(ptCollision,intersect);
            assign(vect,perpLine(edge));
            return true;
        }
    }
    else {
 //       ck(2); 
        return false;}
}

 */

function assign(v1,v2) {
    v1.x=v2.x; v1.y=v2.y;
}
function perpLine(v1) {
    return new Vector(-v1.y,v1.x);}


function duplicateArray( Source )
{
    var copy = new Array();
    
    for ( var index = 0; index < Source.length ; ++ index )
    {
        copy.push(Source[index]);
    }
    
/*    ck(" source ");
    printArray(Source);
    ck(" target " )
    printArray(copy);
*/    
    return copy;
}

function switchRows(solMat, rx)
{
    for ( var _rx = rx + 1; _rx < solMat.length; ++ _rx)
    {
        if ( Math.abs( solMat[_rx][rx] ) > 0 )
        {
  //            ck(" with " + _rx);
  //          printArray(solMat[_rx]);
            
            var tmpArray = duplicateArray(solMat[rx]);
            solMat[rx] = duplicateArray(solMat[_rx]);
            solMat[_rx] = duplicateArray(tmpArray);
            
            return;
        }
    }
    
    alert ( " Matrix is Singular" );
    
}
function createnew(mat,del) {
	var a=new Array();
	for(var i=0;i<mat.length;i++) {
		if(mat[i]!=del) a.push(mat[i]);
	}
	return a;
}
function finddet(solmat,arrayrow,j,N,from,to) {
	var x=(j==from?to:j);
	if(N==1) {
		return solmat[arrayrow[0]][x];
	}
	var index=0; var det=0; var temp;
	for(var i=0;i<arrayrow.length;i++) {
		temp=solmat[arrayrow[i]][x];
		if(temp==0) ;
		else 
		det+= Math.pow(-1,index)*solmat[arrayrow[i]][x]*finddet(solmat,createnew(arrayrow,arrayrow[i]),j+1,N-1,from,to);
		index++;
	}
	return det;
}
function solveMatrix(solMat, solution ) {
    var arr=new Array(0,1,2,3,4,5);
    var t1=((new Date()).getTime());
    var det=finddet(solMat,arr,0,6,6,6);
    for(var i=0;i<6;i++) {
    	solution.push(finddet(solMat,arr,0,6,i,6)/det);
    }
    t1=(new Date()).getTime()-t1;
    //alert(t1);
}
    
    /*if(get_write() == 4) {
    	for(var hahai=0;hahai<solMat.length;hahai++) {
    		//printArray(solMat[hahai]);
    		} }*/
    /*for ( var checkx = 0; checkx < solMat.length; ++ checkx )
    {
        if (solMat[checkx].length != solMat.length + 1)
        {
            alert ( " The Matrix isn't square " );
            return;
        }
        else
        {
    //        ck( " row ", checkx, " of solMat has ", solMat[checkx].length, " elements " );
        }
    }
    
    for ( var rx = 0; rx < solMat.length; ++ rx )
    {
        if ( Math.abs( solMat[rx][rx] ) < 10E-8  )
        {
        
        		solMat[rx][rx] = 0;
  //          ck( " switching row ", rx );
  //          printArray(solMat[rx]);
            switchRows(solMat, rx);
  //          ck( " after switch " );
  //          printArray(solMat[rx]);
        }
        //if(rx==4) {printArray(solMat[4]);}
            for ( var _rx = 0; _rx < solMat.length; ++ _rx )
            {
        //        ck( " row ", _rx );
        //        
                
                    
                    if (_rx != rx )
                    {    var mFactor = solMat[_rx][rx] / solMat[rx][rx];
                    		
                        for ( var _cx = 0; _cx < solMat.length + 1; _cx++ )
                        {
                            
                            solMat[_rx][_cx] = solMat[_rx][_cx] - (solMat[rx][_cx] * mFactor);
                        }
                        solMat[_rx][rx]=0;
                        //if(rx==4 && _rx==0) {ck(mFactor); }
                       
                    }
                    
            }
            var s="";
            for(var fori=0;fori<solMat.length;fori++) {
            	s=s+solMat[fori][rx]+" ";}
            //s+="</br>"+solMat[rx][solMat.length];
            
            //ck(s);
        
    }
    //ck(solMat[0][0]);
    solution = new Array();
    for (var rowElem = 0; rowElem < solMat.length; ++rowElem )
    {	//printArray(solMat[rowElem]);
        // the element solMat[rowElem][rowElem] cannot be zero the singularity of the metrix has been handled beforehand
        solution.push( (solMat[rowElem][solMat.length])/solMat[rowElem][rowElem] );
        
    }*/
  
  
 //   printArray(solution);

