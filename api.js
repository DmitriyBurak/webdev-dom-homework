import { renderComments } from "./render.js";

const butAddComment = document.querySelector(".add-form-button");
const nameInputElement = document.querySelector("#name-input");
const commentAreaElement = document.querySelector("#comment-area");
const addForm = document.querySelector(".add-form");

export let allComments = [];

document.querySelector("#isLoading").style.display = "none";

// const isValidForm = () => {
//   if (nameInputElement.value === "" || commentAreaElement.value === "") {
//     butAddComment.disabled = true;
//     return false;
//   } else {
//     butAddComment.disabled = false;
//     return true;
//   }
// };

const getComments = () => {
  return fetch("https://webdev-hw-api.vercel.app/api/v1/dima-burak/comments",
  {
    method: "GET",
  })
  .then((response) => {
  return response.json()
  })
  .then((responseData) => {
    allComments = [...responseData.comments];
    renderComments(allComments);
  }).catch((error) => console.error(error));
};

getComments();

const postComment = (text, name) => {
  console.log('post comment');
  return fetch('https://webdev-hw-api.vercel.app/api/v1/dima-burak/comments', {
    method: 'POST',
    body: JSON.stringify({
      text: text,
      name: name,
      forceError: true,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 400) {
        throw new Error('Ошибка ввода');
      } else if (response.status === 500) {
        throw new Error('Сервер упал');
      }
    })
    .then(() => {
      butAddComment.disabled = true;
      document.querySelector('#isLoading').style.display = 'none';
      document.querySelector('#isLoading2').style.display = 'flex';
      console.log('Перед очисткой');
      nameInputElement.value = '';
      commentAreaElement.value = '';
      getComments();
    })
    .catch((error) => {
      butAddComment.disabled = false;
      document.querySelector('#isLoading').style.display = 'none';
      document.querySelector('#isLoading2').style.display = 'flex';
      if (error.message === 'Сервер упал') {
        alert('Сервер сломался, попробуй позже');
      } else if (error.message === 'Ошибка ввода') {
        alert('Имя и комментарий должны быть не короче 3 символов');
      } else alert('Отсутствует соединение с интернетом, попробуйте позже...');
      console.warn(error);
    });
};

butAddComment.addEventListener('click', () => {
  document.querySelector('#isLoading').style.display = 'block';
  document.querySelector('#isLoading2').style.display = 'none';
  const text = commentAreaElement.value.replaceAll('<', '&lt').replaceAll('>', '&gt');
  const name = nameInputElement.value.replaceAll('<', '&lt').replaceAll('>', '&gt');
  postComment(text, name);
});

addForm.addEventListener('keyup', (action) => {
  if (action.code === 'Enter') {
    document.querySelector('#isLoading').style.display = 'block';
    document.querySelector('#isLoading2').style.display = 'none';
    const text = commentAreaElement.value.replaceAll('<', '&lt').replaceAll('>', '&gt');
    const name = nameInputElement.value.replaceAll('<', '&lt').replaceAll('>', '&gt');
    postComment(text, name);

    // Очищаем поля
    // nameInputElement.value = "";
    // commentAreaElement.value = "";
    // butAddComment.disabled = true;
  }
});

