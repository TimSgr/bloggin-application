console.log("JS Loaded");
const submit_form = document.querySelector("#submit_form");
const submit_button = submit_form.querySelector("button");
const contentbox = submit_form.querySelector("textarea");
const fullContent = document.querySelector(".full_content");

function preventFormSent(){
    submit_button.addEventListener("click", function(event){
        event.preventDefault();
        console.log(event);
        console.log("HA NO SUBMISSION FOR YOU");
        add_new_item(contentbox.value);
        contentbox.value="";
    });
}

function add_new_item(content){
    if(content!==""){
        contentbox.classList.remove("error");
        let username = getUserID() || "anonym"; // Nutze den Benutzernamen oder "anonym"
        // Füge den Post hinzu und aktualisiere das DOM direkt
        addPost(content, username);
    }else{
        contentbox.classList.add("error");
    }
}  

function getUserID() {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(cookie => cookie.startsWith('user_id='));
    return userCookie ? userCookie.split('=')[1] : null;
}

function fetchPosts() {
    fetch('http://localhost:8100/functions/get_posts.php')
    .then(response => response.json())
    .then(posts => {
        console.log('Posts:', posts);
        // Bereite einen Container vor, um alle Posts zu halten
        const postsContainer = document.createDocumentFragment();

        posts.forEach(post => {
            let { content, username, created_at, id } = post;
            const postElement = document.createElement("div");
            postElement.classList.add("post", "col-md-12");
            postElement.setAttribute('data-id', id);
            postElement.innerHTML = `
                <div class="content">${content}</div>
                <div class="username">- ${username || 'anonym'}</div>
                <div class="timestamp"> um ${created_at || new Date().toLocaleString()}</div>
                <div><button id="delete">Delete</button></div>
            `;
            // Füge das Post-Element zum temporären Container hinzu
            postsContainer.appendChild(postElement);
        });

        // Leere den fullContent nur einmal vor dem Hinzufügen der neuen Posts
        fullContent.innerHTML = '';
        fullContent.appendChild(postsContainer);
    })
    .catch(error => console.error('Fehler:', error));
}


function deletePost(postId){
    fetch('http://localhost:8100/functions/delete_post.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `post_id=${encodeURIComponent(postId)}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Entferne den Post aus dem DOM
            const postElement = fullContent.querySelector(`.post[data-id="${postId}"]`);
            if (postElement) {
                fullContent.removeChild(postElement);
            }
        } else {
            console.error('Fehler beim Löschen des Posts');
        }
    })
    .catch(error => console.error('Fehler:', error));
}

function addPostToDOM(content, username, id, created_at) {
    const postElement = document.createElement("div");
    postElement.classList.add("post", "col-md-12");
    postElement.setAttribute('data-id', id);

    postElement.innerHTML = `
        <div class="content">${content}</div>
        <div class="username">- ${username || 'anonym'}</div>
        <div class="timestamp"> um ${created_at || new Date().toLocaleString()}</div>
        <div><button id="delete">Delete</button></div>
    `;
    // Füge den neuen Post am Anfang der Timeline hinzu
    fullContent.insertBefore(postElement, fullContent.firstChild);
}

fullContent.addEventListener('click', function(event) {
    if (event.target.id=="delete"){
        const deleted_post=event.target.closest(".post");
        const postId = deleted_post.getAttribute('data-id');
        deletePost(postId);
    }
});


function addPost(content, username) {
    fetch('http://localhost:8100/functions/add_post.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `content=${encodeURIComponent(content)}&username=${encodeURIComponent(username)}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data["id"]);
            console.log('Post hinzugefügt');
            // Füge den neuen Post direkt zum DOM hinzu, anstatt alle Posts neu zu laden
            addPostToDOM(content, username, data["id"]) ;
        }
    })
    .catch(error => console.error('Fehler:', error));
}
preventFormSent();
fetchPosts();