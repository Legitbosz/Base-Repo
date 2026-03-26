import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // Ethereum/Web3 libs — the heavy ones
          'ethers': ['ethers'],
          'viem': ['viem'],
          'viem-chains': ['viem/chains'],
        },
      },
    },
  },
  // Pre-bundle these for faster dev server startup
  optimizeDeps: {
    include: ['react', 'react-dom', 'ethers', 'viem', 'viem/chains'],
  },
})
