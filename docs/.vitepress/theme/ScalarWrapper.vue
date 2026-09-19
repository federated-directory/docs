<script setup>
import { ApiReference } from '@scalar/api-reference'
import { useData } from 'vitepress'
import { computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

const { isDark } = useData()
const wrapperRef = useTemplateRef('wrapper')

// Scalar only resolves the initial `#tag/...` hash (and scrolls to it) once,
// on mount. It doesn't react to hash-only link clicks within its own
// rendered Markdown content (e.g. "See how to [obtain a token](#tag/oauth2)"),
// so those links update the URL but never actually scroll anywhere unless
// the page is fully reloaded. We patch that in here: intercept clicks on
// same-page `#...` links inside the wrapper and scroll to the matching
// section ourselves. Scalar prefixes rendered section/operation ids with an
// internal document slug (e.g. "api-1/tag/oauth2"), so we match by suffix
// rather than requiring an exact id match.
function scrollToHash(hash) {
  if (!hash) return false
  const target = document.getElementById(hash) || document.querySelector(`[id$="/${hash}"]`)
  if (!target) return false
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

function handleClick(event) {
  const link = event.target.closest('a[href^="#"], a[href*="#"]')
  if (!link) return

  const href = link.getAttribute('href')
  const hashIndex = href.indexOf('#')
  if (hashIndex === -1) return
  const hash = href.slice(hashIndex + 1)
  const isSamePageLink = href.startsWith('#') || href === window.location.pathname + '#' + hash
  if (!isSamePageLink || !hash) return

  if (scrollToHash(hash)) {
    event.preventDefault()
    history.pushState(null, '', `#${hash}`)
  }
}

onMounted(() => {
  wrapperRef.value?.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  wrapperRef.value?.removeEventListener('click', handleClick)
})

const configuration = computed(() => ({
  spec: { url: '/swagger.json' },
  theme: 'default',
  hideModels: false,
  hideSearch: true,
  // Scalar's own sidebar duplicates the VitePress sidebar and its
  // accordion/flyout behavior was causing menus to flicker/appear-disappear
  // unexpectedly. We rely solely on the VitePress left sidebar for navigation.
  showSidebar: false,
  darkMode: isDark.value,
  withDefaultFonts: false, // We use our own font in custom.css
  agent: {
    disabled: true
  }
}))
</script>

<template>
  <div class="scalar-api-reference-wrapper" ref="wrapper">
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
