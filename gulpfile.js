var gulp = require("gulp");
var eslint = require("gulp-eslint");
var browserSync = require("browser-sync");
var reload = browserSync.reload;

gulp.task("default", ["serve", "lint", "watch"]);

gulp.task("serve", function() {
  browserSync.init({
    server: "./"
  });
});

gulp.task("lint", function() {
  return gulp.src(['js/**/*.js', '!node_modules/**'])
                .pipe(eslint())
                .pipe(eslint.format())
                .pipe(eslint.failAfterError());
});

gulp.task("watch", function() {
  gulp.watch("*.html").on("change", reload);
  gulp.watch("css/*.css").on("change", reload);
  gulp.watch("js/*.js").on("change", reload);
});
