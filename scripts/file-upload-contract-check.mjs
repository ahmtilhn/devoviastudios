import { readFile } from 'node:fs/promises';

const paths = {
  main: 'src/main.jsx',
  app: 'src/App.jsx',
  uploads: 'src/ui/contextual-file-uploads.js',
  payload: 'src/ui/web3forms-attachment-payload.js',
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

const checks = [];
const check = (name, condition, detail) => checks.push({ name, condition: Boolean(condition), detail });
const count = (text, token) => text.split(token).length - 1;

check('File upload UI is imported once', count(source.main, "./ui/contextual-file-uploads.js") === 1, paths.main);
check('Web3Forms payload adapter is imported once', count(source.main, "./ui/web3forms-attachment-payload.js") === 1, paths.main);
check('Forms submit multipart FormData without a manual content-type header', source.app.includes('const formData = new FormData(form)') && source.app.includes('body: formData') && !source.app.includes("'Content-Type': 'multipart/form-data'"), paths.app);
check('Web3Forms access key is configured', !source.app.includes("formAccessKey = 'PASTE_WEB3FORMS_ACCESS_KEY'"), paths.app);
check('Only file attachment UI is added', ['project_link', 'screen_recording_link', 'google_play_reference', 'device_model', 'app_os_version', 'project_stage'].every((token) => !source.uploads.includes(token)), paths.uploads);
check('Attachments remain optional', !source.uploads.includes('input.required = true') && source.uploads.includes('Optional: attach images or documents'), paths.uploads);
check('Images, PDF, Word, spreadsheets, text and presentations are accepted', ['jpg', 'png', 'webp', 'pdf', 'docx', 'xlsx', 'csv', 'txt', 'pptx'].every((token) => source.uploads.includes(`'${token}'`)), paths.uploads);
check('Executable and app package extensions are not accepted', ['.apk', '.aab', '.ipa', '.exe', '.zip', '.jks', '.keystore'].every((token) => !source.uploads.includes(`'${token}'`)), paths.uploads);
check('Per-file limit is 5 MB', source.uploads.includes('const MAX_FILE_BYTES = 5 * 1024 * 1024'), paths.uploads);
check('Total attachment limit is 15 MB', source.uploads.includes('const MAX_TOTAL_BYTES = 15 * 1024 * 1024'), paths.uploads);
check('File count is capped at five', source.uploads.includes('const MAX_FILES = 5'), paths.uploads);
check('Selected files survive DOM re-enhancement', source.uploads.includes('const formStates = new WeakMap()'), paths.uploads);
check('Drag, keyboard and reset interactions are implemented', ['dragover', "event.key === 'Enter'", "form.addEventListener('reset'"].every((token) => source.uploads.includes(token)), paths.uploads);
check('Payload creates one Web3Forms field per file', source.payload.includes('files.forEach((file, index)') && source.payload.includes('payload.name = `attachment_${index}`'), paths.payload);
check('Payload uses DataTransfer and multipart encoding', source.payload.includes('new DataTransfer()') && source.payload.includes("form.enctype = 'multipart/form-data'"), paths.payload);
check('Source inputs are restored after FormData capture', source.payload.includes('input.disabled = true') && source.payload.includes('input.disabled = false'), paths.payload);

const failures = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'PASS' : 'FAIL'}  ${item.name}  [${item.detail}]`);
}
console.log(`\nFile upload contract checks: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exit(1);
