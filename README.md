# pickfrompic

A free, open-source color tool for designers and developers. Pick colors from images, create palettes, generate gradients, and convert color formats — all running entirely in your browser.

**Live Demo:** [pickfrompic.vercel.app](https://pickfrompic.vercel.app)

## Features

### Image Color Picker
- Upload any image (PNG, JPG, GIF, WEBP) and extract dominant colors instantly
- Interactive magnifier lens for precise pixel-level color picking
- Color dot highlighting — click a palette color to see where it appears on the image
- Pick from screen using the EyeDropper API
- Load images from URLs, website screenshots, or clipboard paste

### Color Picker & Conversion
- Full-featured color picker with HEX input
- Convert between 8 formats: HEX, RGB, HSL, HSB, CMYK, LAB, LUV, HWB
- Switch between picker view and format-specific sliders (HSB, HSL, RGB)
- Pick any color from your screen with EyeDropper
- One-click copy for any format

### Palette Generator
- Create custom color palettes with up to 20 colors
- Add, remove, and reorder color stops
- Fine-tune each color with the built-in picker
- Randomize entire palette with one click
- Pick colors directly from your screen
- Export as CSS variables, JSON, SVG, or PNG
- Save palettes to your dashboard

### Gradient Maker
- Build linear and radial CSS gradients
- Add, remove, and adjust multiple color stops
- Visual angle slider (0-360 degrees)
- Position slider for each stop
- Pick from screen for any color stop
- Randomize gradient with one click
- Live preview with gradient bar
- Copy CSS code instantly
- Download as SVG or PNG

### Dashboard
- Save and manage palettes, colors, and gradients
- Grid and list view options
- Search through saved items
- Multi-select with bulk delete
- Export and download saved items

### PWA Support
- Install as a native app on your device
- Works offline after first visit
- Fast, app-like experience

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| TailwindCSS v4 | Styling |
| React Colorful | Color picker component |
| React Router v7 | Client-side routing |
| Lucide React | Icons |
| react-extract-colors | Image color extraction |

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/bilalmlkdev/pickfrompic.git

# Navigate to project
cd pickfrompic

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
pickfrompic/
├── public/
│   ├── favicon.svg          # App icon (logo)
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── robots.txt            # Search engine rules
│   └── sitemap.xml           # Sitemap for SEO
├── src/
│   ├── components/
│   │   ├── atoms/            # Basic UI elements (Button, Input, Swatch, etc.)
│   │   ├── molecules/        # Composed elements (Logo, ModalShell, PillTabs, etc.)
│   │   ├── organisms/        # Complex components (Header, ImageUploader, etc.)
│   │   ├── modals/           # Modal dialogs (ExportPalette, SaveItem, ImageSource, etc.)
│   │   └── templates/        # Layout components (ToolCard, PageShell)
│   ├── context/              # React context (DashboardContext)
│   ├── hooks/                # Custom hooks (useDocumentTitle)
│   ├── pages/                # Route pages (MainPicker, ColorConversion, Dashboard, etc.)
│   └── utils/                # Utilities (ColorMath, exportUtils)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Color Formats Supported

| Format | Example | Description |
|---|---|---|
| HEX | `#2596be` | Hexadecimal color code |
| RGB | `37, 150, 190` | Red, Green, Blue (0-255) |
| HSL | `198, 67%, 45%` | Hue, Saturation, Lightness |
| HSB | `198, 80%, 74%` | Hue, Saturation, Brightness |
| CMYK | `81, 21, 0, 25` | Cyan, Magenta, Yellow, Key |
| LAB | `59, -16, -27` | CIELAB color space |
| LUV | `58, -12, -27` | CIELUV color space |
| HWB | `198, 18%, 25%` | Hue, Whiteness, Blackness |
| XYZ | `28, 47, 62` | CIE 1931 color space |

## Browser Support

- Chrome 76+ (EyeDropper API supported)
- Firefox 62+
- Safari 12.1+
- Edge 79+

> **Note:** The EyeDropper (pick from screen) feature requires Chrome, Edge, or Opera.

## Privacy

All color processing happens entirely in your browser. No image data or color information is sent to any server. The app works offline after the first visit.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

**bilalmlkdev** — [GitHub](https://github.com/bilalmlkdev) · [Ko-fi](https://ko-fi.com/bilalmlkdev)
