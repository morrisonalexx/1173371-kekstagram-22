import { isEscEvent, isValidComment, MAX_COMMENT_LENGTH } from './util.js';

const MAX_HASHTAG_LENGTH = 20;
const MAX_HASHTAG_COUNT = 5;

const hashtags = document.querySelector('.text__hashtags');
const description = document.querySelector('.text__description');
const uploadText = document.querySelector('.img-upload__text');
const regExp = /^[а-яА-ЯёЁa-zA-Z0-9]+$/;

//Отмена обработчика Esc при фокусе
const onCancelEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.stopPropagation();
  }
};

const checkDuplicateHashtags = (hashtagsBox) => {
  return new Set(hashtagsBox).size !== hashtagsBox.length
}

//Валидация хештегов
const onHashTagValidation = (evt) => {
  const input = evt.target;
  input.classList.add('input-invalid');

  if (!input.value) {
    input.setCustomValidity('');
  }

  const hashtagsBox = input.value.trim().toLowerCase().split(' ').filter(string => string);

  // проверки
  if (checkDuplicateHashtags(hashtagsBox)) {
    input.setCustomValidity('Не допускается использование дублирующих хештегов');
  } else if (hashtagsBox.length > MAX_HASHTAG_COUNT) {
    input.setCustomValidity('Допускается использование не более 5 хештегов');
  } else {
    hashtagsBox.forEach(hashtag => {
      if (hashtag.length === 1 || hashtag.charAt(0) !== '#') {
        input.setCustomValidity('Хэштег должен начинается с символа #, и не может состоять только из него одного');
      } else if (hashtag.length > MAX_HASHTAG_LENGTH) {
        input.setCustomValidity('Максимальная длина одного хэш-тега 20 символов, включая решётку');
      } else if (!regExp.test(hashtag.substring(1))) {
        input.setCustomValidity('Строка после символа # должна состоять из букв и чисел и не может содержать другие символы и пробелы');
      } else {
        input.setCustomValidity('');
        input.classList.remove('input-invalid');
      }
    })
  }

  input.reportValidity();
};

//Валидация комментариев
const onCommentValidation = (evt) => {
  const input = evt.target;
  input.classList.add('input-invalid');

  if (!input.value) {
    input.setCustomValidity('');
  } else if (!isValidComment(input.value)) {
    input.setCustomValidity(`Длина комментария не может составлять больше ${MAX_COMMENT_LENGTH} символов`);
  } else {
    input.setCustomValidity('');
    input.classList.remove('input-invalid')
  }

  input.reportValidity();
};

//фокус/блюр на полях хештегов и комментария
uploadText.addEventListener('focus', () => {
  document.body.addEventListener('keydown', onCancelEscKeydown);
  description.addEventListener('input', onCommentValidation);
  hashtags.addEventListener('input', onHashTagValidation);
}, true);

uploadText.addEventListener('blur', () => {
  document.body.removeEventListener('keydown', onCancelEscKeydown);
  description.removeEventListener('input', onCommentValidation);
  hashtags.removeEventListener('input', onHashTagValidation);
}, true);

export { uploadText, hashtags, description };
