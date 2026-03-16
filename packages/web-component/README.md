# @themal/web-component

Use Themal on WordPress, static sites, or any non-React platform via a single `<script>` tag. No build step required. Includes all editor sections: Colors, Buttons, Cards, Alerts, Typography, Inputs, and Tables — with custom themed dropdowns, responsive sidebar navigation, and frosted-glass mobile menu.

## Quick Start

```html
<script src="https://themalive.com/themal-editor.js"></script>
<themal-editor></themal-editor>
```

That's it — the script bundles React, the editor, and all styles into one file.

## WordPress Setup

### Option A: Custom HTML Block

1. Build the web component:
   ```bash
   cd packages/web-component
   npm run build
   ```
2. Upload `dist/themal-editor.js` to your WordPress Media Library or a CDN.
3. Add a **Custom HTML** block to any page or post:
   ```html
   <script src="https://your-site.com/wp-content/uploads/themal-editor.js"></script>
   <themal-editor license-key="THEMAL-XXXX-XXXX-XXXX"></themal-editor>
   ```

### Option B: Enqueue via functions.php

1. Copy `dist/themal-editor.js` into your theme directory (e.g. `your-theme/js/`).
2. Add to your theme's `functions.php`:
   ```php
   add_action('wp_enqueue_scripts', function() {
       wp_enqueue_script(
           'themal-editor',
           get_template_directory_uri() . '/js/themal-editor.js',
           [],
           '0.38.1',
           true
       );
   });
   ```
3. Add the custom element to any page template or shortcode:
   ```html
   <themal-editor license-key="THEMAL-XXXX-XXXX-XXXX"></themal-editor>
   ```

### Option C: Simple WordPress Plugin

Create `wp-content/plugins/themal/themal.php`:

```php
<?php
/**
 * Plugin Name: Themal Editor
 * Description: Embed the Themal design system editor via [themal] shortcode.
 * Version: 0.3.0
 */

add_action('wp_enqueue_scripts', function() {
    wp_register_script(
        'themal-editor',
        plugins_url('themal-editor.js', __FILE__),
        [],
        '0.38.1',
        true
    );
});

add_shortcode('themal', function($atts) {
    $atts = shortcode_atts([
        'license-key' => '',
        'show-header' => 'true',
        'show-logo' => '',
        'icon-mode' => '',
        'upgrade-url' => '',
        'sign-in-url' => '',
        'about-url' => '',
    ], $atts);

    wp_enqueue_script('themal-editor');

    $attrs = '';
    foreach ($atts as $key => $value) {
        if ($value !== '') {
            $attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
        }
    }

    return '<themal-editor' . $attrs . '></themal-editor>';
});
```

Then copy `themal-editor.js` into the same plugin folder and use the `[themal]` shortcode in any post or page:

```
[themal license-key="THEMAL-XXXX-XXXX-XXXX"]
```

## Attributes

All props that accept strings or booleans can be set as HTML attributes using kebab-case:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `license-key` | string | — | License key to unlock premium features. |
| `pr-endpoint-url` | string | — | URL for PR creation endpoint. |
| `accessibility-audit` | boolean | `true` | Enable built-in WCAG AA contrast auditing. |
| `show-nav-links` | boolean | `true` | Show section navigation links. |
| `show-header` | boolean | `true` | Show the editor header. Set `false` for embedded use. |
| `show-logo` | boolean | `false` | Show the Themal logo in the header. Defaults to `false` in the web component. Set `true` to display it. |
| `icon-mode` | string | `"append"` | `"append"` adds custom icons after built-ins. `"replace"` hides built-ins and shows only custom icons. |
| `upgrade-url` | string | — | Custom URL for upgrade prompts. |
| `sign-in-url` | string | — | Custom URL for sign-in prompts. |
| `about-url` | string | — | URL for the About page link in header navigation. |

### Example with all attributes

```html
<themal-editor
  license-key="THEMAL-XXXX-XXXX-XXXX"
  show-header="false"
  show-nav-links="false"
  show-logo="true"
  icon-mode="replace"
  accessibility-audit="true"
  upgrade-url="/pricing"
  sign-in-url="/sign-in"
  about-url="/about"
  pr-endpoint-url="/api/create-design-pr"
></themal-editor>
```

## Custom Icons via JavaScript

Since HTML attributes can only pass strings, custom icons are set programmatically with the `setIcons()` method. Pass an array of `{ name, svg }` objects where `svg` is a raw SVG string:

```html
<script src="https://themalive.com/themal-editor.js"></script>
<themal-editor icon-mode="replace"></themal-editor>

<script>
  const editor = document.querySelector('themal-editor');
  editor.setIcons([
    {
      name: "Heart",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    },
    {
      name: "Star",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    },
  ]);
</script>
```

Set `icon-mode="replace"` to hide the built-in icons and show only your custom set, or omit it (defaults to `"append"`) to add yours alongside the built-ins.

All SVG strings are sanitized — script tags, event handlers, `javascript:` URIs, and `style` attributes are automatically stripped.

## Building

```bash
cd packages/web-component
npm run build
```

Output: `dist/themal-editor.js` — a self-contained IIFE bundle with React, ReactDOM, and all editor styles included via Shadow DOM.

## How It Works

The web component uses Shadow DOM for style isolation. When the `<themal-editor>` element connects to the page, it:

1. Creates a shadow root
2. Copies document stylesheets into the shadow DOM
3. Mounts a React root and renders `<DesignSystemEditor />` with props derived from HTML attributes

Attribute changes are observed and trigger re-renders automatically.

## License

MIT
