document.getElementById("btns-menu").addEventListener("click", mostrar_menu);
 
document.getElementById("back_menu").addEventListener("click", ocultar_menu);

nav = document.getElementById("navbar");
backgroun_menu = document.getElementById("back_menu");

function mostrar_menu(){
    nav.style.right = "0px";
    backgroun_menu.style.display = "block";

}
function ocultar_menu(){
    nav.style.right = "-250px";
    backgroun_menu.style.display = "none";
    
}

//--------------------------------------------

