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
            let { content, username, created_at, id, likes } = post;
            const postElement = document.createElement("div");
            postElement.classList.add("post", "col-md-12");
            postElement.setAttribute('data-id', id);
            postElement.innerHTML = `
                <div class="content">${content}</div>
                <div class="username">- ${username || 'anonym'}</div>
                <div class="timestamp"> um ${created_at || new Date().toLocaleString()}</div>
                <div class="multiple_buttons">
                    <div class="action_delete"><button id="delete" class="btn btn-primary">Delete</button></div>
                    <div class="action_like"><div id="like_icon" class="like_icon"></div> <span class="like_count">${likes}</span> Likes</div>
                 </div>
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



fullContent.addEventListener('click', function(event) {
    if (event.target.id=="delete"){
        const deleted_post=event.target.closest(".post");
        const postId = deleted_post.getAttribute('data-id');
        deletePost(postId);
    }
});

fullContent.addEventListener('click', function(event) {
    if (event.target.id=="like_icon"){
        console.log("liked");
        const deleted_post=event.target.closest(".post");
        const postId = deleted_post.getAttribute('data-id');
        addLike(postId);
    }
});

// fetch request to add new post to database 
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
            // Add post instant to frontend so no reload needed
            addPostToDOM(content, username, data["id"]) ;
        }
    })
    .catch(error => console.error('Fehler:', error));
}

// add post content to dom
function addPostToDOM(content, username, id, created_at) {
    const postElement = document.createElement("div");
    postElement.classList.add("post", "col-md-12");
    postElement.setAttribute('data-id', id);

    postElement.innerHTML = `
        <div class="content">${content}</div>
        <div class="username">- ${username || 'anonym'}</div>
        <div class="timestamp"> um ${created_at || new Date().toLocaleString()}</div>
        <div class="multiple_buttons">
            <div class="action_delete"><button id="delete" class="btn btn-primary">Delete</button></div>
            <div class="action_like"><div id="like_icon" class="like_icon"></div> <span class="like_count">0</span> Likes</div>
        </div>
    `;
    // Füge den neuen Post am Anfang der Timeline hinzu
    fullContent.insertBefore(postElement, fullContent.firstChild);
}

function update_like_record(id, like_count){
    const like_counter = document.querySelector(`.post[data-id="${id}"] .like_count`);
    like_counter.textContent=like_count;
}

// aktuell nicht genutzt, da kein Nutzen
function addLike(id){
    fetch('http://localhost:8100/functions/add_like.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${encodeURIComponent(id)}`,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data["like_count"]);
        update_like_record(id, data["like_count"]);
    })
    .catch(error => console.log('Fehler:', error));
}

preventFormSent();
fetchPosts();