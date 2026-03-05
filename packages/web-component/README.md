# @theemel/web-component

Use Themal on WordPress, static sites, or any non-React platform via a single `<script>` tag. No build step required.

## Quick Start

```html
<script src="https://themalive.com/theemel-editor.js"></script>
<theemel-editor></theemel-editor>
```

That's it — the script bundles React, the editor, and all styles into one file.

## WordPress Setup

### Option A: Custom HTML Block

1. Build the web component:
   ```bash
   cd packages/web-component
   npm run build
   ```
2. Upload `dist/theemel-editor.js` to your WordPress Media Library or a CDN.
3. Add a **Custom HTML** block to any page or post:
   ```html
   <script src="https://your-site.com/wp-content/uploads/theemel-editor.js"></script>
   <theemel-editor license-key="THEEMEL-XXXX-XXXX-XXXX"></theemel-editor>
   ```

### Option B: Enqueue via functions.php

1. Copy `dist/theemel-editor.js` into your theme directory (e.g. `your-theme/js/`).
2. Add to your theme's `functions.php`:
   ```php
   add_action('wp_enqueue_scripts', function() {
       wp_enqueue_script(
           'theemel-editor',
           get_template_directory_uri() . '/js/theemel-editor.js',
           [],
           '0.15.1',
           true
       );
   });
   ```
3. Add the custom element to any page template or shortcode:
   ```html
   <theemel-editor license-key="THEEMEL-XXXX-XXXX-XXXX"></theemel-editor>
   ```

### Option C: Simple WordPress Plugin

Create `wp-content/plugins/theemel/theemel.php`:

```php
<?php
/**
 * Plugin Name: Themal Editor
 * Description: Embed the Themal design system editor via [theemel] shortcode.
 * Version: 0.15.1
 */

add_action('wp_enqueue_scripts', function() {
    wp_register_script(
        'theemel-editor',
        plugins_url('theemel-editor.js', __FILE__),
        [],
        '0.15.1',
        true
    );
});

add_shortcode('theemel', function($atts) {
    $atts = shortcode_atts([
        'license-key' => '',
        'show-header' => 'true',
        'upgrade-url' => '',
        'sign-in-url' => '',
    ], $atts);

    wp_enqueue_script('theemel-editor');

    $attrs = '';
    foreach ($atts as $key => $value) {
        if ($value !== '') {
            $attrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
        }
    }

    return '<theemel-editor' . $attrs . '></theemel-editor>';
});
```

Then copy `theemel-editor.js` into the same plugin folder and use the `[theemel]` shortcode in any post or page:

```
[theemel license-key="THEEMEL-XXXX-XXXX-XXXX"]
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `license-key` | string | — | License key to unlock premium features. |
| `pr-endpoint-url` | string | — | URL for PR creation endpoint. |
| `accessibility-audit` | boolean | `true` | Enable axe-core WCAG contrast auditing. |
| `show-nav-links` | boolean | `true` | Show section navigation links. |
| `show-header` | boolean | `true` | Show the editor header. Set `false` for embedded use. |
| `upgrade-url` | string | — | Custom URL for upgrade prompts. |
| `sign-in-url` | string | — | Custom URL for sign-in prompts. |
| `about-url` | string | — | URL for the About page link in header navigation. |

## Building

```bash
cd packages/web-component
npm run build
```

Output: `dist/theemel-editor.js` — a self-contained IIFE bundle with React, ReactDOM, and all editor styles included via Shadow DOM.

## How It Works

The web component uses Shadow DOM for style isolation. When the `<theemel-editor>` element connects to the page, it:

1. Creates a shadow root
2. Copies document stylesheets into the shadow DOM
3. Mounts a React root and renders `<DesignSystemEditor />` with props derived from HTML attributes

Attribute changes are observed and trigger re-renders automatically.

## License

MIT
