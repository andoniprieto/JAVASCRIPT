// ===== 2. DATUAK =====
const liburuak = [
    { id: 1, izenburua: "Sapiens", kategoria: "Historia", prezioa: 19.95 },
    { id: 2, izenburua: "1984", kategoria: "Fikzioa", prezioa: 12.50 },
    { id: 3, izenburua: "Clean Code", kategoria: "Programazioa", prezioa: 34.00 },
    { id: 4, izenburua: "Gernika 1937", kategoria: "Historia", prezioa: 22.00 },
    { id: 5, izenburua: "JavaScript Eloquent", kategoria: "Programazioa", prezioa: 28.50 },
    { id: 6, izenburua: "Fikzio Osoak", kategoria: "Fikzioa", prezioa: 15.00 }
];

// Map: clave = id, valor = el libro entero
const liburuMap = new Map();
for (let liburua of liburuak) {
    liburuMap.set(liburua.id, liburua);
}

// Set con los id de los libros elegidos (el carrito)
let saskia = new Set();

window.addEventListener("load", function () {

    // ===== 1. ERLOJUA =====
    erakutsiOrdua();
    setInterval(erakutsiOrdua, 1000); // cada segundo

    // ===== 7. Leer localStorage al cargar (F5) =====
    const gordeta = localStorage.getItem("saskia");
    if (gordeta) {
        saskia = new Set(JSON.parse(gordeta)); // texto -> array -> Set
    }

    // ===== 3. KATEGORIAK (Set quita los repetidos) =====
    const kategoriak = new Set(liburuak.map(l => l.kategoria));
    const select = document.getElementById("kategoria");
    for (let kat of kategoriak) {
        const option = document.createElement("option");
        option.value = kat;
        option.textContent = kat;
        select.appendChild(option);
    }

    // ===== 5. IRAGAZKIA (filter) =====
    select.addEventListener("change", function () {
        if (select.value === "Guztiak") {
            erakutsiLiburuak(liburuak);
        } else {
            const iragazita = liburuak.filter(l => l.kategoria === select.value);
            erakutsiLiburuak(iragazita);
        }
    });

    erakutsiLiburuak(liburuak);
    eguneratuSaskia();
});

// Escribe la fecha y hora: YYYY-MM-DD HH:MM:SS
function erakutsiOrdua() {
    const d = new Date();
    const testua = d.getFullYear() + "-" + biZifra(d.getMonth() + 1) + "-" + biZifra(d.getDate()) +
        " " + biZifra(d.getHours()) + ":" + biZifra(d.getMinutes()) + ":" + biZifra(d.getSeconds());
    document.getElementById("erlojua").textContent = testua;
}

// 5 -> "05"
function biZifra(n) {
    return n < 10 ? "0" + n : n;
}

// ===== 4. TXARTELAK (map) =====
function erakutsiLiburuak(zerrenda) {
    const html = zerrenda.map(l => `
        <div class="txartela ${saskia.has(l.id) ? "saskian" : ""}" id="txartela${l.id}">
            <h3>${l.izenburua}</h3>
            <p>Kategoria: ${l.kategoria}</p>
            <p>Prezioa: ${l.prezioa.toFixed(2)} €</p>
            <label>
                <input type="checkbox" value="${l.id}" ${saskia.has(l.id) ? "checked" : ""}> Erosi
            </label>
        </div>
    `).join("");

    document.getElementById("katalogoa").innerHTML = html;

    // A cada checkbox le ponemos su evento
    const checkboxak = document.querySelectorAll("#katalogoa input[type=checkbox]");
    for (let cb of checkboxak) {
        cb.addEventListener("change", aldatuSaskia);
    }
}

// ===== 6. Checkbox marcado/desmarcado =====
function aldatuSaskia(e) {
    const id = Number(e.target.value);
    const txartela = document.getElementById("txartela" + id);

    if (e.target.checked) {
        saskia.add(id);
        txartela.classList.add("saskian");
    } else {
        saskia.delete(id);
        txartela.classList.remove("saskian");
    }

    // ===== 7. Guardar en localStorage (Set -> array -> texto) =====
    localStorage.setItem("saskia", JSON.stringify([...saskia]));

    eguneratuSaskia();
}

// ===== 6. Total con reduce (precio sacado del Map) =====
function eguneratuSaskia() {
    const idak = [...saskia]; // Set -> array
    const guztira = idak.reduce((batura, id) => batura + liburuMap.get(id).prezioa, 0);
    document.getElementById("saskia").textContent =
        "Liburuak: " + idak.length + " | Guztira: " + guztira.toFixed(2) + " €";
}
