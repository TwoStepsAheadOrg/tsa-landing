# Brand sharing cards

1200 × 630 static sharing images for the three public entry points.

## Design plan

- Company: Step blue `#244CE9`, ink `#161B32`, mist `#E9EFF9`, lemon `#F5F36A`, white `#FFFFFF`. The established RIN portrait appears inside a social-feed phone, beside the existing data artwork. These source artworks are reused unchanged.
- Careers: the same palette, with a blue field and the two-step company symbol. The image explicitly identifies careers and culture.
- OWNNEXT: forest `#214D39`, pink `#FFD9E8`, butter `#F2EEA5`, paper `#F7F8F2`. Korean promise leads, matching the dedicated site; the existing N identity provides recognition.
- Type: Pretendard with Apple SD Gothic Neo as the native rasterizer fallback, semibold headlines, regular support. Left aligned. Headlines 59–80 px; supporting text at least 22 px. Keep key text within 60 px edges.

```text
Company     [symbol + company]                 [RIN phone]
            [four-line company promise] [data sculpture]
            [short service line]                [domain]

Careers     [symbol + company]                  [careers]
            [two-line invitation]             [two steps]
            [team's work]                       [domain]

OWNNEXT     [brand + parent]
            [two-line Korean promise]          [N mark]
            [creator business partner]
            [BM / SaaS / shared operations]
```

Brief review: a generic technology diagram and repeated company card would obscure the distinct purposes. The company card instead uses the actual RIN/data cover assets, careers gets a specific invitation, and OWNNEXT puts the Korean proposition ahead of English display copy. No performance claims or partner logos are added to a sharing thumbnail.

## Source and export

`export.cjs` is the deterministic SVG artwork source. Run `node design/social/export.cjs` with Sharp available, or set `SHARP_MODULE` to its module path. This writes intermediate SVGs (ignored by Git) and the final sRGB PNGs in `public/social/`. Existing WebP artwork is decoded to lossless PNG before SVG embedding for native rasterizer compatibility. No artwork is regenerated or retouched. The legacy OWNNEXT SVG is refreshed too.

The 1200 × 630 layout was first checked in the browser. The final files are exported directly through the SVG rasterizer to preserve exact brand colors and real PNG encoding, then inspected visually. The shipped files use versioned names; metadata is embedded in the three production HTML heads so crawlers do not need JavaScript.

The legacy `/og-image.png` and `/ownnext/og.png` URLs are also refreshed for existing consumers. Existing platform-specific page/image caches are outside the site's control; validation covers public HTML and image responses, not messages posted to social services.
