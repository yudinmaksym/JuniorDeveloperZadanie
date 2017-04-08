function readTextFile(tableid)
{
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange =function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {

            //read data spliting by ','
            var alltext = httpRequest.responseText; 
            var start_pos = alltext.indexOf(':') + 1;
            var end_pos = alltext.indexOf(';',start_pos);
            var books = alltext.substring(start_pos,end_pos)
            var splitwords;
            books = books.split(",");
            books.sort();
            
            //read nosniki from data           
            var start_pos = alltext.indexOf('Nosniki:') + 8;
            var end_pos = alltext.indexOf(';',start_pos);
            var nosniki = alltext.substring(start_pos,end_pos)
            nosniki = nosniki.split(",");
            
            
            //initialization html table elements
            var maintable = document.getElementById(tableid);
            var tbody = document.createElement('tbody');            
            tbody.id = "maintabletbody";
            maintable.removeChild(maintable.lastChild);
                
            //Binding options in form from database
            var select = document.getElementById('nosnikid');
            while (select.hasChildNodes()) {
            select.removeChild(select.lastChild);
            }
            var option = document.createElement('option');
            option.innerHTML="--Wybierz--";
            option.value="";
            select.appendChild(option);
            for(j = 0;j<nosniki.length;j++)
            {
                var option = document.createElement('option');
                option.innerHTML = nosniki[j];
                option.value=j;
                select.appendChild(option);
            }
            
            
               for(var i=0; i<books.length; i++)
                {
                    if(i!=books.length)
                    {

                        splitwords = books[i].split('\t');
                        var j=0;

                        var date = Date.now();
                        var daymonthyear = splitwords[j+1].split('.');
                        var bookday = new Date(parseInt(daymonthyear[2])+"/"+ parseInt(daymonthyear[1])+"/"+parseInt(daymonthyear[0]));
                        var diffDays = parseInt((date - bookday) / (1000 * 60 * 60 * 24)); 

            
                        //Creating table with binding data
                    if(tableid == "Wszystkie" || tableid == splitwords[j+5])
                        {
                            bindingData(books,splitwords,tableid,tbody,maintable);
                        }
                    if(tableid == "Nowosci" && diffDays < 14 && diffDays > 0)
                        {
                            bindingData(books,splitwords,tableid,tbody,maintable);
                        }
                    if(tableid == "Zapowedni" && diffDays > -14 && diffDays < 0)
                        {
                            bindingData(books,splitwords,tableid,tbody,maintable);
                        }
                    if(tableid == "Superokazja" && tableid == splitwords[j+6])
                        {
                            bindingData(books,splitwords,tableid,tbody,maintable);
                        }
            
                    }
                }
        
        }
    }
    httpRequest.open("GET", "/book.txt", true);
    httpRequest.send(null);
    
    

}   


function bindingData(books,splitwords,tableid,tbody,maintable)
{
    
                    var j=0;
                    
                    var date = Date.now();
                    var daymonthyear = splitwords[j+1].split('.');
                    var bookday = new Date(parseInt(daymonthyear[2])+"/"+ parseInt(daymonthyear[1])+"/"+parseInt(daymonthyear[0]));
                    var diffDays = parseInt((date - bookday) / (1000 * 60 * 60 * 24)); 


    
                            var nazwa = document.createElement('td');
                            var data = document.createElement('td');
                            var cena = document.createElement('td');
                            var author = document.createElement('td');
                            var wydawn = document.createElement('td');
                            var dokosztd = document.createElement('td');
                            var dokosz = document.createElement('button');
                                dokosz.setAttribute("type","button");
                                dokosz.setAttribute("class","dokoszyka");
                                dokosz.setAttribute("data-toggle","modal");
                                dokosz.setAttribute("onclick","getBookName(this.parentNode.parentNode.firstChild.innerHTML)");
                                dokosz.setAttribute("data-target","#koszykModal");
                                dokosz.innerHTML="do koszyka";


                                dokosztd.appendChild(dokosz);



                                nazwa.innerHTML = splitwords[j];
                                data.innerHTML = splitwords[j+1];
                                cena.innerHTML = splitwords[j+2];
                                author.innerHTML = splitwords[j+3];
                                wydawn.innerHTML = splitwords[j+4];

                                var tr = document.createElement('tr');
                                tr.appendChild(nazwa);
                                tr.appendChild(data);
                                tr.appendChild(cena);
                                tr.appendChild(author);
                                tr.appendChild(wydawn);
                                tr.appendChild(dokosztd);
                                tbody.appendChild(tr);
                                maintable.appendChild(tbody);

                
}

//function for reset form information
function MyFormReset(){
    document.getElementById('MyForm').reset();
}
//function for get book name to form
function getBookName(parentTr){
    document.getElementById('towarid').value = parentTr;
}
//function to add item when click OK
function addItemToList(val){
    var modallist = document.getElementById('modal-list');

    var p_titel = document.getElementById('p_tytul').innerHTML;
    var p_nosnik = document.getElementById('p_nosnik').innerHTML;
    var p_ilosc = document.getElementById('p_ilosc').innerHTML;
    
    var towarid = document.getElementById('towarid').value;
    var nosnikid = document.getElementById('nosnikid');
    var nosnikidtext= nosnikid.options[nosnikid.selectedIndex].text;
    var input_ilosc = document.getElementById('ilosc').value;
    
    
    
    var item_ul_li = document.createElement('p');
    var typksiazki = $('.nav-tabs .active').text();
    if(typksiazki == "Wszystkie")
    {
        item_ul_li.innerHTML = p_titel +  towarid +"," + " " + p_nosnik + nosnikidtext + "," + " " + p_ilosc +  input_ilosc;
        modallist.appendChild(item_ul_li);
    }
    else
    {
        item_ul_li.innerHTML = p_titel +  towarid +"," + " " + p_nosnik + nosnikidtext + "," + " " + p_ilosc +  input_ilosc + "," + "Typ ksiazki:" + typksiazki;
        modallist.appendChild(item_ul_li);
    }
    
    
    var qty = document.getElementById('inputilosc').innerHTML;
    var new_qty = parseInt(qty,10) + parseInt(val,10);
    document.getElementById('inputilosc').innerHTML = new_qty;
    return new_qty;

}



function mySearch() {
      var input, filter, table, tr, td,td2, i;
      input = document.getElementById("srch-term");
      filter = input.value.toUpperCase();
      var typksiazki = $('.nav-tabs .active').text();
      table = document.getElementById(typksiazki);
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[3];
        if (td || td2) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }         
      
  }
    
    
//    for (i = 0; i < tr.length; i++) {
//    td2 = tr[i].getElementsByTagName("td")[3];
//    if (td2) {
//      if (td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
//        tr[i].style.display = "";
//      } else {
//        tr[i].style.display = "none";
//      }
//    }   
//      
//      
//  }
    
}

