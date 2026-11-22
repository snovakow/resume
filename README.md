# resume
 Resume

## The PDF

`public/ScottNovakowski-Resume.pdf` is the page, printed. `npm run pdf` builds the page and prints
it with headless Chrome, as Chrome's Print > Save as PDF does, and only where `index.html`, `src/`
or `vite.config.js` changed after the commit that last changed the PDF, since Chrome stamps every
print with its time. `npm run pdf -- --check` says whether it would, and `npm run pdf -- --force`
prints it anyway. Chrome is found where it is usually installed, or where `CHROME_PATH` says.

`/commit` reprints the PDF whenever the page changes, and commits it with that change, or on its
own where the change is already committed. `/deploy` stops where a branch changed the page after
its PDF was printed, and copies the PDF it puts live over `root/resume.pdf` in the jobs
repository, where that is checked out beside this one.
