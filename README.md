[![Hackathon Win](https://i.postimg.cc/cHchLV3h/Black-Technology-Linked-In-Banner-1.png)](https://openservai.hackerearth.com/)

# Project Setup

This project uses [Vite](https://vitejs.dev/) for fast development and hot module replacement. This guide explains how to clone the repository, install dependencies, and run the project on `localhost:3000`.
![Project Screenshot](https://media-hosting.imagekit.io/93ee9410feef466c/WhatsApp%20Image%202025-04-06%20at%2001.25.53_79b24236.jpg?Expires=1839297377&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=vlhMwfMeoV0WkchlMKL8Kay2M48EyKSpHpyL9QehZxHMno40wtqafWcjd~nNt9vnuXWiA0V~mX5giYjqhO04RQs2OLkrt1Lmxv-xB9NYxU-P~Z36PD3Pp3HQ~oULbqtMZbX4Otwfb6EY0tC0LWf9iVyG5TB2JcXM2h0n39mfd1iiPYR0HN6faRAbV90Eb~R7HHJycWWHyvUx1vmV-CIptGeI~MSt6m97pSDhH8Wkp2UTYcxCRMn9M~Xym4hPt8o1rrefOlW3k6mjWR3G2R8pmp83EE7n4C1jkW0inM12DZW3J~0MOPNVserrgP-~HFCqvPsJooiIOp4LP4mu-SiZHw__)

## Prerequisites

- **Git** – for cloning the repository.
- **Node.js** (v16 or later) and **npm** – for managing packages and running scripts.

## Cloning the Repository

Clone the repository using Git:

```sh
git clone https://github.com/AshKatale/assure-fi.git
cd frontend
```

## Installing Dependencies

Install all necessary packages by running:

```sh
npm install
```

## Running the Development Server on Port 3000

By default, Vite runs on port `5173`. To run the development server on port `3000`, you have two options:

### Option 1: Using the CLI

Run the development server and specify the port:

```sh
npm run dev -- --port 3000
```

### Option 2: Updating the Vite Config

Modify (or create) the `vite.config.js` file at the root of your project to include a custom server configuration:

```js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true, // Ensures Vite exits if port 3000 is not available
  },
});
```

After starting the server, open your browser and visit:

```
http://localhost:3000
```

## Building and Previewing for Production

To build the production version of the project:

```sh
npm run build
```

To preview the production build locally:

```sh
npm run preview
```

## Troubleshooting

- **Node.js Installation:** Ensure you have the correct version of Node.js installed.
- **Port Availability:** Verify that port 3000 is free; if not, try stopping the service using it or choose a different port.
- **Reinstalling Modules:** If you run into issues, try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

## License

This project is licensed under the MIT License.
