## eslint-plugin-oval
An [ESLint](http://eslint.org/) plugin to extract and lint scripts from [organic-oval](https://github.com/camplight/organic-oval) tag files.

Supported extensions are `.html` and `.tag`.

### Usage

Install the plugin:

```sh
npm install --save-dev eslint-plugin-oval
```

Add it to your `.eslintrc`:

```json
{
  "plugins": ["oval"]
}
```

Write your riot tag file with extension `.html` or `.tag`, and wrap your script with `<script type="es6"> </script>`, for example:

```html
<some-tag>
  <script>
   require('bind-tag')(tag)
   tag.bind('post', {
     id: 'someId',
     title: 'some title',
     likes: 0
   })

   var likePost = () => {
     ...
   }
  </script>

  <div>
    <span>Id: {tag.post.id}</span>
    <span>Title: <a href="#detail/{tag.post.id}">{tag.post.title}</a></span>
    <span>{tag.post.likes} Likes</span>
    <button
      onclick={likePost}
    >
      Like
    </button>
  </div>
</some-tag>
```


## Credits

Forked from [eslint-plugin-riot](https://github.com/txchen/eslint-plugin-riot) orgininally by [Tianxiang Chen](https://github.com/txchen)
