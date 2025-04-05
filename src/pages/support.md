---
layout: ../layouts/MarkdownLayout.astro
---

## Getting Started

### Installation

You can install the package via npm:
```bash
npm install @react-ssr/express
```

### Usage

```javascript
import express from 'express';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createExpressRenderer } from '@react-ssr/express';
import App from './App.vue';

const app = express();
const renderer = createExpressRenderer({
  render: async (url, context) => {
    const app = createSSRApp(App);
    const html = await renderToString(app, context);
    return html;
  },
});

app.use(renderer);
app.listen(3000);
```

| Feature | Support |
| ---------: | :------------------- |
| CommonMark | 100% |
| GFM | 100% `remark-gfm` |

| Feature | Support |
| --------- | ------------------- |
| CommonMark | 100% |
| GFM | 100% `remark-gfm` |

For GFM, you can *also* use a plugin:
[`remark-gfm`](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language:
tables, strikethrough, tasklists, and literal URLs.

These features **do not work by default**.
👆 Use the toggle above to add the plugin.

~~strikethrough~~

* [ ] task list
* [x] checked item

- list item 1
- list item 2
- list item 3

1. ordered list item 1
2. ordered list item 2
3. ordered list item 3

https://example.com
