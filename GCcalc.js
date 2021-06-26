const dhtoggle = document.getElementById("dhtoggle")
const dftoggle = document.getElementById("dftoggle")
const rbtoggle = document.getElementById("rbtoggle")
const bstoggle = document.getElementById("bstoggle")
const cbttoggle = document.getElementById("cbttoggle")
const emgtoggle = document.getElementById("emgtoggle")
const dfactivetoggle = document.getElementById("dfactivetoggle")
const skruuiatoggle = document.getElementById("skruuiatoggle")
const gpocinput = document.getElementById("gpocinput")
const output = document.getElementById("output")
function calc() {
let dh = dhtoggle.checked;
let df = dftoggle.checked;
let rb = rbtoggle.checked;
let bs = bstoggle.checked;
let cbt = cbttoggle.checked;
let emg = emgtoggle.checked;
let dfactive = dfactivetoggle.checked;
let skruuia = skruuiatoggle.checked;
let gpocstage = gpocinput.value;
let chances = [1,1,cbt?0.03:0,cbt?0.03:0,dfactive?0.005:0.1,bs?0.25:0,0.0005,0.0001,dh?0.1925:(rb?0.01925:0),df?0.1925:(rb?0.01925:0),emg?0.05:0];
let wchances = [1,cbt?0.321:0.3,cbt?0.321:0.3,dfactive?0.005:0.1,bs?0.25:0,0.0005,0.0001,dh?0.05:(rb?0.005:0),df?0.05:(rb?0.005:0),emg?0.05:0,1,1,0.3,0.1]
if(skruuia) wchances.push(1,1,1,1)
console.log(wchances);
let dchances=[];
let dwchances=[];
let basechances=[];
let basewchances=[];
let effectnames = ["<b>frenzy</b>", "<b>lucky</b>", "<b>storm</b>", "<b>chain</b>", "<b>cf</b>", "<b>bs</b>", "<b>sweet</b>", "<b>blab</b>", "<b>dh</b>", "<b>df</b>", "<b>emg</b>", "<b>clot</b>", "<b>ruin</b>", "<b>ef</b>", "<b>cuf</b>", "<b>clot2</b>", "<b>clot3</b>", "<b>ruin2</b>", "<b>ruin3</b>"]
let outputarray = [effectnames];
let header = "<tr><th>Outcome</th>"
let content = ""
for(let p = -1; p<effectnames.length; p++){    
    let output = [0,0,0,0,0,0,0,0,0,0,0]
    if(p<chances.length){
    for(let i=0; i<2**chances.length;i++){
        let pool=[];
        let n=i;
        for(let a=0; a<chances.length;a++){
            n-=(pool[a]=n%2);
            n/=2;
        }
        let chanceforpool=1;   
        let poolcount=0;
        for(let a=0; a<chances.length;a++){
            let chance = chances[a]*((p==a&&p!=7)?0.2:1);
            chanceforpool*=pool[a]?chance:1-chance
            poolcount+=pool[a];
        }
        //console.log(chanceforpool, poolcount, pool)
        for(let a=0; a<chances.length;a++){
            if(pool[a]) output[a]+=chanceforpool/poolcount
        }
    }
    header+="<th> Golden Cookie, Previous: " + effectnames[p] + "</th>"
    output.push(0,0,0,0,0,0,0,0)
    outputarray[outputarray.length]=[...output]
    } else output = [...basechances]
if(p>-1) dchances[p]=output;
else basechances=output
}

for(let p = -1; p<effectnames.length; p++){
    let output = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    if ((p>=1&&wchances[p-1]!=undefined)||p<0){
    for(let i=0; i<2**wchances.length;i++){
        let pool=[];
        let n=i;
        for(let a=0; a<wchances.length;a++){
            n-=(pool[a]=n%2);
            n/=2;
        }
        let chanceforpool=1;   
        let poolcount=0;
        for(let a=0; a<wchances.length;a++){
            let chance = wchances[a]*(p-1==a&&p!=7?0.2:1);
            chanceforpool*=pool[a]?chance:1-chance
            poolcount+=pool[a];
        }
        //console.log(chanceforpool, poolcount, pool)
        for(let a=0; a<wchances.length;a++){
            if(pool[a]) output[a]+=chanceforpool/poolcount
        }
    }
/*for(let a = 7; a>-1; a--){
    output[a]+=output[a+4]
    output[a+4]=undefined;
}*/
header+="<th> Wrath Cookie, Previous: " + effectnames[p] + "</th>"
output.unshift(0);
if(!skruuia) output.push(0,0,0,0)
outputarray[outputarray.length]=[...output];
    } else output = [...basewchances]
if(p>-1) dwchances[p]=output;
else basewchances=output
}
let echances = dchances;
let ebasechances = basechances;
console.log(dchances, basewchances)
for(let i = 0; i < effectnames.length;i++){
    for(let a = 0; a < effectnames.length;a++){
        echances[a][i]=dchances[a][i]*(1-gpocstage/3)+dwchances[a][i]*gpocstage/3
    }
    ebasechances[i]=basechances[i]*(1-gpocstage/3)+basewchances[i]*gpocstage/3
}
console.log(basechances[11]+basewchances[11], basechances[12]+basewchances[12])
for(let loop = 0; loop < 1000; loop++){
let c = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
for(let i = 0; i < effectnames.length;i++){
    for(let a = 0; a < effectnames.length;a++){
        c[i]+=echances[a][i]*ebasechances[a]
    }
}
ebasechances=c;
}
header+="<th>Cumulative chances</th></tr>"
outputarray[outputarray.length]=ebasechances;
for (let i = 0; i < outputarray[0].length; i++) {
    content += "<tr>"
    for (let a = 0; a < outputarray.length; a++) {
        content += "<td>"+ (a>0?Number(outputarray[a][i]).toFixed(7):outputarray[a][i])+"</td>";
    }
    content += "</tr>"
}
output.innerHTML = "<table border = 1px>"+header+content+"</table>";
console.log(outputarray)
}