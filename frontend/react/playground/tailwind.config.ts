import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
        },
    },
    plugins: [],
    safelist: [
        // **Color-related classes with variants**
        // Text Colors
        {
            pattern:
                /text-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover'],
        },
        // Background Colors
        {
            pattern:
                /bg-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover'],
        },
        // Border Colors
        {
            pattern:
                /border-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover'],
        },
        // Opacity
        {
            pattern:
                /(opacity|bg-opacity|text-opacity)-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)/,
            variants: ['hover'],
        },

        // **Width and Height classes with variants**
        // Widths and Heights (only `w-*` and `h-*`, excluding `min` and `max` prefixes)
        {
            pattern:
                /(w|h)-(px|0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96|auto|full|screen|fit)/,
            variants: ['hover'],
        },

        // **Other classes without variants**
        // Border Radius (Shapes)
        {
            pattern: /rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?/,
        },
        // Specific Side Border Radius
        {
            pattern:
                /rounded-(t|b|l|r|tl|tr|bl|br)-(none|sm|md|lg|xl|2xl|3xl|full)/,
        },
        // Padding and Margin Sizes
        {
            pattern:
                /([mp]|(mt|mr|mb|ml|mx|my))-(px|0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)/,
        },
        // Shadows
        {
            pattern: /shadow(-(sm|md|lg|xl|2xl|inner|none))?/,
        },
        // Font Sizes
        {
            pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/,
        },
        // Font Weights
        {
            pattern:
                /font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/,
        },
        // Flex Direction and Justify Content
        {
            pattern:
                /(flex|flex-row|flex-col|justify|items)-(start|end|center|between|around|evenly|stretch)/,
        },
        // Display
        {
            pattern:
                /(block|inline-block|inline|flex|inline-flex|grid|inline-grid|contents|hidden|table|table-row|table-cell)/,
        },
        // Position
        {
            pattern: /(static|fixed|absolute|relative|sticky)/,
        },
        // Z-Index
        {
            pattern: /z-(-?\d+|auto)/,
        },
        // Text Alignment
        {
            pattern: /text-(left|center|right|justify)/,
        },
        // Overflow
        {
            pattern: /overflow-(auto|hidden|visible|scroll|ellipsis|clip)/,
        },
        // Cursor
        {
            pattern:
                /cursor-(auto|default|pointer|wait|text|move|not-allowed|crosshair|grab|grabbing)/,
        },
        // List Style
        {
            pattern: /list-(none|disc|decimal)/,
        },
        // Borders
        {
            pattern: /border(-(t|b|l|r|x|y))?-(0|2|4|8)/,
        },
        // Border Styles
        {
            pattern: /border-(solid|dashed|dotted|double|none)/,
        },
        // Max Widths
        {
            pattern:
                /max-w-(none|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full|prose)/,
        },
        // Min Widths
        {
            pattern: /min-w-(0|full)/,
        },
        // Max Heights
        {
            pattern: /max-h-(0|full|screen)/,
        },
        // Min Heights
        {
            pattern: /min-h-(0|full|screen)/,
        },
        // Grid Template Columns
        {
            pattern: /grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12|none)/,
        },
        // Grid Template Rows
        {
            pattern: /grid-rows-(1|2|3|4|5|6|none)/,
        },
        // Gap
        {
            pattern:
                /gap-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)/,
        },
        // Space Between
        {
            pattern:
                /space-(x|y)-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)/,
        },
    ],
};
export default config;
