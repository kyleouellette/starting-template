## Starting point for all projects
It's nice to have a jump off point for simple projects. This starting template comes with some structure and a gulpfile. The following instructions will get you started.

- install gulp globally (if you dont already have it)
- install sass (if you dont already have it)
- run npm install

And that should be it for setup. The following commands are available by default:

- **npm run server**
- **gulp watch**
- gulp sass
- gulp concat
- **gulp minify-css**
- gulp images
- gulp copy-js
- **gulp minify-js**

## What happens with gulp?
Gulp will compile your scss, concat, and minify your styles into dist/css/style-min.css. You also have each file available to you prior to concatination and minification. Those are available by file name and the concatinated version is dist/style.css.

The image command for gulp will minify images from src/img to dist/img.

The JavaScript section could use some work.