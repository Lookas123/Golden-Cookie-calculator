const dhtoggle = document.getElementById("dhtoggle")
const dftoggle = document.getElementById("dftoggle")
const rbtoggle = document.getElementById("rbtoggle")
const bstoggle = document.getElementById("bstoggle")
const cbttoggle = document.getElementById("cbttoggle")
const swettoggle = document.getElementById("swettoggle")
const emgtoggle = document.getElementById("emgtoggle")
const dfactivetoggle = document.getElementById("dfactivetoggle")
const skruuiatoggle = document.getElementById("skruuiatoggle")
const stormtoggle = document.getElementById("stormtoggle")
const chaintoggle = document.getElementById("chaintoggle")
const gpocinput = document.getElementById("gpocinput")
const altcumtoggle = document.getElementById("altcumtoggle")
const output = document.getElementById("output")

function calc() {
    const dh = dhtoggle.checked;
    const df = dftoggle.checked;
    const rb = rbtoggle.checked;
    const bs = bstoggle.checked;
    const cbt = cbttoggle.checked;
    const swet = swettoggle.checked;
    const emg = emgtoggle.checked;
    const dfactive = dfactivetoggle.checked;
    const skruuia = skruuiatoggle.checked;
    const storm = stormtoggle.checked;
    const chain = chaintoggle.checked;
    const gpocstage = gpocinput.value;
    const altcum = altcumtoggle.checked;

    function GCodds(StoCha, DfDh) {
        let odds = [1,1,0,0,dfactive?0.005:0.1,bs?0.25:0,swet?0.0005:0,0.0001,0,0,emg?0.05:0];
        if(StoCha&&cbt){
            odds[2]=1;
            odds[3]=chain;
        }
        if(DfDh){
            odds[8]=dh?1:(rb?0.1:0);
            odds[9]=df?1:(rb?0.1:0);
        }
        return odds;
    } 
    function WCodds(EfStoCha, StoCha, DfDh){
        let odds = [1,0,0,dfactive?0.005:0.1,bs?0.25:0,swet?0.0005:0,0.0001,0,0,emg?0.05:0,1,1,0,0.1];
        if(EfStoCha){
            odds[1]=1;
            odds[2]=chain;
            odds[12]=1;
        }
        if(StoCha&&cbt){
            odds[1]=1;
            odds[2]=chain;
        }
        if(DfDh){
            odds[7]=dh?1:(rb?0.1:0);
            odds[8]=df?1:(rb?0.1:0);
        }
        return odds;
    }



    const chances = [{c:GCodds(false,false),p:0.783275}, {c:GCodds(true,false),p:0.024225},{c:GCodds(false,true),p:0.186725},{c:GCodds(true,true),p:0.005775}];
    const wchances = [{c:WCodds(false,false,false),p:0.64505},{c:WCodds(true,false,false),p:0.285}, {c:WCodds(false,true,false),p:0.01995},{c:WCodds(false,false,true),p:0.03395},{c:WCodds(true,false,true),p:0.015}, {c:WCodds(false,true,true),p:0.00105}]




    console.log(wchances);
    let dchances=[];
    let dwchances=[];
    let basechances=[];
    let basewchances=[];
    const effectnames = ["<b>frenzy</b>", "<b>lucky</b>", "<b>storm</b>", "<b>chain</b>", "<b>cf</b>", "<b>bs</b>", "<b>sweet</b>", "<b>blab</b>", "<b>dh</b>", "<b>df</b>", "<b>emg</b>", "<b>clot</b>", "<b>ruin</b>", "<b>ef</b>", "<b>cuf</b>"]
    let outputarray = [effectnames];
    let header = "<tr><th>Outcome</th>"
    let content = ""
    // GC probabilities
    for(let p = -1; p<effectnames.length; p++){    
        let output = [0,0,0,0,0,0,0,0,0,0,0]
        if(p<chances[0].c.length){
            for (let index = 0; index < chances.length; index++) {
                for(let i=0; i<2**chances[index].c.length;i++){
                    let pool=[];
                    let n=i;
                    for(let a=0; a<chances[index].c.length;a++){
                        n-=(pool[a]=n%2);
                        n/=2;
                    }
                    let chanceforpool=chances[index].p;   
                    let poolcount=0;
                    for(let a=0; a<chances[index].c.length;a++){
                        let chance = chances[index].c[a]*((p==a&&p!=7)?0.2:1);
                        chanceforpool*=pool[a]?chance:1-chance
                        poolcount+=pool[a];
                    }
                    //console.log(chanceforpool, poolcount, pool)
                    for(let a=0; a<chances[index].c.length;a++){
                        if(pool[a]) output[a]+=chanceforpool/poolcount
                    }
                }
            }
            header+="<th> Golden Cookie, Previous: " + effectnames[p] + "</th>"
            output.push(0,0,0,0)
            outputarray.push([...output])
        } else output = [...basechances]
        if(p>-1) dchances[p]=output;
        else basechances=output
    }

    //WC probabilities
    for(let p = -1; p<effectnames.length; p++){
        let output = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        if ((p>=1&&wchances[0].c[p-1]!=undefined)||p<0){
            for (let index = 0; index < wchances.length; index++) {
                for(let i=0; i<2**wchances[index].c.length;i++){
                    let pool=[];
                    let n=i;
                    for(let a=0; a<wchances[index].c.length;a++){
                        n-=(pool[a]=n%2);
                        n/=2;
                    }
                    if(skruuia)pool.push(1,1,1,1)
                    let chanceforpool=wchances[index].p;   
                    let poolcount=skruuia*4;
                    for(let a=0; a<wchances[index].c.length;a++){
                        let chance = wchances[index].c[a]*((p-1==a&&p!=7)?0.2:1);
                        chanceforpool*=pool[a]?chance:1-chance
                        poolcount+=pool[a];
                    }
                    //console.log(chanceforpool, poolcount, pool)
                    for(let a=0; a<wchances[index].c.length;a++){
                        if(pool[a]) output[a]+=chanceforpool/poolcount
                        if((a==11||a==10)&&skruuia) output[a]+=2*chanceforpool/poolcount
                    }
                }
            }
            header+="<th> Wrath Cookie, Previous: " + effectnames[p] + "</th>"
            output.unshift(0);
            outputarray.push([...output]);
        } else output = [...basewchances]
        if(p>-1) dwchances[p]=output;
        else basewchances=output
    }
    console.log(altcum);
    if(!altcum){
        //Normal cumulative chance calculation based on random gc/wc distribution

        //Factor in gpoc stage into all the chances 
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
        //Generate Cumulative chances by just looping over the matrix 1000 times because i'm lazy
        let cumchances = [...ebasechances]
        for(let loop = 0; loop < 1000; loop++){
            let c = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            for(let i = 0; i < effectnames.length;i++){
                for(let a = 0; a < effectnames.length;a++){
                    if(!storm||a!==2){ 
                        c[i]+=echances[a][i]*cumchances[a]
                    }else{
                        c[i]+=ebasechances[i]*cumchances[a]
                    }
                }
            }
            cumchances=c;
        }
        header+="<th>Cumulative chances</th>";
        outputarray.push(cumchances);
    }else{
        //Alternating gc/wc cumulative chance calculation
        let cumgchances = [...basechances]
        let cumwchances = [...basewchances]
        for(let loop = 0; loop < 1000; loop++){
            let c = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            for(let i = 0; i < effectnames.length;i++){
                for(let a = 0; a < effectnames.length;a++){
                    if(!storm||a!==2){ 
                        c[i]+=dchances[a][i]*cumwchances[a]
                    }else{
                        c[i]+=basechances[i]*cumwchances[a]
                    }
                }
            }
            let cw = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            for(let i = 0; i < effectnames.length;i++){
                for(let a = 0; a < effectnames.length;a++){
                    if(!storm||a!==2){ 
                        cw[i]+=dwchances[a][i]*c[a]
                    }else{
                        cw[i]+=basewchances[i]*c[a]
                    }
                }
            }
            cumgchances=c;
            cumwchances=cw;
        }
        
        header+="<th>Cumulative GC</th><th>Cumulative WC</th>";
        outputarray.push(cumgchances);
        outputarray.push(cumwchances);
    }

    //Write Table
    header+="<th>Outcome</th></tr>"
    outputarray[outputarray.length]=(effectnames)
    for (let i = 0; i < outputarray[0].length; i++) {
        content += "<tr>"
        for (let a = 0; a < outputarray.length; a++) {
            content += "<td>"+ (a>0&&a<outputarray.length-1?Number(outputarray[a][i]).toFixed(7):outputarray[a][i])+"</td>";
        }
        content += "</tr>"
    }
    output.innerHTML = "<table border = 1px>"+header+content+"</table>";
    console.log(outputarray)
}