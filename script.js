// --- DATABASE & INIT ---
const defaultPosts = [
    {
        id: 1,
        title: "SC BOT SHRIOKO MD NO ENC",
        image: "https://files.catbox.moe/18efeq.jpg",
        review: "https://youtu.be/7reK69kjqZQ?si=J9gops_8MCUbUHt7",
        download: "https://sub4unlock.co/bclv"
    }
];

const defaultConfig = {
    urls: ["https://youtube.com/@haidarmahiruofficial?si=XReQeHTKcSVODzjw"]
};

// --- LOAD DATA (ANTI HILANG) ---
let posts = JSON.parse(localStorage.getItem('haidar_posts'));
let config = JSON.parse(localStorage.getItem('haidar_conf'));

if (!posts) {
    posts = defaultPosts;
    localStorage.setItem('haidar_posts', JSON.stringify(posts));
}
if (!config) {
    config = defaultConfig;
    localStorage.setItem('haidar_conf', JSON.stringify(config));
}

let isAdmin = false;

// --- WINDOW LOAD ---
window.onload = function() {
    if (!sessionStorage.getItem('web_unlocked')) {
        renderPopup();
        document.getElementById('popupOverlay').style.display = 'flex';
    }
    renderPosts();
    
    // --- INISIALISASI PARTICLES BACKGROUND ---
    initParticles();
};

// --- LOGIKA POPUP FOLLOW (WAJIB KLIK SEMUA) ---
function renderPopup() {
    const box = document.getElementById('popupLinks');
    box.innerHTML = "";
    
    // Reset Tombol
    document.getElementById('btnUnlock').style.display = 'none';

    config.urls.forEach((url, idx) => {
        const a = document.createElement('a');
        a.className = 'link-item';
        a.href = url;
        a.target = "_blank"; // Buka tab baru
        // Text
        a.innerHTML = `<span>👉 Link ${idx + 1}</span> <span>Tap Disini</span>`;
        
        // Logika Klik
        a.onclick = function() {
            // 1. Tambah kelas 'visited' (berubah warna)
            this.classList.add('visited');
            this.innerHTML = `<span>✅ Sudah Diklik</span> <span>Oke</span>`;
            
            // 2. Cek apakah SEMUA link sudah diklik?
            checkAllLinksClicked();
        };
        
        box.appendChild(a);
    });
}

function checkAllLinksClicked() {
    const allLinks = document.querySelectorAll('.link-item');
    const clickedLinks = document.querySelectorAll('.link-item.visited');
    
    // Jika jumlah yang diklik SAMA DENGAN jumlah total link
    if (clickedLinks.length > 0 && clickedLinks.length === allLinks.length) {
        // Tampilkan tombol buka setelah jeda sedikit (biar ga kaget)
        setTimeout(() => {
            document.getElementById('btnUnlock').style.display = 'block';
        }, 500);
    }
}

function unlockWeb() {
    sessionStorage.setItem('web_unlocked', 'true');
    document.getElementById('popupOverlay').style.display = 'none';
}

// --- RENDER POSTINGAN ---
function renderPosts() {
    const list = document.getElementById('postList');
    list.innerHTML = "";

    posts.forEach(p => {
        const img = p.image ? p.image : "https://via.placeholder.com/400x200?text=No+Image";
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${img}" onerror="this.src='https://via.placeholder.com/400x200?text=Error'">
                <div class="del-btn" onclick="delPost(${p.id})" style="display:${isAdmin ? 'flex' : 'none'}">X</div>
            </div>
            <div class="card-title">${p.title}</div>
            <div class="btn-list">
                <a href="${p.review}" target="_blank" class="btn btn-rev">▶ LIHAT REVIEW</a>
                <a href="${p.download}" target="_blank" class="btn btn-down">⬇ DOWNLOAD FILE</a>
            </div>
        `;
        list.appendChild(card);
    });
}

// --- ADMIN SYSTEM ---
function openLogin() {
    if(isAdmin) return;
    document.getElementById('loginOverlay').style.display = 'flex';
}
function closeLogin() {
    document.getElementById('loginOverlay').style.display = 'none';
}
function login() {
    const pass = document.getElementById('passInput').value;
    if(pass === "mahiru") {
        isAdmin = true;
        closeLogin();
        document.getElementById('mainView').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        
        renderAdminUrls();
        document.getElementById('mainView').style.display = 'block';
        renderPosts(); 
    } else {
        alert("Password Salah!");
    }
}
function logout() {
    isAdmin = false;
    document.getElementById('adminPanel').style.display = 'none';
    renderPosts();
}

// --- ADMIN: KELOLA URL POPUP ---
function renderAdminUrls() {
    const div = document.getElementById('adminUrlList');
    div.innerHTML = "";
    config.urls.forEach((url, idx) => {
        div.innerHTML += `
            <div class="list-url-item">
                <span>${url.substring(0, 30)}...</span>
                <span style="color:red; cursor:pointer;" onclick="delUrl(${idx})">[Hapus]</span>
            </div>
        `;
    });
}
function addUrl() {
    const u = document.getElementById('newUrl').value;
    if(u) {
        config.urls.push(u);
        localStorage.setItem('haidar_conf', JSON.stringify(config));
        renderAdminUrls();
        document.getElementById('newUrl').value = "";
    }
}
function delUrl(idx) {
    if(confirm("Hapus link ini?")) {
        config.urls.splice(idx, 1);
        localStorage.setItem('haidar_conf', JSON.stringify(config));
        renderAdminUrls();
    }
}

// --- ADMIN: KELOLA POST ---
function addPost() {
    const t = document.getElementById('pTitle').value;
    const i = document.getElementById('pImg').value;
    const r = document.getElementById('pRev').value;
    const d = document.getElementById('pDown').value;

    if(t && d) {
        const newP = { id: Date.now(), title: t, image: i, review: r||"#", download: d };
        posts.unshift(newP);
        localStorage.setItem('haidar_posts', JSON.stringify(posts));
        renderPosts();
        
        document.getElementById('pTitle').value="";
        document.getElementById('pImg').value="";
        document.getElementById('pRev').value="";
        document.getElementById('pDown').value="";
        alert("Sukses!");
    } else {
        alert("Isi Judul & Link Download!");
    }
}

function delPost(id) {
    if(confirm("Hapus?")) {
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('haidar_posts', JSON.stringify(posts));
        renderPosts();
    }
}

// --- KONFIGURASI PARTICLES.JS ---
function initParticles() {
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            // Warna Partikel (Campuran Cyan dan Ungu)
            "color": { "value": ["#00e5ff", "#9d00ff"] },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": true },
            "size": { "value": 3, "random": true },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#00e5ff", // Warna garis penghubung
                "opacity": 0.4,
                "width": 1
            },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" }, // Garis nempel ke mouse saat hover
                "onclick": { "enable": true, "mode": "push" }, // Klik nambah partikel
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true
    });
}
