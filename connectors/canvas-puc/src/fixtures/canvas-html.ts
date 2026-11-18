/**
 * HTML as the Canvas Rich Content Editor saves it (copied from real PUC Minas Canvas content; ids kept, verifiers
 * replaced by fake ones), for the link extraction tests.
 */

/** Canvas host the fixtures point to. */
export const FIXTURE_CANVAS_URL = 'https://pucminas.instructure.com';

/** Assignment 1408627 ("Revisão para a prova."): theme CSS/JS, a file link from the RCE and a video iframe. */
export const REVIEW_ASSIGNMENT_HTML = `<link rel="stylesheet" href="https://instructure-uploads.s3.amazonaws.com/account_117480000000000001/attachments/5994588/pucminas_graduacao.mobile.css"><p>Atividade não pontuada.</p>
<p><a class="instructure_file_link instructure_scribd_file inline_disabled" title="Revisão_Comp_Paralela___Prova.pdf" href="https://pucminas.instructure.com/courses/294409/files/18832665?verifier=00000000-fake-0000-0000-000000000001&amp;wrap=1" target="_blank" data-canvas-previewable="false" data-api-endpoint="https://pucminas.instructure.com/api/v1/courses/294409/files/18832665" data-api-returntype="File">Revisão para a prova.</a></p>
<p>Questões de 10 a 13 em vídeo:</p>
<p><iframe style="width: 480px; height: 300px; display: inline-block;" title="Reprodutor de vídeo para 2026-11-15 14-33-55.mov" data-media-type="video" src="https://pucminas.instructure.com/media_attachments_iframe/19034621?embedded=true&amp;type=video&amp;verifier=00000000-fake-0000-0000-000000000002" loading="lazy" allowfullscreen="allowfullscreen" allow="fullscreen" data-media-id="m-5KAzPmXPof31N5c25n2iTU99kNZhBLNW"></iframe></p><script src="https://instructure-uploads.s3.amazonaws.com/account_117480000000000001/attachments/18126021/pucminas_graduacao.js"></script>`;

/** YouTube video embedded by the RCE. */
export const YOUTUBE_IFRAME_HTML = `<p><iframe width="560" height="315" title="YouTube video player" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay" allowfullscreen="allowfullscreen"></iframe></p>`;

/** Older Canvas media recording: inline media comment link and media object iframe. */
export const MEDIA_OBJECT_HTML = `<p><a id="media_comment_m-abc123" class="instructure_inline_media_comment video_comment" href="/media_objects/m-abc123">this is a media comment</a></p><p><iframe title="Aula 3" src="/media_objects_iframe/m-def456?type=video" data-media-id="m-def456" data-media-type="video"></iframe></p>`;

/** Image uploaded to the course files and inserted inline. */
export const IMAGE_HTML = `<p><img src="https://pucminas.instructure.com/courses/294409/files/1234567/preview" alt="Diagrama de Amdahl" data-api-endpoint="https://pucminas.instructure.com/api/v1/courses/294409/files/1234567" data-api-returntype="File" width="400"></p>`;

/** External links: a plain site, a Google Drive file and a page of the course. */
export const EXTERNAL_LINK_HTML = `<p>Leia <a href="https://example.org/openmp.pdf" target="_blank" rel="noopener">o tutorial de OpenMP</a>, a <a href="https://drive.google.com/file/d/1AbC/view">pasta</a> e a <a title="Plano de ensino" href="/courses/294409/pages/plano-de-ensino" data-api-endpoint="https://pucminas.instructure.com/api/v1/courses/294409/pages/plano-de-ensino" data-api-returntype="Page">página do plano</a>.</p>`;

/** Description without any link. */
export const NO_LINK_HTML = `<p>Atividade não pontuada.</p>
<ul><li>Leia o capítulo 2.</li><li>Faça os exercícios.</li></ul>`;
