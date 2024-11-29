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
        // Text Colors
        {
            pattern:
                /text-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
        },
        // Background Colors
        {
            pattern:
                /bg-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
        },
        // Border Colors
        {
            pattern:
                /border-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
        },
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
                /([mp]|(mt|mr|mb|ml|mx|my))-(px|0|1|2|3|4|5|6|7|8|9|10|11|12)/,
        },
        // Widths and Heights
        {
            pattern:
                /(w|h)-(px|0|1|2|3|4|5|6|8|10|12|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96|auto|full|screen|min|max|fit)/,
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
        // Opacity
        {
            pattern: /opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)/,
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
            pattern: /z-(-?(\d+|auto))/,
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
        // Background Opacity
        {
            pattern: /bg-opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)/,
        },
        // Text Opacity
        {
            pattern:
                /text-opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)/,
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
                /max-w-(none|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full|min|max|prose)/,
        },
        // Min Widths
        {
            pattern: /min-w-(0|full|min|max)/,
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
            pattern: /gap-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64)/,
        },
        // Space Between
        {
            pattern:
                /space-(x|y)-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64)/,
        },
    ],
};
export default config;
