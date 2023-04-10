import { allComments } from "./api.js";

const clickLikeButton = () => {
  let likeButton = document.querySelectorAll(".like-button");
  for (let i = 0; i < likeButton.length; i++) {
    likeButton[i].onclick = function (event) {
      event.stopPropagation();
      if (allComments[i].isLiked === false) {
        allComments[i].isLiked = true;
        allComments[i].likes += 1;
      } else if (allComments[i].isLiked === true) {
        allComments[i].isLiked = false;
        allComments[i].likes -= 1;
      }
      renderComments();
      // responseToComment(); 
    };
  }
};

const initDeleteButtonsListeners = () => {
  const deleteButtonsElements =
    document.querySelectorAll(".delete-button");

  for (const deleteButtonElement of deleteButtonsElements) {
    deleteButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = deleteButtonElement.dataset.index;
      console.log(index);
      allComments.splice(index, 1);
      renderComments();
      responseToComment();
    });
  }
};

const responseToComment = () => {
  const comMents = document.querySelectorAll(".comment");
  const commentArea = document.getElementById("comment-area");
  for (const comment of comMents) {
    comment.addEventListener("click", () => {
      const response = comment.dataset.text;
      commentArea.value = response;
    });
  }
};
responseToComment();


export const renderComments = () => {
  const listOfComments = document.querySelector(".comments");
    const commentsHtml = allComments
      .map((comment, index) => {
        return `<li data-text='${comment.text} \n ${
          comment.author.name
        }' class="comment">
      <div class="comment-header">
        <div>${comment.author.name}</div>
        <div>${new Date(comment.date).toLocaleString()}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="but-del">
          <button data-index="${index}" class='delete-button'>Удалить</button>
        </div>
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="${
            comment.isLiked ? "like-button -active-like" : "like-button"
          }"></button>
        </div>
      </div>
    </li>`;
      })
      .join("");

    listOfComments.innerHTML = commentsHtml;
    clickLikeButton();
    initDeleteButtonsListeners();
    responseToComment();
  };