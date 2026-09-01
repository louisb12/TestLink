# Section 02 DO image: use the uploaded pop-up modal

Place the uploaded Freecash pop-up mockup as the DO visual in "02 · Pop-up design", with corners rounded to match the placeholder frame.

## What changes

- Register the uploaded `Modal.png` as a hosted asset pointer (`src/assets/popup-do.png.asset.json`) instead of copying the binary into the repo.
- In `src/routes/index.tsx`, Section 02's `doPlaceholder` becomes `{ caption: <descriptive alt text>, src: popupDo.url }` so the real image renders in the DO panel. The DON'T placeholder text stays as is.
- In `src/components/guide/UploadSlot.tsx`, add `rounded-2xl` to the rendered `<img>`/`<video>` so the artwork's own corners are rounded like the dashed placeholder frame (currently the image sits inside the rounded frame but keeps square corners because it is padded and `object-contain`).

## Notes

Alt text will describe the pop-up (Freecash reward pop-up showing a $10 sign-up bonus, in-game coin reward and an "Start earning rewards" CTA). No copy, layout, or checklist changes.
