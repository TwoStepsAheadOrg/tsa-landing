// node design/social/export.cjs
// Supply SHARP_MODULE when Sharp is installed outside this repository.
const fs = require("node:fs");
const path = require("node:path");
const sharp = require(process.env.SHARP_MODULE || "sharp");
const root = path.resolve(__dirname, "../..");
const out = path.join(root, "public/social");
const ink = "#161B32",
  blue = "#244CE9",
  white = "#FFFFFF";
const forest = "#214D39",
  pink = "#FFD9E8",
  butter = "#F2EEA5",
  paper = "#F7F8F2";
const text = (x, y, size, value, color = ink, weight = 600, extra = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${value}</text>`;
const mark = (x, y, size, color, angle = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${angle} ${size / 2} ${size / 2}) scale(${size / 64})" fill="${color}"><path d="M4 28h30v30H4zM30 2h30v30H30z"/></g>`;
const logo = (color = ink, symbol = blue) =>
  mark(60, 48, 35, symbol) +
  text(108, 77, 30, "TwoStepsAhead", color, 600, 'letter-spacing="-1"');
const imageData = {};
const embed = (file) => imageData[file];
const img = (x, y, w, h, src, extra = "") =>
  `<image x="${x}" y="${y}" width="${w}" height="${h}" href="${src}" ${extra}/>`;
const wrap = (body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630"><style>text{font-family:Pretendard,"Apple SD Gothic Neo",sans-serif}</style><rect width="1200" height="630" fill="${bg}"/>${body}</svg>`;
const domain = (value, color = ink) =>
  text(1140, 591, 21, value, color, 400, 'text-anchor="end"');
async function run() {
  for (const file of [
    "brand/rin-portrait.webp",
    "brand/data-to-creative.webp",
  ]) {
    imageData[file] = `data:image/png;base64,${(
      await sharp(path.join(root, "public", file))
        .png()
        .toBuffer()
    ).toString("base64")}`;
  }
  const phone = `<g transform="translate(881 62) rotate(8 126 239.5)">
  <rect x="5" y="8" width="252" height="479" rx="39" fill="${ink}" opacity=".09"/>
  <rect width="252" height="479" rx="39" fill="${ink}"/><rect x="9" y="9" width="234" height="461" rx="31" fill="white"/>
  <rect x="91" y="16" width="70" height="15" rx="8" fill="${ink}"/>
  ${text(22, 63, 18, "RIN")}${text(228, 63, 10, "AI creator", "#657089", 400, 'text-anchor="end"')}
  ${img(9, 77, 234, 322, embed("brand/rin-portrait.webp"), 'preserveAspectRatio="xMidYMid slice"')}
  <g fill="none" stroke="${ink}" stroke-width="1.6" transform="translate(24 409) scale(.82)">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>
    <path transform="translate(40 0)" d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.3-1L3 21l1.7-5.2A8.5 8.5 0 1 1 21 11.5Z"/>
    <path transform="translate(80 0)" d="m22 2-7 20-4-9-9-4Z M22 2 11 13"/>
    <path transform="translate(226 0)" d="M5 3h14v18l-7-5-7 5Z"/>
  </g>${text(24, 448, 10, "RIN · Created by TwoStepsAhead", "#465069", 400)}<rect x="88" y="458" width="76" height="4" rx="2" fill="${ink}"/>
</g>`;
  const company = wrap(
    `<path d="M738 0h462v630H898a160 160 0 0 1-160-160Z" fill="#E9EFF9"/>
  ${logo()}${text(62, 139, 23, "사람의 관심과 AI의 선택을 함께 설계합니다.", "#465069", 400)}
  ${["데이터 기반으로", "AI 콘텐츠를 만들고,", "AI가 좋아하는 광고를", "만듭니다."].map((line, i) => text(60, 218 + i * 74, 59, line, ink, 600, 'letter-spacing="-2.8"')).join("")}
  ${img(652, 289, 395, 325, embed("brand/data-to-creative.webp"))}${phone}
  ${text(60, 591, 22, "AI 콘텐츠 · AI 검색 · 글로벌 마케팅", blue)}${domain("twostepsahead.co.kr")}`,
    white,
  );
  const careers = wrap(
    `${logo(white, "#F5F36A")}${text(1140, 78, 24, "채용과 조직문화", "#F5F36A", 400, 'text-anchor="end"')}
  ${text(60, 254, 79, "다음의 기준을,", white, 600, 'letter-spacing="-3.4"')}${text(60, 350, 79, "함께 만듭니다.", white, 600, 'letter-spacing="-3.4"')}
  ${text(64, 439, 29, "데이터와 콘텐츠를 잇는 팀", "#E9EFF9", 400)}${mark(824, 173, 306, "#F5F36A", -8)}
  ${text(60, 591, 22, "기획 · 디자인 · 개발 · 운영", "#E9EFF9", 400)}${domain("twostepsahead.co.kr/careers", white)}`,
    blue,
  );
  const ownnext = wrap(
    `${text(60, 78, 34, "OWNNEXT", paper)}${text(254, 78, 18, "by TwoStepsAhead", pink, 400)}
  ${text(60, 250, 80, "콘텐츠 다음은,", paper, 600, 'letter-spacing="-3.2"')}${text(60, 348, 80, "당신의 사업.", paper, 600, 'letter-spacing="-3.2"')}
  ${text(64, 428, 29, "크리에이터의 다음 사업을 함께 만듭니다.", pink, 400)}
  <g transform="translate(834 169) rotate(9 140 140) scale(2.8)"><rect width="100" height="100" rx="26" fill="${pink}"/><path d="M22 74V27h16l24 33V27h16v47H62L38 41v33Z" fill="${forest}"/><path d="M62 27h16v16H62Z" fill="${butter}"/></g>
  <path d="M60 544H1140" stroke="${paper}" stroke-opacity=".25"/>
  ${text(60, 591, 23, "사업모델 설계 · SaaS 제공·구축 · 공동 운영", butter, 400)}${domain("twostepsahead.co.kr/ownnext", paper)}`,
    forest,
  );
  fs.mkdirSync(out, { recursive: true });
  for (const [name, svg] of Object.entries({ company, careers, ownnext })) {
    fs.writeFileSync(path.join(__dirname, `${name}.svg`), svg);
    const file = path.join(out, `${name}-20261010-v7.png`);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
    console.log(
      name,
      await sharp(file)
        .metadata()
        .then(({ format, width, height, space }) => ({
          format,
          width,
          height,
          space,
          bytes: fs.statSync(file).size,
        })),
    );
  }
  fs.copyFileSync(
    path.join(out, "company-20261010-v7.png"),
    path.join(root, "public/og-image.png"),
  );
  fs.copyFileSync(
    path.join(out, "ownnext-20261010-v7.png"),
    path.join(root, "public/ownnext/og.png"),
  );
  fs.writeFileSync(path.join(root, "public/ownnext/og.svg"), ownnext);
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
