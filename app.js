// ใช้ Firebase compat version (v8 style)
const firebaseConfig = {
    apiKey: "AIzaSyBJi1kmfyBYg8AxLl261cpm4Q6-ObkRSEo",
    authDomain: "regradeplus-82d6b.firebaseapp.com",
    projectId: "regradeplus-82d6b",
    storageBucket: "regradeplus-82d6b.appspot.com",
    messagingSenderId: "870087269668",
    appId: "1:870087269668:web:e1b431162c1ae85522e7b1",
    measurementId: "G-3DJWVKQQ1Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// โหลด menu เมื่อหน้าโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
    fetch("menu.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("menu-container").innerHTML = html;
            updateAdminLink(); // อัพเดท admin link หลังโหลด menu
        })
        .catch(err => console.error("โหลด menu ไม่ได้:", err));

    // เรียก loadHistory ถ้าอยู่ในหน้า history
    if (document.getElementById('history-list')) {
        loadHistory();
    }
});

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    if (menu) {
        menu.style.left = (menu.style.left === "0px") ? "-200px" : "0px";
    }
}

function logout() {
    auth.signOut().then(() => {
        localStorage.removeItem('uid');
        window.location.href = "index.html";
    }).catch(err => {
        console.error("Logout error:", err);
    });
}

function checkEmailType(email) {
    if (email === "admin.regradeplus@gmail.com") {
        return "admin";
    } else if (email.endsWith("@taweethapisek.ac.th")) {
        return "student";
    } else {
        return "invalid";
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('error-msg');

    const type = checkEmailType(email);

    if (type === "invalid") {
        errorMsg.textContent = "ใช้ email รร. หรือ admin เท่านั้น";
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            localStorage.setItem("uid", userCredential.user.uid);

            if (type === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "submit.html";
            }
        })
        .catch(error => {
            console.error(error);
            errorMsg.textContent = "เข้าสู่ระบบไม่สำเร็จ: " + error.message;
        });
}

function register() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorMsg = document.getElementById('error-msg');

    const type = checkEmailType(email);
    
    if (type !== "student") {
        errorMsg.textContent = "ใช้ email รร. เท่านั้น (@taweethapisek.ac.th)";
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            localStorage.setItem("uid", userCredential.user.uid);
            window.location.href = "submit.html";
        })
        .catch(error => {
            console.error(error);
            errorMsg.textContent = "สมัครสมาชิกไม่สำเร็จ: " + error.message;
        });
}

async function submitWork() {
    const msg = document.getElementById("msg");

    const name = document.getElementById("name").value;
    const classRoom = document.getElementById("class").value;
    const studentId = document.getElementById("studentId").value;
    const subjectCode = document.getElementById("subjectCode").value;
    const subjectName = document.getElementById("subjectName").value;
    const year = document.getElementById("year").value;

    const files = document.getElementById("images").files;

    if (files.length < 3) {
        msg.textContent = "ต้องอัปโหลดรูปอย่างน้อย 3 รูป!";
        return;
    }

    const uid = localStorage.getItem("uid");
    if (!uid) {
        msg.textContent = "กรุณา login ก่อน";
        return;
    }

    msg.textContent = "กำลังอัปโหลด...";

    try {
        let imageUrls = [];

        for (let file of files) {
            const fileRef = storage.ref(`submits/${uid}/${Date.now()}_${file.name}`);
            await fileRef.put(file);
            const url = await fileRef.getDownloadURL();
            imageUrls.push(url);
        }

        await db.collection("submits").add({
            uid,
            name,
            classRoom,
            studentId,
            subjectCode,
            subjectName,
            year,
            images: imageUrls,
            status: "รอตรวจ",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        msg.textContent = "ส่งงานสำเร็จ!";
        msg.style.color = "green";
        
        // ล้างฟอร์ม
        document.getElementById("name").value = "";
        document.getElementById("class").value = "";
        document.getElementById("studentId").value = "";
        document.getElementById("subjectCode").value = "";
        document.getElementById("subjectName").value = "";
        document.getElementById("year").value = "";
        document.getElementById("images").value = "";
    }
    catch (err) {
        console.error(err);
        msg.textContent = "เกิดข้อผิดพลาด: " + err.message;
        msg.style.color = "red";
    }
}

function loadHistory() {
    const uid = localStorage.getItem('uid');
    const container = document.getElementById('history-list');

    if (!uid) {
        container.textContent = "กรุณา login ก่อน";
        return;
    }

    db.collection('submits')
        .where('uid', "==", uid)
        .orderBy('timestamp', 'desc')
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                container.textContent = "ยังไม่มีประวัติการส่งงาน";
                return;
            }

            container.innerHTML = "";
            snapshot.forEach(doc => {
                const data = doc.data();

                const div = document.createElement("div");
                div.style.margin = '10px 0';
                div.style.padding = '10px';
                div.style.border = '1px solid #ddd';
                div.style.borderRadius = '8px';

                let filesHtml = "";
                if (data.images && data.images.length > 0) {
                    filesHtml = data.images.map((url, idx) => 
                        `<a href="${url}" target="_blank">รูปที่ ${idx + 1}</a>`
                    ).join(" | ");
                }

                const timestamp = data.timestamp ? 
                    new Date(data.timestamp.toDate()).toLocaleString('th-TH') : 
                    "ไม่ทราบเวลา";

                div.innerHTML = `
                    <b>${data.subjectName || "ไม่มีชื่อวิชา"}</b> (${data.subjectCode || "-"})<br>
                    ชื่อ: ${data.name || "-"}<br>
                    ชั้น: ${data.classRoom || "-"}<br>
                    สถานะ: <span style="color: orange;">${data.status || "รอตรวจ"}</span><br>
                    ส่งเมื่อ: ${timestamp}<br>
                    ไฟล์: ${filesHtml || "ไม่มีไฟล์"}
                `;
                container.appendChild(div);
            });
        })
        .catch(err => {
            console.error(err);
            container.textContent = "โหลดข้อมูลไม่ได้: " + err.message;
        });
}

function updateAdminLink() {
    auth.onAuthStateChanged(user => {
        const adminLink = document.getElementById('admin-link');
        if (adminLink) {
            if (user && user.email === "admin.regradeplus@gmail.com") {
                adminLink.style.display = "block";
            } else {
                adminLink.style.display = "none";
            }
        }
    });
}
updateAdminLink();