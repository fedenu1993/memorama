
////-------------------------------------------
// RANKING

var nombreLocalStorage = "";
let errores = 0;

let arrayUsuarios = [];

const crearUsuario = (nombre,errores,tiempo) => {

    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString();

    usuario = {
        nombre: nombre,
        errores: errores,
        tiempo: tiempo,
        fecha: fechaFormateada
    }
    if(arrayUsuarios === null){
        arrayUsuarios = [];
        arrayUsuarios.push(usuario);
    }else{
        arrayUsuarios.push(usuario);
    }

    return usuario;

}

const guardarDB = () => {
    localStorage.setItem("usuario",JSON.stringify(arrayUsuarios));
}


const cargarTablaDB = () => {
    arrayUsuarios = JSON.parse(localStorage.getItem("usuario"));
    tabla = document.querySelector("#tabla-info");
    if(tabla){
        tabla.innerHTML = "";
        if(arrayUsuarios === null){
            arrayUsuarios = [];
            console.log("nulo");
        }else{
            arrayUsuarios.sort((a,b)=>a.errores-b.errores);
            arrayUsuarios.sort(function (a, b) {
                if(a.errores == b.errores){
                    if (a.tiempo > b.tiempo) {
                      return 1;
                    }
                    if (a.tiempo < b.tiempo) {
                      return -1;
                    }
                    return 0;
                }
              });
            arrayUsuarios.forEach(element => {
                tabla.innerHTML+=
                `<tr>
                <td scope="row">${element.nombre}</td>
                <td>${element.errores}</td>
                <td>${element.tiempo}</td>
                <td>${element.fecha}</td>
                </tr>`; 
            })
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarTablaDB);

//TARJETAS

let iconos = [];
let selecciones = [];
let aciertos = 0;

generarTablero();
function cargarIconos(){
    
    iconos = [
        '<i class="fab fa-facebook-square"></i>',
        '<i class="fab fa-whatsapp-square"></i>',
        '<i class="fab fa-instagram-square"></i>',
        '<i class="fab fa-linkedin"></i>',
        '<i class="fab fa-pinterest-square"></i>',
        '<i class="fab fa-twitter-square"></i>',
        '<i class="fab fa-google-plus-square"></i>',
        '<i class="fab fa-youtube-square"></i>',
        '<i class="fab fa-tumblr-square"></i>',
        '<i class="fab fa-snapchat-square"></i>',
        '<i class="fab fa-reddit-square"></i>',
        '<i class="fab fa-flickr"></i>',
    ]
}


function generarTablero(){
    cargarIconos();
    selecciones = [];
    let tablero = document.getElementById("tablero");
    let tarjetas = [];
    for(let i = 0; i < 24; i++){
        tarjetas.push(`
            <div class="area-tarjeta" onclick="seleccionarTarjeta(${i})">
                <div class="tarjeta" id="tarjeta${i}">
                    <div class="cara superior">
                        <i class="far fa-question-circle"></i>
                    </div>
                    <div class="cara trasera" id="trasera${i}">
                        ${iconos[0]}
                    </div>
                </div>
            </div>`
        )
        if(i%2==1){
            iconos.splice(0,1);
        }
    }
    // Desordenar las tarjetas
    tarjetas.sort(()=>Math.random()-0.5);
    if(tablero){
        tablero.innerHTML = tarjetas.join("");
    }
}



function seleccionarTarjeta(i){
    let tarjeta = document.getElementById("tarjeta"+i);
    if(tarjeta.style.transform != "rotateY(180deg)"){
        tarjeta.style.transform = "rotateY(180deg)";
        selecciones.push(i);
    }
    if(selecciones.length == 2){
        deseleccionar(selecciones);
        selecciones = [];   
    }
}


function deseleccionar(selecciones) {
    setTimeout(() => {
        let trasera1 = document.getElementById("trasera" + selecciones[0])
        let trasera2 = document.getElementById("trasera" + selecciones[1])
        if (trasera1.innerHTML != trasera2.innerHTML) {
            let tarjeta1 = document.getElementById("tarjeta" + selecciones[0])
            let tarjeta2 = document.getElementById("tarjeta" + selecciones[1])
            tarjeta1.style.transform = "rotateY(0deg)"
            tarjeta2.style.transform = "rotateY(0deg)"
            errores++;
        }else{
            trasera1.style.background = "plum"
            trasera2.style.background = "plum"
            aciertos++;
            if(aciertos == 12){
                    parar();
                    let tiempo = document.getElementById("reloj").innerHTML;
                  Swal.fire({
                    title: 'Lo lograste!',
                    input: 'text',
                    inputValue: "",
                    inputPlaceholder: "Ingresa tu nombre para figurar Ranking!",
                    confirmButtonText: `Volver a jugar`,
                  }).then((result) => {
                    if (result.value) {
                        nombreLocalStorage = result.value;
                    }
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      Swal.fire('Felicitaciones '+nombreLocalStorage+'!', 'Cometiste '+errores+' errores en: '+tiempo+'.<br>Ahora podes ver tu lugar en el ranking!', 'success')
                    }
                    console.log(nombreLocalStorage);
                    console.log(errores);
                    console.log(tiempo);
                    crearUsuario(nombreLocalStorage,errores,tiempo);
                    guardarDB();
                    // Se actualiza el nuevo juego recien al dar click en "ok"
                    let ok = document.querySelector(".swal2-confirm");
                    ok.addEventListener("click",function(){
                        generarTablero();
                        for(let i = 0; i < carasSuperiores.length;i++){
                            carasSuperiores[i].addEventListener("click",cronometrar);
                        }
                        reiniciar();
                        window.location = "ranking.html";
                    });
                    aciertos = 0;
                    errores = 0;
                  })               
            }
        }
    }, 1000);
}

document.querySelector(".nuevoJuego").addEventListener("click",()=>{
    aciertos = [];
    errores = [];
});

function ranking(){
    window.location = "ranking.html";
}
function jugar(){
    window.location = "index.html";
}



//TIEMPO JUGADO

h = 0;
m = 0;
s = 0;
if(document.getElementById("reloj")){
    document.getElementById("reloj").innerHTML="00:00:00";
    var carasSuperiores = document.getElementsByClassName("superior");
    if(carasSuperiores){
    for(let i = 0; i < carasSuperiores.length;i++){
        carasSuperiores[i].addEventListener("click",cronometrar);
    }
}   
function cronometrar(){
    escribir();
    id = setInterval(escribir,1000);
    for(let i = 0; i < carasSuperiores.length;i++){
        carasSuperiores[i].removeEventListener("click",cronometrar);
    }
}
function escribir(){
    var hAux, mAux, sAux;
    s++;
    if (s>59){m++;s=0;}
    if (m>59){h++;m=0;}
    if (h>24){h=0;}
    
    if (s<10){sAux="0"+s;}else{sAux=s;}
    if (m<10){mAux="0"+m;}else{mAux=m;}
    if (h<10){hAux="0"+h;}else{hAux=h;}
    let tiempo = hAux + ":" + mAux + ":" + sAux;
    document.getElementById("reloj").innerHTML = tiempo;
}
function reiniciar(){
    clearInterval(id);
    document.getElementById("reloj").innerHTML="00:00:00";
    h=0;m=0;s=0;
}
function parar(){
    clearInterval(id);
    // document.querySelector(".start").addEventListener("click",cronometrar);
}
document.querySelector(".nuevoJuego").addEventListener("click",()=>{
    reiniciar();
    for(let i = 0; i < carasSuperiores.length;i++){
        carasSuperiores[i].addEventListener("click",cronometrar);
    }
});

}

