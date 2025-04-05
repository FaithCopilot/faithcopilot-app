/**
 * Detect if a string is potentially a JSON string
 * @param {*} str - Input to check
 * @returns {boolean} - Whether the input is potentially a JSON string
 */
const isPotentialJson = (str) => {
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  return (trimmed.startsWith('{') && trimmed.endsWith('}')) || 
         (trimmed.startsWith('[') && trimmed.endsWith(']'));
}

/**
 * Escape JSON string for use within a JSON string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
const escapeJsonString = (str) => {
  return JSON.stringify(str).slice(1, -1);
}

/**
 * Recursively resolve template variables in a context
 * @param {*} template - Template to resolve
 * @param {Object} context - Context for variable resolution
 * @returns {*} - Resolved template
 */
export const resolveTemplate = (template, context) => {
  // If not a string, return as-is
  if (typeof template !== 'string') return template;

  // Resolve variables with advanced parsing
  return template.replace(/{{([\w.]+)}}/g, (match, path) => {
    // Navigate through nested object using path
    let value;
    if (path?.includes(".")) {
      value = path.split('.').reduce((obj, key) =>
        obj && obj[key] !== undefined ? obj[key] : undefined,
        context
      );
    } else {
      value = context?.[path];
    };

    // Handle various value types
    if (value === undefined) return match; // Keep original if not found
    
    // If value is an object or array, stringify it
    if (typeof value === 'object' && value !== null) {
      return escapeJsonString(JSON.stringify(value));
    }

    // For other types, ensure it's a string representation
    return String(value);
  });
}

/**
 * Recursively resolve arguments with advanced type handling
 * @param {*} args - Arguments to resolve
 * @param {Object} context - Context for resolution
 * @returns {*} - Resolved arguments
 */
export const resolveArgs = (args, context) => {
  // Handle arrays
  if (Array.isArray(args)) {
    return args.map(item => resolveArgs(item, context));
  }
  
  // Handle strings that might be templates or JSON
  if (typeof args === 'string') {
    // First, resolve any templates in the string
    const resolvedTemplate = resolveTemplate(args, context);
    
    // If the resolved template looks like a complete JSON object, parse and stringify
    if (isPotentialJson(resolvedTemplate)) {
      try {
        // Try to parse and re-stringify to normalize
        return JSON.stringify(JSON.parse(resolvedTemplate));
      } catch (e) {
        // If parsing fails, return as-is (might be a string representation)
        return resolvedTemplate;
      }
    }
    
    // If not JSON, return the resolved template string
    return resolvedTemplate;
  }
  
  // Handle non-object, non-null values
  if (typeof args !== 'object' || args === null) {
    return args;
  }

  // Handle objects
  const resolved = {};
  for (const [key, value] of Object.entries(args)) {
    // Resolve each key-value pair
    resolved[key] = resolveArgs(value, context);
  }
  
  // Ensure the final result is a JSON string
  return JSON.stringify(resolved);
}
