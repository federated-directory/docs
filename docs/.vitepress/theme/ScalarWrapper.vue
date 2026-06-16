<script setup>
import { ApiReference } from '@scalar/api-reference'
import { useData } from 'vitepress'
import { computed } from 'vue'

const { isDark } = useData()

const configuration = computed(() => ({
  spec: { url: '/swagger.json' },
  theme: 'default',
  hideModels: false,
  hideSearch: true,
  darkMode: isDark.value,
  withDefaultFonts: false, // We use our own font in custom.css
  agent: {
    disabled: true
  }
}))
</script>

<template>
  <div class="scalar-api-reference-wrapper">
    <!-- Custom Download Button to replace the buggy default one -->
    <div class="custom-download-actions">
      <a href="/swagger.json" download="openapi.json" class="vp-button-download">
        <span class="vpi-download"></span> Download OpenAPI Spec
      </a>
    </div>

    <div class="scalar-api-reference">
      <ApiReference :configuration="configuration" />
    </div>
  </div>
</template>

<style>
.scalar-api-reference-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.custom-download-actions {
  position: absolute;
  top: 12px;
  right: 24px;
  z-index: 10;
}

.vp-button-download {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1) !important;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none !important;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.vp-button-download:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
  background-color: var(--vp-c-bg-alt);
}

.vpi-download::before {
  content: 'download' !important; /* Material icon name */
  font-family: 'Material Symbols Outlined';
}

/* Scalar variables to match site theme if needed, though Scalar has its own theming */
</style>
