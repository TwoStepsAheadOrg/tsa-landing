#!/usr/bin/env python3
"""Generate the TwoStepsAhead identity assets without changing established URLs.

Brand 2026-10-10: two squares, one direction. Master geometry is a 64-unit
viewBox with rects (4, 28, 30, 30) and (30, 2, 30, 30), in Step blue #244CE9.

Usage: python3 scripts/make-icons.py public [--font-dir /path/to/Pretendard]
Requires Pillow, fonttools[woff] and the repository's self-hosted fonts.
"""
from __future__ import annotations

import argparse
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

BLUE = '#244CE9'
INK = '#161B32'
PAPER = '#FFFFFF'
MIST = '#E9EFF9'
SQUARES = ((4, 28, 30, 30), (30, 2, 30, 30))
SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="TwoStepsAhead">
  <rect width="64" height="64" fill="#FFFFFF"/>
  <g fill="#244CE9">
    <rect x="4" y="28" width="30" height="30"/>
    <rect x="30" y="2" width="30" height="30"/>
  </g>
</svg>
'''


def draw_mark(draw: ImageDraw.ImageDraw, left: float, top: float, size: float):
    unit = size / 64
    for x, y, w, h in SQUARES:
        draw.rectangle((left + x * unit, top + y * unit,
                        left + (x + w) * unit - 1,
                        top + (y + h) * unit - 1), fill=BLUE)


def mark_image(size: int) -> Image.Image:
    image = Image.new('RGB', (1024, 1024), PAPER)
    draw_mark(ImageDraw.Draw(image), 0, 0, 1024)
    return image.resize((size, size), Image.Resampling.LANCZOS)


def make_og(font_dir: Path) -> Image.Image:
    font_data = {}
    for weight in ('Regular', 'SemiBold'):
        font_path = font_dir / f'Pretendard-{weight}.woff2'
        if not font_path.is_file():
            raise FileNotFoundError(f'Pretendard font required: {font_path}')
        with TTFont(font_path) as face:
            face.flavor = None
            buffer = BytesIO()
            face.save(buffer)
            font_data[weight] = buffer.getvalue()
    scale = 2
    image = Image.new('RGB', (1200 * scale, 630 * scale), PAPER)
    draw = ImageDraw.Draw(image)

    def rect(box, fill):
        draw.rectangle(tuple(round(v * scale) for v in box), fill=fill)

    def text(x, y, value, size, weight='regular', fill=INK):
        font = ImageFont.truetype(BytesIO(font_data['SemiBold' if weight == 'semibold' else 'Regular']), size * scale)
        draw.text((x * scale, y * scale), value, font=font, fill=fill, anchor='lt')

    rect((872, 0, 1200, 630), MIST)
    draw_mark(draw, 906 * scale, 196 * scale, 260 * scale)
    text(64, 57, 'TwoStepsAhead', 32, 'semibold')
    text(64, 116, '사람의 관심과 AI의 선택을 함께 설계합니다.', 22)
    for y, value in zip((207, 275, 343, 411), (
        '데이터 기반으로', 'AI 콘텐츠를 만들고,', 'AI가 좋아하는 광고를', '만듭니다.'
    )):
        text(64, y, value, 53, 'semibold', BLUE if y in (343, 411) else INK)
    rect((64, 532, 808, 533), MIST)
    text(64, 561, '데이터 · 콘텐츠 · 광고', 19)
    text(574, 561, 'twostepsahead.co.kr', 19)
    return image.resize((1200, 630), Image.Resampling.LANCZOS)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    parser.add_argument('--font-dir', type=Path, default=Path(__file__).resolve().parents[1] / 'public' / 'fonts')
    args = parser.parse_args()
    # Resolve fonts and the OG card before writing any files.
    og = make_og(args.font_dir)
    args.output.mkdir(parents=True, exist_ok=True)
    files = []
    for name, pixels in (
        ('favicon-32.png', 32), ('favicon-48.png', 48),
        ('apple-touch-icon.png', 180), ('icon-192.png', 192),
        ('icon-512.png', 512), ('logo-square.png', 512),
    ):
        mark_image(pixels).save(args.output / name, optimize=True)
        files.append(name)
    mark_image(256).save(args.output / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    (args.output / 'favicon.svg').write_text(SVG, encoding='utf-8')
    og.save(args.output / 'og-image.png', optimize=True)
    files.extend(('favicon.ico', 'favicon.svg', 'og-image.png'))
    print('Generated:', ', '.join(files))


if __name__ == '__main__':
    main()
