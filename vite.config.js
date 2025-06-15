import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})


// This configuration file sets up a Vite project with React support.
// It imports the necessary modules and exports a configuration object.
// The `defineConfig` function is used to define the Vite configuration.