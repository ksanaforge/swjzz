/*
read swjz_predragon.xml
extract pb
insert into new xml from chipan
*/

var fs=require('fs');
var arr=fs.readFileSync('swjz_predragon.xml','utf8').split('\r\n');
var folder='../xml/';
var lst=fs.readFileSync(folder+'swjzz.lst','utf8').split('\r\n');

console.log('extract pb from swjz_predragon')
var pbtag=/(..)<pb n="(.*?)"\/>(...)/;
var pb=[];
var totalcount=0,possiblecount=0,insertcount=0;
for (var i in arr) {
	var m=arr[i].match(pbtag);
	if (m) {
		totalcount++;
		var str=m[1]+m[3];
		var length=str.length;
		var off=2; 
		while (str[0]==0xFFFD || str[0]<0xff) {
			str=str.substring(1);
			off++;
		}
		if (off+1<length) {
			//str=str.replace('?','.')
			//str=str.replace('。','.')
			//str=str.replace('、','.')
			//str=str.replace('，','.')
			pb.push({pb:m[2], str:str, off:off})
			possiblecount++;
		}

		
	}
}

console.log('loading content')
var content=[];
for ( var i in lst) {
	var fn=lst[i];
	var arr=fs.readFileSync(folder+fn,'utf8').split('\r\n');
	content.push(arr);
}
console.log('total length',content.length)



var unique=function(tofind) {
	var match=false;

	var lasti=-1,lastj=-1,lastm=0;
	for (var i=0;i<content.length;i++) {
		for (var j=0;j<content[i].length;j++) {
			var m=content[i][j].indexOf(tofind);
			if (m>-1) {
				if (match) {
					return false; //more than one
				}
				match=true;
				lasti=i;
				lastj=j;
				lastm=m;
			}
		}
	}
	if (match) return {file:lasti,line:lastj,pos:lastm};
	else return false;
}
var find=function(tofind) {
	for (var i=lastfile;i<lst.length;i++) {
	
	}
}
var misspb=[];
console.log('insert pb');
for (var i in pb) {
	var u=unique(pb[i].str);
	if (u) {
		//console.log('pb',pb[i].pb);
		console.log(u);
		var s=content[u.file][u.line];
		var off=u.pos+pb[i].off; //insert here
		content[u.file][u.line]=s.substring(0,off)+'<pb n="'+pb[i].pb+'"/>'
		+s.substring(off);

		insertcount++;
	} else {
		misspb.push(pb[i]);
	}
}

for (var i in lst) {
	fs.writeFileSync(folder+lst[i],content[i].join('\r\n'),'utf8');
}
fs.writeFileSync('misspb.txt',JSON.stringify(misspb,'',' '),'utf8');
console.log('total',totalcount,' possible',possiblecount,'insert',insertcount);