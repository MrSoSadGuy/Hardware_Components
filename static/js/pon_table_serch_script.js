function serch_pon_table() {
    let ud_tbodies = document.getElementsByClassName('ud_tbody')
    for(let i =0; i<ud_tbodies.length; i++){
        let olt_tbodies = ud_tbodies[i].getElementsByClassName('olt_tbody')
        if(serch_olt_tbodies(olt_tbodies)){
            ud_tbodies[i].removeAttribute("style");
        }
        else{
            ud_tbodies[i].style.display = "none"
        }
    }
}
function serch_olt_tbodies(olt_tbodies){
    var flag = [];
    for(let i =0; i<olt_tbodies.length; i++){
        let shassy = olt_tbodies[i].querySelector('.shassi_row')
        let platy = olt_tbodies[i].querySelector('.plata_tbody')
        let answ = serch_plata_tbodies(platy)
        flag.push(answ)
        if(!answ){
            let cells = shassy.getElementsByTagName('td')
            let answ2 = serch_cell_data(cells)
            // console.log("🚀 ~ serch_olt_tbodies ~ shassy:", shassy)
            flag.push(answ2)
            if(answ2){shassy.removeAttribute("style");}
            else{shassy.style.display = "none"}
            if(!answ2){ olt_tbodies[i].closest('tr').style.display = "none"}
            else {olt_tbodies[i].closest('tr').removeAttribute("style");
            }
        }
        else{
            shassy.removeAttribute("style");
            olt_tbodies[i].closest('tr').removeAttribute("style")}
    }
    // console.log("🚀 ~ serch_olt_tbodies ~ flag:", flag)
    if(flag.indexOf(true) > -1){
        return true
    }
    else{
        return false
    }


}
function serch_plata_tbodies(plata_tbody){

    let rows = plata_tbody.getElementsByTagName('tr')
    var flag = [];
    for(let i =0; i<rows.length; i++){
        let cells = rows[i].getElementsByTagName('td')
        if(serch_cell_data(cells)){
            flag.push(true)
            rows[i].removeAttribute("style");
        }
        else{
            flag.push(false)
            rows[i].style.display = "none";
        }
    }

    if(flag.indexOf(true) > -1){
        plata_tbody.removeAttribute("style");
        return true
    }
    else{
        plata_tbody.style.display = "none"
        return false
    }
}
function serch_cell_data(tds){
    document.getElementById('flexSwitchCheckChecked').checked = false;
    var rb1 = document.getElementById("inlineRadio1").checked
    var rb2 = document.getElementById("inlineRadio2").checked
    var input, filter;
    input = document.getElementById("serch_pon_table");
    filter = input.value.toUpperCase();
    const list_of_words= filter.split(" ")

    var flag = [];
    list_of_words.forEach(word =>{
        for(var j = 0; j < tds.length; j++){
            var td = tds[j];
            if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                flag.push(true);
                return;
            }
        }})
    return flag.length >= list_of_words.length;
}