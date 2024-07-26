# Poster Generator

This project is a simple poster generator using Cloudflare Worker to create posters with customizable text, font size, font color, font family, text alignment, line height, and background. The generated poster can be previewed in real-time and downloaded as an image.

## Features

- Customizable text
- Adjustable font size, font color, and font family
- Text alignment options
- Configurable line height
- Background options: solid color or gradient
- Real-time preview
- Download the generated poster as an image

## Deployment Instructions

### _worker.js

The _worker.js file is used for deployment to Cloudflare Workers. Follow these steps to deploy:

1. Sign up for a Cloudflare account if you don't have one.
2. Create a new Worker in the Cloudflare dashboard.
3. Copy the contents of _worker.js into the newly created Worker.
4. Save and deploy the Worker.

### index.html

The index.html file can be deployed to various online hosting platforms such as GitHub Pages, Vercel, etc. Here are the steps for deploying to GitHub Pages:

1. In your GitHub repository, go to the Settings tab.
2. Scroll down to the "GitHub Pages" section.
3. Under "Source", select the "main" branch (or whichever branch contains your index.html).
4. Click "Save".

Your site will be generated within minutes, and GitHub will provide you with a link.

Note: Make sure to update the `workerUrl` variable in the index.html file to point to the location of your worker.

## Usage

1. Visit your deployed GitHub Pages URL.
2. Use the interface to create and design your poster.
3. When finished, export your poster using the provided options.

## Contributing

Issues and pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
