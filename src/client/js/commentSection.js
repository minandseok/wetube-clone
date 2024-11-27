const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteCommentBtn = document.querySelector(".deleteCommentBtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/video/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const btn = event.target;
  const li = btn.closest("li"); // 삭제 버튼의 부모 댓글 요소
  const commentId = li.dataset.id;

  if (!commentId) {
    return alert("Comment ID not found.");
  }

  // 서버에 DELETE 요청
  const response = await fetch(`/api/video/${commentId}/delete-comment`, {
    method: "POST",
  });

  if (response.status === 200) {
    // 요청 성공 시 DOM에서 댓글 삭제
    li.remove();
  } else {
    alert("Failed to delete comment.");
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const videoCommentsBox = document.querySelector(".video__comments");

if (videoCommentsBox) {
  videoCommentsBox.addEventListener("click", handleDelete);
}
