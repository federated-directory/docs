const fs = require("fs");
const https = require("https");
const path = require("path");

// Configuration
const API_URL = "https://api.federated.directory/swagger.json";
const OUTPUT_DIR = path.join(__dirname, "../docs/public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "swagger.json");

// Mapping of OpenAPI Tags to Markdown file paths for documentation injection
const DOCS_MAPPING = {
  Users: "docs/developer/users-api.md",
  OAuth2: "docs/developer/obtaining-a-token.md",
  MCP: "docs/mcp.md",
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function processMarkdown(content) {
  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---\n/, "");
  // Remove <ScalarEndpoint ... /> lines
  content = content.replace(/<ScalarEndpoint.*?\/>/g, "");
  // Remove <script setup> ... </script> blocks
  content = content.replace(/<script setup>[\s\S]*?<\/script>/g, "");
  // Convert ::: info to blockquote
  content = content.replace(/::: info\n([\s\S]*?):::/g, "> **Info**\n$1");
  return content.trim();
}

function injectDocumentation(spec) {
  if (!spec.tags) return;

  for (const [tagName, filePath] of Object.entries(DOCS_MAPPING)) {
    try {
      const fullPath = path.join(__dirname, "..", filePath);
      if (fs.existsSync(fullPath)) {
        const rawContent = fs.readFileSync(fullPath, "utf8");
        const processedContent = processMarkdown(rawContent);

        const tag = spec.tags.find((t) => t.name === tagName);
        if (tag) {
          tag.description = processedContent;
          console.log(`Injected documentation for tag: ${tagName}`);
        }
      }
    } catch (e) {
      console.warn(`Failed to inject docs for ${tagName}:`, e.message);
    }
  }
}

function fetchSpec(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
      res.on("error", reject);
    });
  });
}

function sanitize(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  const newObj = {};
  for (const key in obj) {
    // Check if the key is $ref
    if (key === "$ref") {
      if (
        typeof obj[key] === "string" &&
        (obj[key].startsWith("http") ||
          obj[key].startsWith(".") ||
          obj[key].startsWith("/"))
      ) {
        console.log(`Sanitizing ref: ${obj[key]}`);

        // If it looks like a User or Group URI, rename to 'ref' to stop Scalar from trying to resolve it as a schema.
        if (obj[key].includes("/Users/") || obj[key].includes("/Groups/")) {
          newObj["ref"] = obj[key];
        } else {
          newObj[key] = sanitize(obj[key]);
        }
      }
      // Handle case where $ref is a property name definition (SCIM) with an object value (Schema)
      // Scalar treats all keys named '$ref' as references, so we must rename this property to avoid "Can't resolve reference: [object Object]"
      else if (typeof obj[key] === "object") {
        newObj["ref"] = sanitize(obj[key]);
      } else {
        newObj[key] = sanitize(obj[key]);
      }
    } else {
      newObj[key] = sanitize(obj[key]);
    }
  }
  return newObj;
}

async function run() {
  console.log(`Fetching swagger.json from ${API_URL}...`);
  try {
    const spec = await fetchSpec(API_URL);
    console.log("Sanitizing spec to remove external $ref links...");
    const cleanSpec = sanitize(spec);

    // Inject documentation from Markdown files
    injectDocumentation(cleanSpec);

    // Inject the generic SCIMReference definition to handle the sanitized refs
    if (!cleanSpec.definitions) {
      cleanSpec.definitions = {};
    }
    cleanSpec.definitions.SCIMReference = {
      type: "object",
      description: "Reference to another resource (User or Group)",
      properties: {
        value: {
          type: "string",
          description: "Unique identifier of the resource",
        },
        ref: { type: "string", description: "URI of the resource" },
        display: {
          type: "string",
          description: "Display name of the resource",
        },
      },
    };

    // Generate searchable index for VitePress
    generateSearchIndex(cleanSpec);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanSpec, null, 2));
    console.log(`Success! Saved sanitized spec to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Failed to process swagger.json:", error);
    process.exit(1);
  }
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

function generateSearchIndex(spec) {
  // Use 'API Documentation' as the title so search results show this category
  let markdown = "# API Documentation\n\n";
  const map = {};

  if (spec.paths) {
    for (const [pathKey, methods] of Object.entries(spec.paths)) {
      for (const [method, op] of Object.entries(methods)) {
        if (op.summary) {
          const heading = `${op.summary}`;
          const slug = slugify(heading);
          const tagName = op.tags ? op.tags[0] : "default";
          const operationId = op.operationId;

          // Scalar anchor format: tag/{tagName}/operation/{operationId}
          // Tags must be lowercase for deep links
          const scalarAnchor = `tag/${tagName.toLowerCase()}/operation/${operationId}`;

          map[`#${slug}`] = scalarAnchor;

          markdown += `## ${heading}\n\n`;
          if (op.description) {
            // Clean description of newlines for simple index
            const cleanDesc =
              op.description.replace(/\n/g, " ").substring(0, 150) + "...";
            markdown += `${cleanDesc}\n\n`;
          }
          markdown += `**Method**: ${method.toUpperCase()} ${pathKey}\n\n`;
          markdown += `[Go to endpoint](/developer/api-reference#${scalarAnchor})\n\n`;
        }
      }
    }
  }

  // Add the script to redirect based on the hash
  const script = `<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

const anchorMap = ${JSON.stringify(map, null, 2)};

onMounted(() => {
  const hash = window.location.hash;
  if (hash && anchorMap[hash]) {
    // Redirect to the deep link in Scalar
    window.location.href = '/developer/api-reference#' + anchorMap[hash];
  } else {
    // Fallback if accessed directly without hash
    // We stay here so search engine crawlers can see the content?
    // Or redirect to main api page?
    // Let's redirect to main page to avoid confusion, but maybe delay or only if human?
    // For now, redirect immediate if no hash match is safer for UX.
    window.location.href = '/developer/api-reference';
  }
})
</script>

`;

  const finalContent = script + markdown;
  const searchIndexPath = path.join(
    __dirname,
    "../docs/developer/api-search.md",
  );
  fs.writeFileSync(searchIndexPath, finalContent);
  console.log(`Generated searchable API index at ${searchIndexPath}`);
}

run();
