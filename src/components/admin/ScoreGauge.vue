<template>
  <div class="flex flex-col items-center">
    <!-- Gauge Container -->
    <div class="relative w-48 h-48 mb-4">
      <!-- Background Circle -->
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <!-- Background Arc -->
        <path
          :d="backgroundPath"
          fill="none"
          stroke="#E5E7EB"
          :stroke-width="strokeWidth"
          stroke-linec