import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Define server settings to allow local network access
    server: {
      host: '0.0.0.0',  // Make the server accessible from all network interfaces
      port: 5174,       // change to 5173 when deploying
    },
    define: {
      'process.env': env,
    },
    plugins: [react()],  // Include React plugin
  };
});
