const postButton = document.getElementById("postButton");
const postInput = document.getElementById("postInput");
const titleInput = document.getElementById("titleInput");
const postsContainer = document.getElementById("postsContainer");
const filterInput = document.getElementById("titleSearch")

// Tarih formatlayıcı
function getCurrentTime() {
  const date = new Date();
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}


// Gönderi ekleme
postButton.addEventListener("click", function () {
  const title = titleInput.value.trim(); // Konu başlığı (trim ile baştaki ve sondaki boşluklar temizlenir)
  const text = postInput.value.trim();  // İçerik (trim ile baştaki ve sondaki boşluklar temizlenir)  

  if (title && text) {
    const post = {
      title: title,
      text: text,
      time: getCurrentTime()
    };

    // Gönderiyi local storage'a ekle
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));

    displayPost(post);  // Yeni gönderiyi ekrana göster

    // Alanları temizle
    titleInput.value = "";
    postInput.value = "";
  } else {
    alert("The title or content cannot be left blank!");
  }
});

// Sayfa yüklendiğinde local storage'dan gönderileri getir
window.addEventListener("load", function () {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.forEach(post => displayPost(post));
});

// Gönderiyi ekrana yazdır
function displayPost(post) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  // Başlık ekle
  const postTitle = document.createElement("div");
  postTitle.classList.add("post-title");
  postTitle.textContent = post.title;

  // İçerik ekle
  const postContent = document.createElement("div");
  postContent.classList.add("post-content");

  // 300 karakterden fazla metin varsa, "Devamını Oku" butonunu ekle
  if (post.text.length > 300) {
    let shortText = post.text.slice(0, 300) + '...'; // Kısaltılmış metin 300 karakter
    const fullText = document.createElement("span");
    fullText.textContent = post.text;

    const readMoreButton = document.createElement("button");
    readMoreButton.textContent = "Read More";
    readMoreButton.onclick = function() {
      postContent.innerHTML = '';  // Metni ve butonu sıfırla
      postContent.appendChild(fullText);
      postContent.appendChild(readLessButton);
    };

    const readLessButton = document.createElement("button");
    readLessButton.textContent = "Hide";
    readLessButton.onclick = function() {
      postContent.innerHTML = '';  // Metni ve butonu sıfırla
      postContent.textContent = shortText; // İlk 300 karakteri göster
      postContent.appendChild(readMoreButton); // "Devamını Oku" butonunu ekle
    };

    postContent.textContent = shortText; // İlk 300 karakteri göster
    postContent.appendChild(readMoreButton); // "Devamını Oku" butonunu ekle
  } else {
    // 300 karakterden kısa metinler için butonlar gizlenir
    postContent.textContent = post.text;
  }

  // Tarih ekle
  const postTime = document.createElement("div");
  postTime.classList.add("post-time");
  postTime.textContent = post.time;

  // Silme butonu ekle
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function() {
    deletePost(post, postDiv);
  };

  // Gönderiyi birleştir
  postDiv.appendChild(postTitle);
  postDiv.appendChild(postContent);
  postDiv.appendChild(postTime);
  postDiv.appendChild(deleteButton);
 

  // Sayfaya ekle
  postsContainer.prepend(postDiv);
}

// Gönderiyi sil
function deletePost(post, postDiv) {
  // Local Storage'dan gönderiyi sil
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts = posts.filter(p => p.title !== post.title || p.time !== post.time); // Seçilen gönderiyi sil
  localStorage.setItem("posts", JSON.stringify(posts));

  // Sayfadan gönderiyi kaldır
  postDiv.remove();
}

// Konu Başlığı Arama

filterInput.addEventListener("keyup", function (e) {
  const filterValue = e.target.value.toLowerCase().trim(); // Arama terimi
  const allPosts = document.querySelectorAll(".post"); // Tüm gönderi div'leri

  if (allPosts.length > 0) {
    let foundAny = false; // En az bir gönderi bulunup bulunmadığını kontrol etmek için
    allPosts.forEach(function (post) {
      const titleElement = post.querySelector(".post-title"); // Başlık elemanını seç
      if (
        titleElement &&
        titleElement.textContent.toLowerCase().trim().includes(filterValue)
      ) {
        post.style.display = "block"; // Eşleşen gönderiyi göster
        foundAny = true;
      } else {
        post.style.display = "none"; // Eşleşmeyeni gizle
        
      }
    });

    if (!foundAny) {
      alert("No matching title found!"); // Hiçbir başlık bulunmazsa uyarı ver
    }
  } else {
    alert("You must have at least one post!"); // Eğer hiç gönderi yoksa uyarı
  }
});
form.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Enter tuşunun sayfayı yenilemesini engeller
  }
});