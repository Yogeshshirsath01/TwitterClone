document.addEventListener('DOMContentLoaded', function() {
 
    document.querySelectorAll('.edit').forEach(btn => {
        btn.onclick = function () {
            btn.style.display = 'none'
            let contentDiv = document.querySelector(`#content${btn.dataset.postid}`)
            contentDiv.innerHTML =
                ` <form id="edit-post-form" class="card-text" style="margin-top: 1rem; margin-bottom: 1.6rem">
                    <div class="form-group" style="margin-bottom: .7rem">
                        <textarea 
                            style="overflow: hidden; resize: none"
                            oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
                            class="form-control"
                            id="edit-post-textarea">${contentDiv.innerHTML}</textarea>
                    </div>
                    <input type="submit" class="btn btn-primary post-submit" value="Save"/>
                </form>`

            document.querySelector('#edit-post-form').onsubmit = () => {
                const content = document.querySelector('#edit-post-textarea').value;
                const post_id = btn.dataset.postid
                
                fetch('/postedit', {
                    method: 'PUT',
                    body: JSON.stringify({content, post_id})
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.error) {
                            console.log(`Error editing post: ${result.error}`);
                        } else {
                            console.log(result.message)
                            contentDiv.innerHTML = content
                            btn.style.display = 'block'
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                return false;
            }

        }
    })


    document.querySelectorAll('.like').forEach(btn => {
        btn.onclick = function () {
           fetch('/postedit', {
               method: 'PUT',
               body: JSON.stringify({toggle_like: true, post_id: btn.dataset.postid})
           })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    console.log(`Error liking post: ${result.error}`);
                } else {
                    console.log("changed like")

                    let likes_count = document.querySelector(`#likes${btn.dataset.postid}`)

                    if (parseInt(result.likes_num) < parseInt(likes_count.innerHTML)) {
                        btn.innerHTML = "<i class='mr-2 material-icons'>favorite_border</i>Like"
                    } else if (parseInt(result.likes_num) > parseInt(likes_count.innerHTML)) {
                        btn.innerHTML = "<div style='color: rgb(247, 5, 102);'><i class='mr-2 material-icons'>favorite</i>Unlike</div>"
                    }
                    document.querySelector(`#likes${btn.dataset.postid}`).innerHTML = result.likes_num
                }
            })
        }
    })
});