
`biiif mydirectory -u http://mywebsite.com`

Pass the directory to use as the root, and the web address to use as the root id.

If the folder has child directories (ones that don't start with an underscore), it's a collection. Otherwise it's a manifest.

Add the appropriate manifest or collection boilerplate to `<directory>/index.json`.

Look for an `info.yml` file to get the label, description, and attribution. e.g.

```
label: Woody
date: 2017-16-11
description: A wooden figurine
attribution: Snooper's Paradise 
```

If `label` is included, use this instead of the directory name.

If a collection, list the child directories in the `index.json`. If there's an `info.yml` in the directory, and it has a `label` property, use that as the label, otherwise use the directory name.

If a manifest, create a canvas for each directory starting with an underscore. For each file matching a whitelist (obj, pdf, mp4, jpg) in each directory starting with an underscore, annotate it onto the corresponding canvas.

