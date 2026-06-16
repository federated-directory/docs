<script setup>
import { ApiReference } from '@scalar/api-reference'
import { useData } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true
  }
})

const { isDark } = useData()
const fullSpec = ref(null)
const specError = ref(null)

// Shared fetch promise to avoid redundant requests
let fetchPromise = null

const getSpec = async () => {
  if (fetchPromise) return fetchPromise
  fetchPromise = fetch('/swagger.json').then(r => r.json())
  return fetchPromise
}

onMounted(async () => {
  try {
    fullSpec.value = await getSpec()
  } catch (e) {
    specError.value = e
    console.error('Failed to load swagger.json', e)
  }
})

const filteredSpec = computed(() => {
  if (!fullSpec.value) return null

  const spec = JSON.parse(JSON.stringify(fullSpec.value))
  const paths = spec.paths
  const newPaths = {}

  for (const [path, methods] of Object.entries(paths)) {
    const newMethods = {}
    for (const [method, op] of Object.entries(methods)) {
      if (op.operationId === props.operationId) {
        const filteredOp = JSON.parse(JSON.stringify(op))
        // Add a hidden tag to avoid "Default" grouping
        filteredOp.tags = ['_hidden_']
        newMethods[method] = filteredOp
      }
    }
    if (Object.keys(newMethods).length > 0) {
      newPaths[path] = newMethods
    }
  }

  // Replace paths with our filtered set, but KEEP the rest of the spec
  // This preserves host, basePath, schemes, securityDefinitions etc.
  spec.paths = newPaths

  if (Object.keys(newPaths).length === 0) return null

  // Update global metadata to be minimal but valid
  spec.tags = [{ name: '_hidden_', description: '' }]
  spec.info = {
    title: 'Endpoint View',
    version: spec.info?.version || '1.0.0',
    description: ''
  }

  return spec
})

const configuration = computed(() => ({
  spec: { content: filteredSpec.value },
  theme: 'default',
  layout: 'modern',
  hideSidebar: true,
  hideModels: true,
  hideSearch: true,
  hideHeader: true,
  showTestRequestButton: true,
  darkMode: isDark.value,
  withDefaultFonts: false,
  defaultOpenAllTags: true,
  agent: {
    disabled: true
  }
}))
</script>

<template>
  <div class="scalar-endpoint-embedded">
    <template v-if="filteredSpec">
      <ApiReference :configuration="configuration" />
    </template>
    <div v-else class="scalar-loading">
      Loading endpoint details...
    </div>
  </div>
</template>

<style>
.scalar-endpoint-embedded {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  margin: 24px 0;
  background-color: var(--vp-c-bg-soft);
  min-height: 200px;
}

.scalar-endpoint-embedded .scalar-api-reference {
  background-color: transparent !important;
}

/* Force modern layout to use full width and remove sidebar space */
.scalar-endpoint-embedded .scalar-app {
  display: block !important;
}

.scalar-endpoint-embedded .sidebar {
  display: none !important;
}

.scalar-endpoint-embedded .references-classic {
  padding: 0 !important;
}

.scalar-endpoint-embedded .references-modern {
  padding: 0 !important;
}

/* Hide all Scalar navigation, search, and version info */
.scalar-endpoint-embedded .references-header,
.scalar-endpoint-embedded .references-sidebar,
.scalar-endpoint-embedded .scalar-header,
.scalar-endpoint-embedded .scalar-nav,
.scalar-endpoint-embedded .scalar-search,
.scalar-endpoint-embedded .scalar-version,
.scalar-endpoint-embedded .scalar-download,
.scalar-endpoint-embedded .tag-header,
.scalar-endpoint-embedded .tag-header-title {
  display: none !important;
}

/* Ensure the content is visible and takes full width */
.scalar-endpoint-embedded .references-classic-content,
.scalar-endpoint-embedded .references-modern-content {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Hide the _hidden_ tag header and any Scalar-generated headings */
.scalar-endpoint-embedded .tag-header,
.scalar-endpoint-embedded .tag-header-title,
.scalar-endpoint-embedded [data-tag-id="_hidden_"] {
  display: none !important;
}

/* Keep the Method/Path bar and ensure it is visible */
.scalar-endpoint-embedded .endpoint-summary {
  display: flex !important;
  padding: 16px !important;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

/* Force the information blocks to be visible */
.scalar-endpoint-embedded .endpoint-details {
  display: block !important;
}

.scalar-loading {
  padding: 40px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-base);
}
</style>
