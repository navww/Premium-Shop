# Premium Shop - Next.js E-commerce Application

A sophisticated e-commerce web application built with Next.js that offers a premium shopping experience.

## Features at a Glance

- 🎨 Modern UI with dark/light mode
- 🔒 Secure authentication
- 🛍️ Advanced product browsing
- 🛒 Persistent drag-and-drop shopping cart (desktop only)
- 👤 User profiles
- 📱 Fully responsive design (one card per line on mobile)
- ⚡ Server-side rendering
- 🔄 Offline support
- 🏷️ Category browsing
- 💾 State persistence with Zustand

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Zustand (State Management)
- React Query
- Framer Motion

## Getting Started

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/premium-shop.git
    cd premium-shop
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Set up environment variables**
    - Copy `.env.example` to `.env.local` and fill in your API keys and secrets.
4. **Run the development server**
    ```bash
    npm run dev
    ```
5. **Open your browser**
    - Visit [http://localhost:3000](http://localhost:3000)

## Folder Structure

- `src/app/products/` – Product listing, grid, and product card styles
- `src/app/categories/` – Category browsing and filtering
- `src/components/DraggableCartItem.tsx` – Drag-and-drop product card
- `src/components/DroppableCart.tsx` – Desktop cart drop area
- `src/store/` – Zustand state management
- `src/services/` – API utilities

## Customizing Styles

- Main styles for products: `src/app/products/products.css`
- Main styles for categories: `src/app/categories/categories.css`
- Drag-and-drop card: `src/components/DraggableCartItem.css`

You can adjust breakpoints, colors, and spacing in these files to match your brand.

## Drag-and-Drop Cart

- The drag cart feature is available on desktop (width > 900px).
- On mobile and tablet, the cart is hidden for a cleaner experience.

## Mobile Responsiveness

- Product and category cards are always one per line on mobile for clarity.
- Gaps, font sizes, and paddings are optimized for small screens.

## API Endpoints

- Products: https://fakestoreapi.com/products
- Carts: https://fakestoreapi.com/carts
- Users: https://fakestoreapi.com/users

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
